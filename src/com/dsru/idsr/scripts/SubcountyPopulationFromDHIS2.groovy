package com.dsru.idsr.scripts

import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.dhis2.Api
import groovy.sql.Sql
import groovyx.net.http.HTTPBuilder
import org.springframework.jdbc.datasource.DriverManagerDataSource

import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.GET

def populationURL = "https://hiskenya.org/api/26/analytics/dataValueSet.json?dimension=dx:NLKRV7bYbVy&dimension=pe:2019&dimension=ou:USER_ORGUNIT_GRANDCHILDREN&displayProperty=NAME&user=kO8Ejxqi138";
def http = new HTTPBuilder(populationURL);
def basicAuthToken = Api.generateOAuthBasicAuthToken();

http.request(GET,JSON) { req ->

    headers.'Authorization' = 'Basic '+basicAuthToken;
    response.success = { resp, data ->
        def dataElements = data.dataValues;

        DriverManagerDataSource dataSource = DataSourceFactory.getTestApplication();
        Sql sql = new Sql(dataSource);
        sql.withTransaction {
            dataElements.each{
                long subCountyPopulation = (long) Double.valueOf(it.get("value"));
                Map updateParams = [sub_county:it.get("orgUnit"),population:subCountyPopulation];
                sql.executeUpdate("UPDATE sub_county SET population_estimate = ?.population WHERE dhis2_code = ?.sub_county",updateParams);
            }
        }
        sql.close();
    }
    response.'failure' = { resp  ->
        println("Error");
    }
}

