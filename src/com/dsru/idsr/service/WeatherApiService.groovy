package com.dsru.idsr.service

import com.dsru.idsr.db.DataSourceFactory
import groovy.json.JsonOutput
import groovy.sql.Sql
import groovyx.net.http.HTTPBuilder
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service

import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.GET

@Service
class WeatherApiService {
    final String darkSkiesApiKey = "eadef821a29855d901bf8b82d6affc33";
    final String darkSkiesAPIUrl = "https://api.darksky.net/forecast/"+darkSkiesApiKey;


    public String getSubCountyWeather(String subCounty,Long checkTime){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();

        Sql sql = new Sql(dataSource);
        def subCountyCoordinates = sql.firstRow("SELECT geo_latitude,geo_longitude FROM sub_county WHERE  dhis2_code = ?",subCounty);
        sql.close();

        String subCountyLatitude = subCountyCoordinates.get("geo_latitude");
        String subCountyLongitude = subCountyCoordinates.get("geo_longitude");

        def requestURL = darkSkiesAPIUrl+"/$subCountyLatitude,$subCountyLongitude,$checkTime?units=si&exclude=currently,flags,minutely,hourly,alerts";
        //println(requestURL);
        def http = new HTTPBuilder(requestURL);
        def res = [success:true,status:0];


        http.request(GET,JSON) { req ->
            response.success = { resp, data ->
                if(data){
                    def resData = data;
                    res.put("status",1);
                    res.put("data",resData);
                }else{
                    res.put("message","Could not fetch weather details");

                }
            }

            response.'failure' = { resp  ->
                res.put("message","Could not fetch weather details");
            }
        }

        return JsonOutput.toJson(res);

    }
}
