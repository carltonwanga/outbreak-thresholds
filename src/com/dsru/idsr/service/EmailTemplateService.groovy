package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.sql.Sql
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service


@Service
class EmailTemplateService {
    public String updateEmailTemplate(int emailTemplateId, String subject, String message){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = [success:false,status:0, message: 'Update Failed'];
        def sqlParam = [id: emailTemplateId, subject:subject, message:message ];
        boolean status = false;
        int update = sql.executeUpdate("UPDATE  email_template SET subject = ?.subject, message= ?.message WHERE id = ?.id", sqlParam);
        sql.close();
        if(update > 0){
            res.success = true;
            res.status = 1;
            res.message = "Update sucessfull"
        }
        return JsonOutput.toJson(res);
    }

    public String getEmailTemplates(def parameterMap){
        def params = CommonUtils.flattenListParam(parameterMap);
        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();

        def countParamStatus = false;

        def sqlParams = [start: start, limit: limit];

        def queryStr  = "SELECT * FROM email_template "+" LIMIT ?.limit OFFSET ?.start";
        def countStr = "SELECT COUNT(1) FROM email_template ";
        return  CommonDbFunctions.returnJsonFromQueryWithCount(queryStr,countStr, sqlParams, countParamStatus);


    }
}
