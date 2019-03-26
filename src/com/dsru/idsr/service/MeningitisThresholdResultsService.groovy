package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.sql.Sql
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service

@Service
class MeningitisThresholdResultsService {
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
            filterQuery+=" AND meningitis_outbreak_threshold_computation_results.sub_county = '${params.subcounty}' ";

        }

        if(params.week){
            filterQuery+=" AND meningitis_outbreak_threshold_computation_results.week = ${params.week} ";

        }

        if(params.year){
            filterQuery+=" AND meningitis_outbreak_threshold_computation_results.year = ${params.year} ";

        }

        if(params.inference){
            filterQuery+=" AND meningitis_outbreak_threshold_computation_results.inference_id = ${params.inference} ";

        }

        if(params.status == "active"){
            filterQuery+=" AND meningitis_outbreak_threshold_computation_results.is_active ";

        }

        def sqlParams = [:];

        def queryStr  = """SELECT
        meningitis_outbreak_threshold_computation_results.id,
        meningitis_outbreak_threshold_computation_results.week,
        meningitis_outbreak_threshold_computation_results.year,
        sub_county.name sub_county_name,
        sub_county.map_code sub_county_map_code,
        county.name county_name,
        county.map_code county_map_code,
        meningitis_outbreak_threshold_computation_results.time_calculated,
        meningitis_outbreak_threshold_computation_results.cases_reported,
        meningitis_outbreak_threshold_computation_results.alert_threshold,
        meningitis_outbreak_threshold_computation_results.action_threshold,
        meningitis_outbreak_threshold_computation_results.sub_county,
        outbreak_threshold_detection_inferences.narration,
        outbreak_threshold_detection_inferences.name inference_name,
        outbreak_threshold_detection_inferences.alert_color_codes,
        meningitis_outbreak_threshold_computation_results.inference_id,
        meningitis_outbreak_threshold_computation_results.batch_id,
        meningitis_outbreak_threshold_computation_results.population_used,
        meningitis_outbreak_threshold_computation_results.is_active
        FROM
        meningitis_outbreak_threshold_computation_results,
        sub_county,
        county,
        outbreak_threshold_detection_inferences
        WHERE
        meningitis_outbreak_threshold_computation_results.sub_county = sub_county.dhis2_code AND
        sub_county.county_code = county.dhis2_code AND
        meningitis_outbreak_threshold_computation_results.inference_id = outbreak_threshold_detection_inferences.id
        """+filterQuery+
                paginationStr;

        def countStr ="""SELECT COUNT(1)  FROM
        meningitis_outbreak_threshold_computation_results,
        sub_county,
        county,
        outbreak_threshold_detection_inferences
        WHERE
        meningitis_outbreak_threshold_computation_results.sub_county = sub_county.dhis2_code AND
        sub_county.county_code = county.dhis2_code AND
        meningitis_outbreak_threshold_computation_results.inference_id = outbreak_threshold_detection_inferences.id
        """+filterQuery;

        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);

    }

    public String subCountyActiveWeeklyResults(def parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();

        Map res = [success:true,status:0];
        Map sqlParams = [
                year:params.year.toInteger(),
                subCounty:params.subcounty
        ];

        Sql sql = new Sql(dataSource);
        def data = sql.rows("""
                    SELECT meningitis_outbreak_threshold_computation_results.*,
                    sub_county.name sub_county_name
                    FROM meningitis_outbreak_threshold_computation_results,sub_county
                    WHERE
                     meningitis_outbreak_threshold_computation_results.sub_county = sub_county.dhis2_code
                     AND meningitis_outbreak_threshold_computation_results.sub_county = ?.subCounty
                     AND meningitis_outbreak_threshold_computation_results.year = ?.year
                     AND meningitis_outbreak_threshold_computation_results.is_active = TRUE
                     ORDER BY meningitis_outbreak_threshold_computation_results.week
        """,sqlParams);

        if(data){
            res.put("data",data);
            res.status = 1;
            res.put("total",data.size());
        }
        sql.close();
        return JsonOutput.toJson(res);

    }
}


