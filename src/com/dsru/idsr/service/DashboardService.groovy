package com.dsru.idsr.service

import com.dsru.idsr.db.DataSourceFactory
import groovy.json.JsonOutput
import groovy.sql.Sql
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service

@Service
class DashboardService {

    public String fetchSummaryTiles(){
        DriverManagerDataSource dataSource = DataSourceFactory.getTestApplication();
        Sql sql = new Sql(dataSource);

        Calendar calendar = new GregorianCalendar();
        Date currentTime = new Date();
        calendar.setTime(currentTime);
        int epiWeek = calendar.get(Calendar.WEEK_OF_YEAR);
        int currentYear = calendar.get(Calendar.YEAR);

        int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK)-1;
        println(dayOfWeek);
        if(dayOfWeek<4){
            epiWeek = epiWeek-1;
        }

        Map queryParams = [week:epiWeek,year:currentYear];
        println(queryParams);

        List malariaThresholdCounts = sql.rows("""SELECT
            inference_id,
            count (*)
            FROM
            malaria_outbreak_threshold_computation_results
            WHERE
            week = ?.week
            AND year = ?.year
            AND is_active
            GROUP BY
            inference_id
            ORDER BY
            inference_id
        """,queryParams);

        List meningitisThresholdCounts = sql.rows("""SELECT
            inference_id,
            count (*)
            FROM
            meningitis_outbreak_threshold_computation_results
            WHERE
            week = ?.week
            AND year = ?.year
            AND is_active
            GROUP BY
            inference_id
            ORDER BY
            inference_id
        """,queryParams);



        def stats = [:];
        println(epiWeek);
        stats.put("epiWeek",epiWeek);
        stats.put("malariaAction",malariaThresholdCounts.get(2).get('count'));
        stats.put("malariaAlert",malariaThresholdCounts.get(3).get('count'));
        stats.put("meningitisAction",meningitisThresholdCounts.find {return it.inference_id == 4}.get('count'));
        stats.put("meningitisAlert",meningitisThresholdCounts.find {return it.inference_id == 4}.get('count'));

        def res = [success:true,data:stats];
        sql.close();
        return JsonOutput.toJson(res);
    }

    public String fetchHighestPositivityRates(){

        DriverManagerDataSource dataSource = DataSourceFactory.getTestApplication();
        Sql sql = new Sql(dataSource);

        Calendar calendar = new GregorianCalendar();
        Date currentTime = new Date();
        calendar.setTime(currentTime);
        int epiWeek = calendar.get(Calendar.WEEK_OF_YEAR);
        int currentYear = calendar.get(Calendar.YEAR);

        int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK)-1;
        if(dayOfWeek<4){
            epiWeek = epiWeek-1;
        }

        Map queryParams = [week:epiWeek,year:currentYear];
        println(queryParams);

        def data = sql.rows("""SELECT
            malaria_outbreak_threshold_computation_results.lab_positivity,
            sub_county."name" AS sub_county
            FROM
            malaria_outbreak_threshold_computation_results,
            sub_county
            WHERE 
            malaria_outbreak_threshold_computation_results.sub_county = sub_county."dhis2_code"
            AND lab_positivity IS NOT NULL
            AND is_active
            AND week = ?.week
            AND "year" = ?.year
            ORDER BY lab_positivity DESC
            LIMIT 10
        """,queryParams);

        return JsonOutput.toJson(data);

    }
}
