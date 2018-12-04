package com.dsru.idsr.db

import org.springframework.context.ApplicationContext
import org.springframework.context.support.FileSystemXmlApplicationContext
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.web.context.ContextLoader
import org.springframework.web.context.WebApplicationContext

/**
 * Created by Carlton on 8/16/2017.
 */
class DataSourceFactory {

    public static DriverManagerDataSource getApplicationDataSource(){
        WebApplicationContext context = ContextLoader.getCurrentWebApplicationContext();
        DriverManagerDataSource dataSource = context.getBean("dataSource");
        return dataSource;
    }

    /*public static DriverManagerDataSource getTestApplication(){
         DriverManagerDataSource dataSource = new DriverManagerDataSource("jdbc:postgresql://localhost:5432/idsr","postgres","postgres");
        dataSource.setDriverClassName("org.postgresql.Driver");
        return dataSource;
    }*/
}