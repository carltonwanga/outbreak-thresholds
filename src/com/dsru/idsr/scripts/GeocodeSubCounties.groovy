package com.dsru.idsr.scripts

import com.dsru.idsr.db.DataSourceFactory
import groovy.sql.Sql
import groovyx.net.http.HTTPBuilder
import org.springframework.jdbc.datasource.DriverManagerDataSource

import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.GET

DriverManagerDataSource dataSource = DataSourceFactory.getTestApplication();
Sql sql = new Sql(dataSource);


def subCounties = sql.rows("SELECT id,name FROM sub_county");

    subCounties.each {
        def theSubCounty = it;
        def googleGeocodeBaseUrl = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDJpg54jPFXrCNlBVdXeuI4A57-SKT4s-4&address=";
        def locationName = theSubCounty.get("name");
        def coordURL = googleGeocodeBaseUrl+URLEncoder.encode(locationName, "UTF-8");
        def http = new HTTPBuilder(coordURL);

        http.request(GET,JSON) { req ->
            response.success = { resp, data ->
                if(data.status ==  "OK"){
                    List mainRes = data.results;
                    Map addressDetails = mainRes.get(0);

                    String addressName = addressDetails.get("formatted_address");
                    String latitude = addressDetails.get("geometry").location.lat.toString();
                    String longitude = addressDetails.get("geometry").location.lng.toString();
                    def updateStmt = "UPDATE sub_county SET geo_latitude = '$latitude', geo_longitude='$longitude', geo_code_name = '$addressName' WHERE id = ${theSubCounty.id}";
                    sql.executeUpdate(updateStmt);

                }else{
                    println("Error - "+theSubCounty.get("name"));
                    println(data);
                    println("-----------------");
                }

            }
            response.'failure' = { resp  ->
                println("Error");
            }
        }
    }





sql.close();

