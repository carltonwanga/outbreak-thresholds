package com.dsru.idsr.scripts

import com.dsru.idsr.constant.Dhis2Api
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.dhis2.Api
import groovy.sql.Sql
import groovyx.net.http.HTTPBuilder
import org.springframework.jdbc.datasource.DriverManagerDataSource
import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.GET

def subCountyUrlExtension = ".json?fields=children%5Bid,displayName~rename(name)%5D&paging=false";

DriverManagerDataSource dataSource = DataSourceFactory.getTestApplication();

Sql sql = new Sql(dataSource);
def counties = sql.rows("SELECT * FROM county");
counties.each {
    def currentCountyCode = it.get("dhis2_code");
    def http = new HTTPBuilder(Dhis2Api.ORG_UNIT_LIST_URL+currentCountyCode+subCountyUrlExtension);
    def basicAuthToken = Api.generateOAuthBasicAuthToken();
    http.request(GET,JSON) { req ->

        headers.'Authorization' = 'Basic '+basicAuthToken;
        response.success = { resp, data ->
            def subCounties = data.children;
            subCounties.each{
                def subCounty = it;
                subCounty.put("county",currentCountyCode);
                sql.executeInsert("INSERT INTO sub_county(name, dhis2_code, county_code) VALUES(?.name,?.id,?.county)",subCounty);
            }
        }
        response.'failure' = { resp  ->
            println("Error");
        }
    }


}

sql.close();



