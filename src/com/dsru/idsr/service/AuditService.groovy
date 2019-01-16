package com.dsru.idsr.service

import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.util.CommonUtils
import groovy.sql.Sql
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.stereotype.Service

@Service
class AuditService {
    @Autowired UserService userService;

    public String getLogInLogs(def parameterMap){
        Map params = CommonUtils.flattenListParam(parameterMap);
        params.put("limit",params.get("limit").toInteger());
        params.put("start",params.get("start").toInteger());
        def ipFilter = params.ip ? " AND ip_address = ?.ip ":"";
        def statusFilter = params.success.toString() ? " AND success = ?.success::boolean":"";
        def queryFilter = ipFilter+statusFilter;
        def query = """SELECT * FROM user_login_logs WHERE date(login_time) BETWEEN date(?.from) AND date(?.to) """+queryFilter+" LIMIT ?.limit OFFSET ?.start";
        def countQuery = """SELECT COUNT(1) FROM user_login_logs WHERE date(login_time) BETWEEN date(?.from) AND date(?.to) """+queryFilter;
        return  CommonDbFunctions.returnJsonFromQueryWithCount(query,countQuery, params, true);

    }
    public String getEventLogs(def parameterMap){

        Map params = CommonUtils.flattenListParam(parameterMap);
        params.put("limit",params.get("limit").toInteger());
        params.put("start",params.get("start").toInteger());
        def ipFilter = params.ip ? " AND ip_address = ?.ip ":"";
        def userFilter = params.user ? " AND user_event_log.user_id = ?.user::int":"";

        def queryFilter = ipFilter+userFilter;
        def query = """SELECT user_event_log.*,
                       (users.first_name ||' '|| users.middle_name || ' ' || users.last_name) AS user
                        FROM user_event_log,users
                        WHERE users.id = user_event_log.user_id AND
                        date(transaction_time) BETWEEN date(?.from) AND date(?.to) """+queryFilter+" LIMIT ?.limit OFFSET ?.start";

        def countQuery = """SELECT COUNT(1) FROM user_event_log WHERE date(transaction_time) BETWEEN date(?.from) AND date(?.to) """+queryFilter;
        return  CommonDbFunctions.returnJsonFromQueryWithCount(query,countQuery, params, true);

    }

    public boolean logAuditEvent(String action,String ipAddress,String email,String reference){
        long userId = userService.getUserIdFromEmail(email);
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map params = ["action":action,"ip":ipAddress,"userId":userId,"reference":reference];

        def insertRes = sql.executeInsert("INSERT INTO user_event_log(action, ip_address, user_id,transaction_time, reference) VALUES (?.action,?.ip,?.userId,current_timestamp,?.reference)",params);
        sql.close();
        return !!insertRes;
    }
}
