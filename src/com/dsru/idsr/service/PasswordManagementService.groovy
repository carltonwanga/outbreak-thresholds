package com.dsru.idsr.service

import com.dsru.idsr.db.DataSourceFactory
import groovy.sql.Sql
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class PasswordManagementService {
    @Autowired BCryptPasswordEncoder bCryptPasswordEncoder;

    public boolean insertPasswordToken(long userId,String token){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = false;
        def params = [userId: userId, token: token];
        def queryStatus = sql.executeInsert("INSERT INTO password_reset_tokens(token, user_id) VALUES (?.token, ?.userId)", params);
        sql.close();
        if(queryStatus){
            res = true;
        }
        return res;
    }

    public String getValidToken(long userId){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def resQuery;
        def token;
        def params = [userId: userId];
        def query = "SELECT token FROM password_reset_tokens WHERE user_id = ?.userId AND is_active = TRUE AND now() < (add_date + interval '1 day')";
        resQuery = sql.firstRow(query, params);
        sql.close();
        if(resQuery){
            token = resQuery.get('token');
        }
        return token;
    }

    public boolean checkTokenValidity(String token){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def query = "SELECT token FROM password_reset_tokens WHERE token = ? AND is_active = TRUE AND now() < (add_date + interval '1 day')";
        def resQuery = sql.firstRow(query, token);
        sql.close();
        if(resQuery){
            return true;
        }else{
            return false;
        }
    }

    public long getUserIdFromToken(String token){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def userId = sql.firstRow("SELECT user_id FROM password_reset_tokens WHERE token = ?",token).get("user_id");
        return userId;
    }

    public boolean savePassword(long userId,String password){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);

        String hashedPassword = bCryptPasswordEncoder.encode(password);
        Map queryParams = [password:hashedPassword,userId: userId];
        int sqlUpdate = sql.executeUpdate("UPDATE users SET  password = ?.password WHERE id = ?.userId",queryParams);
        sql.close();
        if(sqlUpdate > 0){
            insertPasswordHistory(userId, hashedPassword);
            return true;
        }else{
            return false;
        }


    }

    public boolean insertPasswordHistory(long userId,String hashedPassword){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map queryParams = [password:hashedPassword,userId: userId];

        def queryStatus = sql.executeInsert("INSERT INTO user_password_history(user_id, password) VALUES (?.userId, ?.password)",queryParams);
        sql.close();
        if(queryStatus){
            return true;
        }else{
            return false;
        }
    }

    public void updateTokenStatus(String token){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);

        sql.executeUpdate("UPDATE password_reset_tokens SET is_active = FALSE WHERE token = ?",token);
        sql.close();
    }

    public boolean checkPasswordHistory(long userId, String password){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
       Map queryParams = [userId: userId];
        def sqlRes = sql.rows("SELECT * FROM user_password_history WHERE user_id =?.userId",queryParams);

        def matchingPassword = sqlRes?.find({
            bCryptPasswordEncoder.matches(password,it.get("password"));
        })
        sql.close();
        if(matchingPassword){
            return true;
        }else{
            return false;
        }
    }

    public boolean checkCurrentPassword(long userId, String password){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map queryParams = [userId: userId];
        def isMatch = false;
        def sqlRes = sql.firstRow("SELECT password FROM users WHERE id=?.userId",queryParams);
        if(sqlRes){
            def resPassword = sqlRes.get("password");
            isMatch = bCryptPasswordEncoder.matches(password, resPassword);
        }
        sql.close();
        return isMatch;
    }

    public boolean isPasswordStrong(String password){
        return  password.matches("^.*(?=.{8,})((?=.*[!@#\$%^&*()\\-_=+{};:,<.>]){1})(?=.*\\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*\$")
    }

}
