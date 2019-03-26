package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.util.CommonUtils
import org.springframework.stereotype.Service

@Service
class DiseaseMappingService {

    public String getDiseaseMapping(Map parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();

        def sqlParams = [start: start, limit: limit];
        def countParamStatus = false;

        def queryStr  = " SELECT * FROM disease_mapping "+" LIMIT ?.limit OFFSET ?.start";

        def countStr = "SELECT COUNT(1) FROM disease_mapping";
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);


    }
}
