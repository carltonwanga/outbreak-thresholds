package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.util.CommonUtils
import org.springframework.stereotype.Service

@Service
class CountyService {

    public String fetchCounties(def parameterMap){

        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();

        def countParamStatus = false;

        def sqlParams = [start: start, limit: limit];

        def queryStr  = "SELECT * FROM county "+" LIMIT ?.limit OFFSET ?.start";
        def countStr = "SELECT COUNT(1) FROM county ";
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);

    }
}
