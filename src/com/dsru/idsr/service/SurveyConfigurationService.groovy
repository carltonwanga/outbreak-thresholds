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
class SurveyConfigurationService {

    public String getSurveyInvestigations(Map parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();

        def sqlParams = [start: start, limit: limit];
        def countParamStatus = false;

        def queryStr  = """SELECT
            survey_investigation.id,
            survey_investigation.disease,
            survey_investigation.title,
            survey_investigation.notes,
            survey_investigation.is_active,
            survey_investigation.configuration_complete,
            survey_investigation.time_added,
            disease_mapping.disease_name
            FROM
            survey_investigation
            INNER JOIN disease_mapping ON survey_investigation.disease = disease_mapping.id
        """+" LIMIT ?.limit OFFSET ?.start";

        def countStr = "SELECT COUNT(1) FROM survey_investigation ";
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);


    }

    public String addSurveyInvestigation(String reqJson,long currentUser){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map investigationParams = new JsonSlurper().parseText(reqJson);
        investigationParams.put("added_by",currentUser);
        Map res = [success: true, status: 0, message: ""];
        def insertRes = sql.executeInsert("INSERT INTO survey_investigation(disease, title, notes, is_active, added_by) VALUES(?.disease, ?.title, ?.notes, TRUE, ?.added_by)",investigationParams);
        sql.close();
        if(insertRes){
            res.status = 1;
            res.message = "Survey added successfully";
        }else{
            res.message = "Failed to add Survey";
        }
        return JsonOutput.toJson(res);
    }

    public String editSurveyInvestigation(String reqJson,long surveyId){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map investigationParams = new JsonSlurper().parseText(reqJson);
        investigationParams.put("id",surveyId);

        Map res = [success: true, status: 0, message: ""];
        def updateRes = sql.executeUpdate("UPDATE survey_investigation SET disease = ?.disease, title = ?.title, notes = ?.notes WHERE id = ?.id ",investigationParams);
        sql.close();
        if(updateRes){
            res.status = 1;
            res.message = "Survey updated successfully";
        }else{
            res.message = "Failed to update Survey";
        }
        return JsonOutput.toJson(res);
    }

    public static String changeStatus(int surveyId,boolean value){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map params = ["id":surveyId,"status":value];
        def res = [success:true,status:0,message:'Could not reset survey status']; ;
        def affectedRows = sql.executeUpdate("UPDATE survey_investigation SET is_active = ?.status WHERE id =?.id",params);
        sql.close();
        if(affectedRows == 1){
            res = [success:true,status:1,message:'The survey status has been reset'];
        }else{
            res = [success:true,status:0,message:'Could not reset survey status'];
        }

        return JsonOutput.toJson(res);


    }

    public String getSurveyResponseTypes(Map parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();

        def sqlParams = [start: start, limit: limit];
        def countParamStatus = false;

        def queryStr  = """SELECT *
            FROM survey_response_types
        """+" LIMIT ?.limit OFFSET ?.start";

        def countStr = "SELECT COUNT(1) FROM survey_response_types ";
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);


    }

    public String getNavigationConditions(int responseTypeId,Map parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();

        def sqlParams = [start: start, limit: limit, responseId:responseTypeId];
        def countParamStatus = true;

        def queryStr  = """SELECT *
            FROM survey_navigation_conditions
            WHERE (response_type_id = ?.responseId OR response_type_id = 0)
        """+" LIMIT ?.limit OFFSET ?.start";

        def countStr = "SELECT COUNT(1) FROM survey_navigation_conditions WHERE (response_type_id = ?.responseId OR response_type_id = 0)";
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);


    }

    public String getSurveyQuestions(long surveyId){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = [success:true];

        def parentQuestion =sql.firstRow("""SELECT
        "public".survey_questions."id",
        TRUE  AS expanded,
        "public".survey_questions.survey_id,
        "public".survey_questions.question_narrative,
        "public".survey_response_types."name",
        "public".survey_questions.preceeding_question_id,
        "public".survey_questions.notes,
        "public".survey_questions.condition_value,
        "public".survey_questions.condition_id,
        "public".survey_navigation_conditions.condition_statement,
        "public".survey_navigation_conditions.condition_narration
        FROM
        "public".survey_questions
        INNER JOIN "public".survey_response_types ON "public".survey_questions.expected_response_type = "public".survey_response_types."id"
        INNER JOIN "public".survey_navigation_conditions ON "public".survey_questions.condition_id = "public".survey_navigation_conditions."id"
        WHERE condition_id = 8
    """);
        int parentQuestionId = parentQuestion.get("id");

        def childrenQuestions = sql.rows("""SELECT
        "public".survey_questions."id",
        TRUE  AS expanded,
        "public".survey_questions.survey_id,
        "public".survey_questions.question_narrative,
        "public".survey_response_types."name" AS expected_response_name,
        "public".survey_questions.preceeding_question_id,
        "public".survey_questions.notes,
        "public".survey_questions.condition_value,
        "public".survey_questions.condition_id,
        "public".survey_navigation_conditions.condition_statement AS condition_name,
        "public".survey_navigation_conditions.condition_narration
        FROM
        "public".survey_questions
        INNER JOIN "public".survey_response_types ON "public".survey_questions.expected_response_type = "public".survey_response_types."id"
        INNER JOIN "public".survey_navigation_conditions ON "public".survey_questions.condition_id = "public".survey_navigation_conditions."id"
        WHERE  preceeding_question_id = ?

    """,parentQuestionId);

        parentQuestion.put("children",childrenQuestions);

        def dataMap = [expanded: true, children: parentQuestion];
        res.put('data',dataMap);
        res.put('status',1);

        sql.close();
        return JsonOutput.toJson(res);
    }


}
