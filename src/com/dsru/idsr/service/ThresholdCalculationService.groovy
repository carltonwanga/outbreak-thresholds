package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovy.sql.Sql
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service

@Service
class ThresholdCalculationService {

    @Autowired
    AuditService auditService;

    @Autowired
    MalariaThresholdsComputationService malariaThresholdsComputationService;

    @Autowired
    MeningitisThresholdComputationService meningitisThresholdComputationService;


    public String checkIfPeriodThresholdCalculated(def parameterMap) {
        def params = CommonUtils.flattenListParam(parameterMap);
        Map queryParams = [week:params.week?.toInteger(),year:params.year?.toInteger(),disease:params.disease?.toInteger()];
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = [success:true,status:0];
        String diseaseCode = sql.firstRow("SELECT dhis2_code FROM disease_mapping WHERE id = ?.disease",queryParams).get("dhis2_code");
        queryParams.put("diseaseCode",diseaseCode);

        def existingCalc = sql.firstRow("SELECT id FROM outbreak_threshold_computation_batch WHERE week = ?.week AND year = ?.year AND disease = ?.diseaseCode",queryParams);
        if(existingCalc){
            res.status = 1;
        }

        return JsonOutput.toJson(res);
    }

    public String requestThresholdCalculation(String requestStr,String ip,String user){
        Map params = new JsonSlurper().parseText(requestStr);
        Map res = [success:true,status:0];
        int diseaseId = params.get("disease");

        def batchId;

        if(diseaseId == 1){
            auditService.logAuditEvent("Computation of malaria thresholds",ip,user,"Week:"+params.week+",Year:"+params.year);
            batchId = malariaThresholdsComputationService.computeMalariaThresholds(params.week,params.year);

        }else if(diseaseId == 2){
            auditService.logAuditEvent("Computation of meningitis thresholds",ip,user,"Week:"+params.week+",Year:"+params.year);
            batchId = meningitisThresholdComputationService.computeMeningitisThresholds(params.week,params.year);

        }

        if(batchId){
            res.status = 1;
            res.put("data",batchId);
        }
        return JsonOutput.toJson(res);

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

        def queryStr  = """SELECT outbreak_threshold_computation_batch.*,
                            disease_mapping.disease_name
                             FROM outbreak_threshold_computation_batch,disease_mapping
                             WHERE outbreak_threshold_computation_batch.disease = disease_mapping.dhis2_code
                              """+filterStr+" LIMIT ?.limit OFFSET ?.start";
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


}
