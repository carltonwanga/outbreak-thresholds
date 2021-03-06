package com.dsru.idsr.service

import com.dsru.idsr.constant.Constants
import com.dsru.idsr.constant.Dhis2Api
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.dhis2.Api
import com.dsru.idsr.model.SubCountyWeekResultItem
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovy.sql.Sql
import groovyx.net.http.HTTPBuilder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service
import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.GET

@Service
class MalariaThresholdsComputationService {

    public final String IDSR_MALARIA_DEATHS_INDICATOR = "vqyFNp0Tyjj";
    public final String IDSR_MALARIA_POSITIVITY_INDICATOR = "cILf2i4484b";
    public final String IDSR_MALARIA_REPORTING_RATE_INDICATOR = "zJrL4HQqYmD.REPORTING_RATE";

    @Autowired
    AuditService auditService;

    public List fetchMalariaIndicatorsFromDhis2(int week,int currentYear){
        List dataValuesResults = [];

        String periodDimension = "&dimension=pe:${currentYear}W${week}";
        String dataElementDimension = "&dimension=dx:${IDSR_MALARIA_DEATHS_INDICATOR};${IDSR_MALARIA_POSITIVITY_INDICATOR};${IDSR_MALARIA_REPORTING_RATE_INDICATOR}";

        def http = new HTTPBuilder(Dhis2Api.SUB_COUNTY_WEEK_MALARIA_INDICATORS_BASE_URL+periodDimension+dataElementDimension);
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

    public List fetchDhis2SubCountyMalariaWeeklySummaries(int week,int currentYear){

        List dataValuesResults = [];

        String periodDimension = "&dimension=pe:";
        for(int year = Dhis2Api.DHIS2_START_YEAR;year<=currentYear;year++){
            if(year!=currentYear){
                periodDimension += (year+"W"+week+";");
            }else {
                periodDimension += (year+"W"+week);
            }
        }

        def http = new HTTPBuilder(Dhis2Api.SUB_COUNTY_WEEKLY_MALARIA_URL+periodDimension);
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

    public List fetchHistoricSubCountyMalariaWeeklySummaries(int week,int currentYear){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        String malaria_disease_code = sql.firstRow("SELECT disease_mapping.dhis2_code FROM disease_mapping WHERE id = ?",1).get("dhis2_code");
        List weekHistoricRecords = [];
        List historicYearsToFetch = [];

        for(int historicYear = Constants.HISTORIC_DATA_START_YEAR;historicYear<Dhis2Api.DHIS2_START_YEAR;historicYear++){
            if(currentYear-historicYear <=5){
                historicYearsToFetch.add(historicYear)
            }
        }

        Map queryParams = [malariaCode:malaria_disease_code,week:week];
        String yearsParam = historicYearsToFetch.join(",");
        //println(queryParams);
        def historicRecordsRs = sql.rows("""SELECT
            disease_code,
            year||'W'||week AS period,
            sub_county_code,
            cases_less_than_5+cases_greater_than_5 AS total_cases,
            week,
            year
            FROM
            moh_505_historic_data
            WHERE 
            disease_code = ?.malariaCode
            AND week = ?.week
            AND year IN ($yearsParam) 
        """,queryParams);

        if(historicRecordsRs){
            historicRecordsRs.each {
                SubCountyWeekResultItem subCountyWeekResultItem = new SubCountyWeekResultItem(
                        it.disease_code,
                        it.period,
                        it.sub_county_code,
                        it.total_cases.intValue(),
                        it.week,
                        it.year
                );
                weekHistoricRecords.add(subCountyWeekResultItem);
            }
        }
        sql.close();

        return weekHistoricRecords;


    }

    public long computeMalariaThresholds(int week,int currentYear){


        List<SubCountyWeekResultItem> allWeeksSubCountyRecords = fetchDhis2SubCountyMalariaWeeklySummaries(week,currentYear)+fetchHistoricSubCountyMalariaWeeklySummaries(week,currentYear);
        List<SubCountyWeekResultItem> malariaIndicators = fetchMalariaIndicatorsFromDhis2(week,currentYear);

        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();

        Sql sql = new Sql(dataSource);
        String malaria_disease_code = sql.firstRow("SELECT disease_mapping.dhis2_code FROM disease_mapping WHERE id = ?",1).get("dhis2_code");
        def subCounties = sql.rows("SELECT * FROM sub_county");

        Map batchInsertParams = [week:week,year:currentYear,disease:malaria_disease_code];

        def batchDetails = sql.executeInsert("INSERT INTO outbreak_threshold_computation_batch(week, year,disease) VALUES (?.week,?.year,?.disease)",batchInsertParams);
        long batchId = batchDetails.get(0).get(0);

        int batchErrorsCount = 0;
        int thresholdCalculationCount = 0;

        subCounties.each {
            String subCountyCode = it.get("dhis2_code");
            SubCountyWeekResultItem currentWeekItem = allWeeksSubCountyRecords.find {
                return (it.year == currentYear) && (it.subCounty == subCountyCode);
            }

            if(currentWeekItem){
                List<SubCountyWeekResultItem> previousWeeksResults = allWeeksSubCountyRecords.findAll {
                    return (it.year != currentYear) && (it.subCounty == subCountyCode);
                }

                int prevWeeksDataSetCount = previousWeeksResults.size();
                if(prevWeeksDataSetCount>=3){
                    thresholdCalculationCount++;
                    List prevDataValues = [];
                    previousWeeksResults.each {
                        prevDataValues.add(it.value);
                    }

                    double [] prevDataValuesArray = prevDataValues.toArray();

                    long casesReported = currentWeekItem.value;

                    long alertThreshold = (long) Math.round(quartile(prevDataValuesArray,75));
                    long actionThreshold = (long)Math.round(calculateMean(prevDataValuesArray)+(2*calculateSD(prevDataValuesArray)));
                    long casesReportedMean = (long) Math.round(calculateMean(prevDataValuesArray));
                    long casesReportedSD = (long) Math.round(calculateSD(prevDataValuesArray));


                    //Calculate C-SUM
                    //(Last week Mean + current week mean + Next week mean)/3

                    //Check if next week mean is available
                    int nextWeek = week+1;
                    int prevWeek = week-1;
                    int prevPrevWeek = prevWeek-1;

                    def cSumMeans = sql.rows("SELECT mean,c_sum,c_sum_1_96_sd,cases_reported_sd,week FROM malaria_outbreak_threshold_computation_results WHERE is_active AND week IN($nextWeek,$week,$prevWeek,$prevPrevWeek) AND year = $currentYear AND sub_county = ${subCountyCode}");

                    def nextWeekMeanRes  = cSumMeans.find {
                        return it.week == nextWeek;
                    }
                      Long nextWeekMean = nextWeekMeanRes?.get("mean");


                    def prevWeekMeanRes  = cSumMeans.find {
                        return it.week == prevWeek;
                    }
                    Long prevWeekMean = prevWeekMeanRes?.get("mean");
                    Long prevWeekCsum = prevWeekMeanRes?.get("c_sum");
                    Long prevWeekCsum196Sd = prevWeekMeanRes?.get("c_sum_1_96_sd");
                    Long prevWeekCasesReportedSd = prevWeekMeanRes?.get("cases_reported_sd");


                    def prevPrevWeekMeanRes  = cSumMeans.find {
                        return it.week == prevPrevWeek;
                    }
                    Long prevPrevWeekMean = prevPrevWeekMeanRes?.get("mean");


                    Long currentWeekCsum,currentWeekCsum196Sd;

                    //If previous week mean not available and the week before is available calcuate prev Csum
                    if(!prevWeekCsum &&prevWeekMean && prevPrevWeekMean){
                        Long previousWeekCSumCalc = (long)Math.round((prevPrevWeek+prevWeekMean+casesReportedMean)/3);
                        Long previousWeekCSum196Sd = previousWeekCSumCalc+(1.96*prevWeekCasesReportedSd);

                        //Update previous week C-Sum
                        Map prevCsumUpdateParams = [csum:previousWeekCSumCalc,csum196sd:previousWeekCSum196Sd,week: prevWeek,year: currentYear,subCounty: subCountyCode];
                        sql.executeUpdate("UPDATE malaria_outbreak_threshold_computation_results SET c_sum = ?.csum,c_sum_1_96_sd = ?.csum196sd WHERE week = ?.week AND year = ?.year AND is_active AND sub_county = ?.subCounty",prevCsumUpdateParams);

                    }

                    if(prevWeekMean && nextWeekMean){
                        currentWeekCsum = (long)Math.round((nextWeekMean+prevWeekMean+casesReportedMean)/3);
                        currentWeekCsum196Sd = currentWeekCsum+(1.96*casesReportedSD);

                    }




                    def reportedDeathsMap = malariaIndicators.find {
                        return it.week == currentWeekItem.week && it.year == currentWeekItem.year && it.subCounty == currentWeekItem.subCounty && it.dataElement == IDSR_MALARIA_DEATHS_INDICATOR;
                    }
                    Long reportedDeaths = reportedDeathsMap?.value;

                    def reportedPositivityMap = malariaIndicators.find {
                        return it.week == currentWeekItem.week && it.year == currentWeekItem.year && it.subCounty == currentWeekItem.subCounty && it.dataElement == IDSR_MALARIA_POSITIVITY_INDICATOR;
                    }
                    Integer positivityRate = reportedPositivityMap?.value;

                    def reportingRateMap = malariaIndicators.find {
                        return it.week == currentWeekItem.week && it.year == currentWeekItem.year && it.subCounty == currentWeekItem.subCounty && it.dataElement == IDSR_MALARIA_REPORTING_RATE_INDICATOR;
                    }

                    Double reportingRate = reportingRateMap?.value;
                    Integer extrapolatedCases = 0;
                    if(reportingRate){
                        extrapolatedCases = (Integer)Math.round((casesReported * 100/reportingRate));
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


                    Map deactivatePreviousParams = [week:week,subCounty: subCountyCode,year: currentYear];

                    Map thresholdComputationParams = [
                            week:week,subCounty: subCountyCode,year: currentYear,
                            casesReported:casesReported,alertThreshold:alertThreshold,actionThreshold:actionThreshold,
                            inference:inference,batchId: batchId,computationDatasetCount:prevWeeksDataSetCount,
                            expectedDatasetCount:5,active:true,
                            reportedDeaths:reportedDeaths,positivityRate:positivityRate,mean:casesReportedMean,csum:currentWeekCsum,csum196sd: currentWeekCsum196Sd, reportingRate:reportingRate,extrapolatedCases:extrapolatedCases,casesSD:casesReportedSD

                    ];

                    sql.withTransaction {
                        sql.executeUpdate("UPDATE malaria_outbreak_threshold_computation_results SET is_active = FALSE WHERE sub_county = ?.subCounty AND week = ?.week AND year =?.year",deactivatePreviousParams);
                        sql.executeInsert("""INSERT INTO malaria_outbreak_threshold_computation_results
                                                (week, year, sub_county, cases_reported, alert_threshold, action_threshold,
                                                 inference_id, batch_id, computation_dataset_count, 
                                                 expected_dataset_count,is_active,deaths,lab_positivity,mean,c_sum,c_sum_1_96_sd,reporting_rate,extrapolated_cases,cases_reported_sd) 
                                                 VALUES 
                                                 (?.week,?.year,?.subCounty,?.casesReported,?.alertThreshold,?.actionThreshold,
                                                  ?.inference,?.batchId,?.computationDatasetCount,
                                                  ?.expectedDatasetCount,?.active,?.reportedDeaths,?.positivityRate,?.mean,?.csum,?.csum196sd,?.reportingRate,?.extrapolatedCases,?.casesSD
                                                 )
                        """,thresholdComputationParams);
                    }



                }else{
                    batchErrorsCount++;
                    String errorNarration = "Week historic data does not meet the required threshold of over 3 data sets. Only $prevWeeksDataSetCount sets found";
                    Map errorParams = [subCounty:subCountyCode, narration:errorNarration, batchId:batchId, errorCode:202];
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

    public  double quartile(double[] values, double lowerPercent) {

        int arraySize = values.length;

        double[] v = new double[arraySize];
        System.arraycopy(values, 0, v, 0, arraySize);
        Arrays.sort(v);

        double theQuartile;
        if(values.length % 2 == 0 || arraySize==3){
            int n = (int) Math.floor(v.length * lowerPercent / 100);
            theQuartile = v[n];

        }else{

            int upperN = (int) Math.round(v.length * lowerPercent / 100);
            int lowerN = (int) Math.floor(v.length * lowerPercent / 100);

            theQuartile = (v[upperN]+v[lowerN])/2;
        }


        return theQuartile;

    }

    public  double calculateMean(double[] numArray) {
        double sum = 0.0;
        int length = numArray.length;

        for(double num : numArray) {
            sum += num;
        }

        double mean = sum/length;
        return mean;

    }

    public double calculateSD(double[] numArray) {
        double standardDeviation = 0.0;
        int length = numArray.length;


        double mean = calculateMean(numArray);

        for(double num: numArray) {
            standardDeviation += Math.pow(num - mean, 2);
        }

        return Math.sqrt(standardDeviation/(length-1));
    }


}
