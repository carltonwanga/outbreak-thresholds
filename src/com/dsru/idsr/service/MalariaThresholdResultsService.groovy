package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.sql.Sql
import org.apache.commons.lang.StringUtils
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service

@Service
class MalariaThresholdResultsService {

    public String fetchThresholdResults(def parameterMap,boolean paginated){

        def params = CommonUtils.flattenListParam(parameterMap);
        def paginationStr = "";
        if(paginated){
            def start = params.start?.toInteger();
            def limit = params.limit?.toInteger();
            paginationStr = """ LIMIT $limit OFFSET $start """;

        }

        def countParamStatus = false;

        def filterQuery = "";

        if(params.county){
            filterQuery+=" AND county.dhis2_code = '${params.county}' ";
        }

        if(params.subcounty){
            filterQuery+=" AND malaria_outbreak_threshold_computation_results.sub_county = '${params.subcounty}' ";

        }

        if(params.week){
            filterQuery+=" AND malaria_outbreak_threshold_computation_results.week = ${params.week} ";

        }

        if(params.year){
            filterQuery+=" AND malaria_outbreak_threshold_computation_results.year = ${params.year} ";

        }

        if(params.inference){
            filterQuery+=" AND malaria_outbreak_threshold_computation_results.inference_id = ${params.inference} ";

        }

        if(params.status == "active"){
            filterQuery+=" AND malaria_outbreak_threshold_computation_results.is_active ";

        }

        if(params.confirmation){
            filterQuery+=" AND malaria_outbreak_threshold_computation_results.result_confirmed = ${params.confirmation} ";

        }

        def sqlParams = [:];

        def queryStr  = """SELECT
        malaria_outbreak_threshold_computation_results.id,
        malaria_outbreak_threshold_computation_results.week,
        malaria_outbreak_threshold_computation_results.year,
        sub_county.name sub_county_name,
        sub_county.map_code sub_county_map_code,
        county.name county_name,
        county.map_code county_map_code,
        malaria_outbreak_threshold_computation_results.time_calculated,
        malaria_outbreak_threshold_computation_results.cases_reported,
        malaria_outbreak_threshold_computation_results.alert_threshold,
        malaria_outbreak_threshold_computation_results.action_threshold,
        malaria_outbreak_threshold_computation_results.sub_county,
        outbreak_threshold_detection_inferences.narration,
        outbreak_threshold_detection_inferences.name inference_name,
        outbreak_threshold_detection_inferences.alert_color_codes,
        malaria_outbreak_threshold_computation_results.inference_id,
        malaria_outbreak_threshold_computation_results.batch_id,
        malaria_outbreak_threshold_computation_results.computation_dataset_count,
        malaria_outbreak_threshold_computation_results.expected_dataset_count,
        malaria_outbreak_threshold_computation_results.is_active,
        malaria_outbreak_threshold_computation_results.deaths,
        malaria_outbreak_threshold_computation_results.lab_positivity,
        malaria_outbreak_threshold_computation_results.mean,
        malaria_outbreak_threshold_computation_results.c_sum,
        malaria_outbreak_threshold_computation_results.c_sum_1_96_sd,
        malaria_outbreak_threshold_computation_results.reporting_rate,
        malaria_outbreak_threshold_computation_results.extrapolated_cases,
        malaria_outbreak_threshold_computation_results.cases_reported_sd,
        malaria_outbreak_threshold_computation_results.result_confirmed,
        malaria_outbreak_threshold_computation_results.confirmation_notes
        FROM
        malaria_outbreak_threshold_computation_results,
        sub_county,
        county,
        outbreak_threshold_detection_inferences
        WHERE
        malaria_outbreak_threshold_computation_results.sub_county = sub_county.dhis2_code AND
        sub_county.county_code = county.dhis2_code AND
        malaria_outbreak_threshold_computation_results.inference_id = outbreak_threshold_detection_inferences.id
        """+filterQuery+
        paginationStr;

        def countStr ="""SELECT COUNT(1) FROM
         malaria_outbreak_threshold_computation_results,
        sub_county,
        county,
        outbreak_threshold_detection_inferences
        WHERE
        malaria_outbreak_threshold_computation_results.sub_county = sub_county.dhis2_code AND
        sub_county.county_code = county.dhis2_code AND
        malaria_outbreak_threshold_computation_results.inference_id = outbreak_threshold_detection_inferences.id
        """+filterQuery;

        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);

    }

    public String subCountyActiveWeeklyResults(def parameterMap){
        println(parameterMap);
        def params = CommonUtils.flattenListParam(parameterMap);
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();

        Map res = [success:true,status:0];

        List selectSubCounties  = parameterMap.get("subcounty");
        String multSubCounties = "'"+ selectSubCounties.join("','")+ "'";
        println(multSubCounties);

        Map sqlParams = [
                year:params.year.toInteger(),
                subCounty:multSubCounties
        ];

        Sql sql = new Sql(dataSource);
        def data = sql.rows("""
                    SELECT malaria_outbreak_threshold_computation_results.*,
                    sub_county.name sub_county_name
                    FROM malaria_outbreak_threshold_computation_results,sub_county
                    WHERE
                     malaria_outbreak_threshold_computation_results.sub_county = sub_county.dhis2_code
                     AND malaria_outbreak_threshold_computation_results.sub_county IN ($multSubCounties)
                     AND malaria_outbreak_threshold_computation_results.year = ?.year
                     AND malaria_outbreak_threshold_computation_results.is_active = TRUE
                     ORDER BY malaria_outbreak_threshold_computation_results.week
                    
        """,sqlParams);
        if(data){
            res.put("data",data);
            res.status = 1;
            res.put("total",data.size());
        }
        sql.close();
        return JsonOutput.toJson(res);

    }

    public String updateThresholdConfirmationStatus(def parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);

        Map res = [success: true,status: 0];
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        params.put("parsedId",Integer.parseInt(params.get("id")));
        params.put("results_confirmed",Boolean.valueOf(params.get("status")));
        int update = sql.executeUpdate("UPDATE malaria_outbreak_threshold_computation_results SET result_confirmed = ?.results_confirmed, confirmation_notes = ?.confirmation_notes WHERE id = ?.parsedId", params);
        sql.close();
        if(update > 0){
            res.put("status",1);
        }
        return JsonOutput.toJson(res);
    }

}
