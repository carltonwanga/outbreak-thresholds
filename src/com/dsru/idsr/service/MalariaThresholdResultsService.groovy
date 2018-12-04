package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.sql.Sql
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
        malaria_outbreak_threshold_computation_results.lab_positivity
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

    public String fetchBatchOperations(def parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();
        def query = params.query?.toInteger();

        def countParamStatus = false;
        def filterStr = "";

        if(query){
            filterStr = " WHERE id = ?.batchId ";
            countParamStatus = true;
        }
        def sqlParams = [start: start, limit: limit, batchId: query];

        def queryStr  = "SELECT * FROM outbreak_threshold_computation_batch "+filterStr+" LIMIT ?.limit OFFSET ?.start";
        def countStr = "SELECT COUNT(1) FROM outbreak_threshold_computation_batch "+filterStr;
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);

    }

    public String fetchBatchErrors(def parameterMap,long batchId){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();
        def countParamStatus = true;

        def sqlParams = [start: start, limit: limit,batchId: batchId];

        def queryStr  = """SELECT outbreak_threshold_computation_errors.*,sub_county.name AS sub_county_name FROM outbreak_threshold_computation_errors,sub_county WHERE outbreak_threshold_computation_errors.sub_county = sub_county.dhis2_code AND batch_id = ?.batchId LIMIT ?.limit OFFSET ?.start""";
        def countStr = "SELECT COUNT(1) FROM outbreak_threshold_computation_errors WHERE batch_id = ?.batchId";
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
                    SELECT malaria_outbreak_threshold_computation_results.*,
                    sub_county.name sub_county_name
                    FROM malaria_outbreak_threshold_computation_results,sub_county
                    WHERE
                     malaria_outbreak_threshold_computation_results.sub_county = sub_county.dhis2_code
                     AND malaria_outbreak_threshold_computation_results.sub_county = ?.subCounty
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
}
