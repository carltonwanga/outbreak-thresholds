package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.util.CommonUtils
import org.springframework.stereotype.Service

@Service
class SubCountyService {
    public String fetchSubCounties(def parameterMap){

        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();
        def countyCode = params.county;

        def countParamStatus = false;

        def countyCodeFilter = "";
        if(countyCode){
            countyCodeFilter = " WHERE county_code = ?.countyCode ";
            countParamStatus  = true;
        }

        def sqlParams = [start: start, limit: limit,countyCode:countyCode];

        def queryStr  = "SELECT * FROM sub_county "+countyCodeFilter+" LIMIT ?.limit OFFSET ?.start";
        def countStr = "SELECT COUNT(1) FROM sub_county "+countyCodeFilter;
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);

    }
}
