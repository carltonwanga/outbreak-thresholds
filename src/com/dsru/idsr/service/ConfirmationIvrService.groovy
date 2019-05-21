package com.dsru.idsr.service

import com.dsru.idsr.constant.Dhis2Api
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.sql.Sql
import groovyx.net.http.HTTPBuilder
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service

import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.GET
import static groovyx.net.http.ContentType.URLENC
import static groovyx.net.http.Method.POST

@Service
class ConfirmationIvrService {
    public static String username = "carltonwanga";
    public static String apiKey   = "0b58fe425ef4fcdcf625c8b8a2caf39e58902065d815907130127fa70bdc35c0";


    public String initiateMalariaConfirmation(int resultId){

        String ivrUrl = "https://voice.africastalking.com/call";
        def http = new HTTPBuilder(ivrUrl);
        def res = [success:true,status:0];
        println(resultId);


        http.request(POST,JSON) { req ->
            headers.'apiKey' = apiKey;
            headers.'Content-Type' = 'application/x-www-form-urlencoded';
            headers.'Accept' = 'application/json';

            send URLENC, [username: 'carltonwanga', from: '+254711082141', to:'+254700703728',clientRequestId:resultId]


            response.success = { resp, data ->
                DriverManagerDataSource dataSource = DataSourceFactory.getTestApplication();
                Sql sql = new Sql(dataSource);
                Map callRes = data.entries[0];
                callRes.put("resultId",resultId);
                callRes.put("disease",1);
                res.put("status",1);

                sql.executeInsert("INSERT INTO ivr_confirmation_sessions(result_id, disease, caller_number, session_id, is_active, status,step) VALUES(?.resultId,?.disease,?.phoneNumber,?.sessionId,1,0,1) ",callRes);
                sql.close();

            }
            response.'failure' = { resp  ->

            }

        }

        return JsonOutput.toJson(res);



    }

    public String initiateMeningitisConfirmation(int resultId){

    }

    public String processIvrCallback(def parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        DriverManagerDataSource dataSource = DataSourceFactory.getTestApplication();

        String sessionId = params.get("sessionId");
        long resultId = Long.valueOf(params.get("clientRequestId"));

        Sql sql = new Sql(dataSource);
        def sessionDetails = sql.firstRow("SELECT * FROM ivr_confirmation_sessions WHERE  session_id = ?",sessionId);

        int sessionStep = sessionDetails.get("step");
        int diseaseId = sessionDetails.get("disease");

        String res = "";

        if(sessionStep == 1){
            if(diseaseId == 1){
                def reportedRes =  sql.firstRow("SELECT cases_reported,week FROM malaria_outbreak_threshold_computation_results WHERE  id = ?",resultId);
                def casesReported = reportedRes.get("cases_reported");
                def week = reportedRes.get("week");
                res = '''
                        <Response>
                            <GetDigits timeout="30" finishOnKey="#">
                                <Say>Are the number of malaria reported cases for week '''+week+''' equal to '''+casesReported+'''? Press one to agree. Zero to cancel followed by the hash sign</Say>
                            </GetDigits>
                            <Say>We did not get your account number. Good bye</Say>
                        </Response>
                      ''';

                sql.executeUpdate("UPDATE ivr_confirmation_sessions SET  step = 2 WHERE  session_id = ?",sessionId);

            }
        }else if(sessionStep == 2){
            def reportedRes = sql.firstRow("SELECT  deaths,week FROM malaria_outbreak_threshold_computation_results WHERE  id = ?",resultId);
            def deathsReported = reportedRes.get("deaths");
            def week = reportedRes.get("week");

            res = '''
                        <Response>
                            <GetDigits timeout="30" finishOnKey="#">
                                <Say>Are the number of malaria reported deaths for week '''+week+''' equal to '''+deathsReported+'''? Press one to agree. Zero to cancel followed by the hash sign</Say>
                            </GetDigits>
                            <Say>We did not get your feedback. Good bye</Say>
                        </Response>
                      ''';

            sql.executeUpdate("UPDATE ivr_confirmation_sessions SET  step = 3 WHERE  session_id = ?",sessionId);

        }else if(sessionStep == 3){
            res = '''
                     <Response>
                         <Say>Thank you for the feedback. Good bye</Say>
                     </Response>
            ''';
        }

        sql.close();

        return res;
    }

}
