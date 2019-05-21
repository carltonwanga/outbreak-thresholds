package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovy.sql.Sql
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service

@Service
class SubCountyService {
    public String fetchSubCounties(def parameterMap){

        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();
        def countyCode = params.county;
        def query = params.query;

        def countParamStatus = false;

        def queryFilter = ""

        if(countyCode && !query){
            queryFilter = " WHERE county_code = ?.countyCode ";
            countParamStatus  = true;
        } else if(query && !countyCode){
            queryFilter = " WHERE name ILIKE '%$query%' ";

        }else if(query && countyCode){
            queryFilter = " WHERE county_code = ?.countyCode AND name ILIKE '%$query%' ";
            countParamStatus  = true;
        }


        def sqlParams = [start: start, limit: limit,countyCode:countyCode];

        def queryStr  = "SELECT * FROM sub_county "+queryFilter+" LIMIT ?.limit OFFSET ?.start";
        def countStr = "SELECT COUNT(1) FROM sub_county "+queryFilter;

        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);

    }

    public static String editSubCounty(String body,long id){
        Map params = new JsonSlurper().parseText(body);

        DriverManagerDataSource dataSource = DataSourceFactory.getTestApplication();
        Sql sql = new Sql(dataSource);
        Map res = [success:true,status:0];
        def affectedRows  = sql.executeUpdate("UPDATE sub_county SET name = ?.name,map_code = ?.map_code,geo_latitude = ?.geo_latitude, geo_longitude = ?.geo_longitude,geo_code_name = ?.geo_code_name,population_estimate = ?.population_estimate,focal_person = ?.focal_person,focal_person_tel = ?.focal_person_tel WHERE id = ?.id",params);
        res['status'] = affectedRows;
        return JsonOutput.toJson(res);
    }
}
