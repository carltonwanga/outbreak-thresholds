package com.dsru.idsr.db

import groovy.json.JsonOutput
import groovy.sql.Sql
import org.springframework.jdbc.datasource.DriverManagerDataSource

class CommonDbFunctions {
    public static String returnJsonFromQueryWithCount(def sqlQuery,def countQuery, def sqlParams, def countParamStatus){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = [success:true];
        def data = sql.rows(sqlQuery, sqlParams);
        def count;
        if (countParamStatus){
            count = sql.firstRow(countQuery, sqlParams).get('count');
        }else{
            count = sql.firstRow(countQuery).get('count');
        }
        res.put('data',data);
        res.put('total',count);
        sql.close();
        return JsonOutput.toJson(res);
    }

    public static String returnJsonFirstRow(def sqlQuery, def sqlParams){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = [success:true];
        def data = sql.firstRow(sqlQuery, sqlParams);
        res.put('data',data);
        res.put('status',1);
        sql.close();
        return JsonOutput.toJson(res);
    }

    public static String returnJsonRows(def sqlQuery, def sqlParams){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = [success:true];
        def data = sql.rows(sqlQuery, sqlParams);
        res.put('data',data);
        res.put('status',1);
        sql.close();
        return JsonOutput.toJson(res);
    }

    public static String returnJsonRowsWithoutParams(def sqlQuery){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = [success:true];
        def data = sql.rows(sqlQuery);
        res.put('data',data);
        res.put('status',1);
        sql.close();
        return JsonOutput.toJson(res);
    }

}
