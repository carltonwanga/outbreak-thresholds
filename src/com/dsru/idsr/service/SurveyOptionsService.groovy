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
class SurveyOptionsService {

    public String getSurveyOptions(Map parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();

        def sqlParams = [start: start, limit: limit];
        def countParamStatus = false;

        def queryStr  = """ SELECT * FROM 
            survey_question_options
        """+" LIMIT ?.limit OFFSET ?.start";

        def countStr = "SELECT COUNT(1) FROM survey_question_options ";
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);


    }

    public String addSurveyOption(String reqJson,long currentUser){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map optionParams = new JsonSlurper().parseText(reqJson);
        optionParams.put("added_by",currentUser);
        Map res = [success: true, status: 0, message: ""];
        def insertRes = sql.executeInsert("INSERT INTO survey_question_options(options_name, is_active) VALUES(?.options_name,true)",optionParams);
        sql.close();
        if(insertRes){
            res.status = 1;
            res.message = "Survey Selection Option added successfully";
        }else{
            res.message = "Failed to add Survey Selection Option";
        }
        return JsonOutput.toJson(res);
    }

    public String editSurveyOption(String reqJson,long surveyId){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map optionParams = new JsonSlurper().parseText(reqJson);
        optionParams.put("id",surveyId);

        Map res = [success: true, status: 0, message: ""];
        def updateRes = sql.executeUpdate("UPDATE survey_question_options SET options_name = ?.options_name WHERE id = ?.id ",optionParams);
        sql.close();
        if(updateRes){
            res.status = 1;
            res.message = "Survey Option updated successfully";
        }else{
            res.message = "Failed to update Option";
        }
        return JsonOutput.toJson(res);
    }

    public static String changeStatus(int surveyId,boolean value){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map params = ["id":surveyId,"status":value];
        def res = [success:true,status:0,message:'Could not reset option status']; ;
        def affectedRows = sql.executeUpdate("UPDATE survey_question_options SET is_active = ?.status WHERE id =?.id",params);
        sql.close();
        if(affectedRows == 1){
            res = [success:true,status:1,message:'The option status has been reset'];
        }else{
            res = [success:true,status:0,message:'Could not reset option status'];
        }

        return JsonOutput.toJson(res);


    }
    public String getSurveyOptionItems(long id,Map parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();

        def sqlParams = [start: start, limit: limit,optionId:id];
        def countParamStatus = true;

        def queryStr  = """ SELECT * FROM 
            survey_option_items WHERE option_id = ?.optionId
        """+" LIMIT ?.limit OFFSET ?.start";

        def countStr = "SELECT COUNT(1) FROM survey_option_items WHERE option_id = ?.optionId";
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);


    }
}
