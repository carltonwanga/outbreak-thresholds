package com.dsru.idsr.service

import com.dsru.idsr.constant.Dhis2Api
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.dhis2.Api
import com.dsru.idsr.model.SubCountyWeekResultItem
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.sql.Sql
import groovyx.net.http.HTTPBuilder
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service

import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.GET

@Service
class MeningitisThresholdComputationService {

    public int MENINGITIS_ALERT_THRESHOLD_CASES_UNDER_30000 = 2;
    public int MENINGITIS_ALERT_THRESHOLD_30000_100000 = 3;
    public int MENINGITIS_ACTION_THRESHOLD_CASES_UNDER_30000 = 5;
    public int MENINGITIS_ACTION_THRESHOLD_30000_100000 = 10;

    public List fetchDhis2SubCountyMeningitisWeeklySummaries(int week,int currentYear){

        List dataValuesResults = [];
        String periodDimension = "&dimension=pe:"+currentYear+"W"+week;

        def http = new HTTPBuilder(Dhis2Api.SUB_COUNTY_WEEKLY_MENINGITIS_URL+periodDimension);
        def basicAuthToken = Api.generateOAuthBasicAuthToken();

        http.request(GET,JSON) { req ->

            headers.'Authorization' = 'Basic '+basicAuthToken;
            response.success = { resp, data ->
                def dataValues = data.dataValues;
                dataValues.each{
                    def weekYear  = it.period.split("W");
                    def dataYear = weekYear[0];
                    def dataWeek = weekYear[1];
                    SubCountyWeekResultItem subCountyWeekResultItem = new SubCountyWeekResultItem(
                            it.dataElement,
                            it.period,
                            it.orgUnit,
                            Double.valueOf(it.value).intValue(),
                            Integer.parseInt(dataWeek),
                            Integer.parseInt(dataYear)
                    )

                    dataValuesResults.add(subCountyWeekResultItem);

                }
            }
            response.'failure' = { resp  ->

            }
        }

        return dataValuesResults;


    }

    public long computeMeningitisThresholds(int week,int currentYear){

        List<SubCountyWeekResultItem> weekSubCountyRecords = fetchDhis2SubCountyMeningitisWeeklySummaries(week,currentYear);

        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();

        Sql sql = new Sql(dataSource);
        String meningitis_disease_code = sql.firstRow("SELECT disease_mapping.dhis2_code FROM disease_mapping WHERE id = ?",2).get("dhis2_code");

        def subCounties = sql.rows("SELECT * FROM sub_county");

        Map batchInsertParams = [week:week,year:currentYear,disease:meningitis_disease_code];

        def batchDetails = sql.executeInsert("INSERT INTO outbreak_threshold_computation_batch(week, year,disease) VALUES (?.week,?.year,?.disease)",batchInsertParams);
        long batchId = batchDetails.get(0).get(0);

        int batchErrorsCount = 0;
        int thresholdCalculationCount = 0;

        subCounties.each {
            String subCountyCode = it.get("dhis2_code");

            SubCountyWeekResultItem currentWeekItem = weekSubCountyRecords.find {
                return (it.subCounty == subCountyCode);
            }

            if(currentWeekItem){
                Long subCountyPopulation = it.get("population_estimate");

                if(subCountyPopulation){
                    long casesReported = currentWeekItem.value;

                    long alertThreshold;
                    long actionThreshold;

                    if(subCountyPopulation < 30000){
                        alertThreshold =  (long)Math.round(MENINGITIS_ALERT_THRESHOLD_CASES_UNDER_30000*subCountyPopulation/30000);
                        actionThreshold = (long)Math.round(MENINGITIS_ACTION_THRESHOLD_CASES_UNDER_30000*subCountyPopulation/30000);
                    }else {
                        alertThreshold =  (long)Math.round(MENINGITIS_ALERT_THRESHOLD_30000_100000*subCountyPopulation/100000);
                        actionThreshold = (long)Math.round(MENINGITIS_ACTION_THRESHOLD_30000_100000*subCountyPopulation/100000);
                    }

                    long inference;

                    if(casesReported == 0){
                        inference = 1
                    }else if(casesReported >0 && casesReported<alertThreshold){
                        inference = 2;
                    }else if(casesReported >=alertThreshold && casesReported<actionThreshold){
                        inference = 3;
                    }else if(casesReported>=actionThreshold){
                        inference = 4
                    }

                    thresholdCalculationCount++;

                    Map deactivatePreviousParams = [week:week,subCounty: subCountyCode,year: currentYear];

                    Map thresholdComputationParams = [
                            week:week,subCounty: subCountyCode,year: currentYear,
                            casesReported:casesReported,alertThreshold:alertThreshold,actionThreshold:actionThreshold,
                            inference:inference,batchId: batchId,active:true,populationUsed:subCountyPopulation,active:true

                    ];

                    sql.withTransaction {
                        sql.executeUpdate("UPDATE meningitis_outbreak_threshold_computation_results SET is_active = FALSE WHERE sub_county = ?.subCounty AND week = ?.week AND year =?.year",deactivatePreviousParams);
                        sql.executeInsert("""INSERT INTO meningitis_outbreak_threshold_computation_results
                                                (week, year, sub_county, cases_reported, alert_threshold, action_threshold,
                                                 batch_id, population_used, inference_id, is_active) 
                                                 VALUES 
                                                 (?.week,?.year,?.subCounty,?.casesReported,?.alertThreshold,?.actionThreshold,
                                                 ?.batchId,?.populationUsed,?.inference,?.active
                                                )

                        """,thresholdComputationParams);
                    }

                }else{
                    batchErrorsCount++;
                    String errorNarration = "Population details for sub county could not be found";
                    Map errorParams = [subCounty:subCountyCode, narration:errorNarration, batchId:batchId, errorCode:301];
                    sql.executeInsert("INSERT INTO outbreak_threshold_computation_errors(sub_county, narration, batch_id, error_code) VALUES (?.subCounty,?.narration,?.batchId,?.errorCode)",errorParams);

                }


            }else{
                batchErrorsCount++;
                String errorNarration = "Current week - $week data value not available";
                Map errorParams = [subCounty:subCountyCode, narration:errorNarration, batchId:batchId, errorCode:201];
                sql.executeInsert("INSERT INTO outbreak_threshold_computation_errors(sub_county, narration, batch_id, error_code) VALUES (?.subCounty,?.narration,?.batchId,?.errorCode)",errorParams);


            }

        }

        Map batchUpdateParams = [totalComputed:thresholdCalculationCount,totalErrors:batchErrorsCount,batchId: batchId];
        sql.executeUpdate("UPDATE outbreak_threshold_computation_batch SET total_errors = ?.totalErrors,total_computed=?.totalComputed WHERE id = ?.batchId",batchUpdateParams);

        sql.close();

        return batchId;



    }

}
