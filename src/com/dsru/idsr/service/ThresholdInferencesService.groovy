package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.util.CommonUtils
import org.springframework.stereotype.Service

@Service
class ThresholdInferencesService {
    public String fetchThresholdInferences(def parameterMap){

        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();

        def countParamStatus = false;

        def sqlParams = [start: start, limit: limit];

        def queryStr  = "SELECT * FROM outbreak_threshold_detection_inferences "+" LIMIT ?.limit OFFSET ?.start";
        def countStr = "SELECT COUNT(1) FROM outbreak_threshold_detection_inferences";
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);

    }
}
