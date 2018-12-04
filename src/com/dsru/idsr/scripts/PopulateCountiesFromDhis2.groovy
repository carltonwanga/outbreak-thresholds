package com.dsru.idsr.scripts

import com.dsru.idsr.constant.Dhis2Api
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.dhis2.Api
import groovy.sql.Sql
import groovyx.net.http.HTTPBuilder
import org.springframework.jdbc.datasource.DriverManagerDataSource
import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.GET


def http = new HTTPBuilder(Dhis2Api.KENYA_COUNTIES_LIST_URL);
def basicAuthToken = Api.generateOAuthBasicAuthToken();


http.request(GET,JSON) { req ->

    headers.'Authorization' = 'Basic '+basicAuthToken;
    response.success = { resp, data ->
        def counties = data.children;

        DriverManagerDataSource dataSource = DataSourceFactory.getTestApplication();
        Sql sql = new Sql(dataSource);
        sql.withTransaction {
            counties.each{
                sql.executeInsert("INSERT INTO county(name, dhis2_code) VALUES (?.name,?.id)",it);
            }
        }
        sql.close();
    }
    response.'failure' = { resp  ->
        println("Error");
    }
}

