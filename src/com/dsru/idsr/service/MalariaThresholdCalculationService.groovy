package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.sql.Sql
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service

@Service
class MalariaThresholdCalculationService {
    public String checkIfPeriodThresholdCalculated(def parameterMap) {
        def params = CommonUtils.flattenListParam(parameterMap);
        Map queryParams = [week:params.week?.toInteger(),year:params.year?.toInteger()];
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = [success:true,status:0];

        def existingCalc = sql.firstRow("SELECT id FROM outbreak_threshold_computation_batch WHERE week = ?.week AND year = ?.year",queryParams);
        if(existingCalc){
            res.status = 1;
        }

        return JsonOutput.toJson(res);
    }

}
