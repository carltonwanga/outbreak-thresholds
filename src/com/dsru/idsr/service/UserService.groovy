package com.dsru.idsr.service

import com.dsru.idsr.constant.Constants
import com.dsru.idsr.util.CommonResponse
import com.dsru.idsr.components.EmailSender
import com.dsru.idsr.db.CommonDbFunctions
import com.dsru.idsr.db.DataSourceFactory
import com.dsru.idsr.model.UsersEntity
import com.dsru.idsr.util.CommonUtils
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import groovy.sql.Sql
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.datasource.DriverManagerDataSource
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService {

    @Autowired BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired PasswordManagementService passwordManagementService;
    @Autowired EmailSender emailSender;

    public String getUserDetailsByEmail(String email){
        def res = [success:true];
        def data = getUserDetailsByEmailMap(email)
        res.put('user',data)
        return JsonOutput.toJson(res);

    }

    public CommonResponse addUser(String userStr, int registrationType){
        Map user = new JsonSlurper().parseText(userStr);

        CommonResponse res = new CommonResponse();
        String email = user.get('email');

        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def similarUser = sql.firstRow("SELECT *FROM users WHERE email = ?",email);

        if(similarUser){
            res.setStatus(0);
            res.setMessage("User with similar email already exist");
            return res;
        }else {
            def savedUser = sql.executeInsert("""
                INSERT INTO users(first_name, middle_name, last_name, email, phone_number, identification_type, identification_number, is_active, company_name) 
                           VALUES(?.firstName,?.middleName,?.lastName,?.email,?.phoneNumber,?.identificationType,?.identificationNumber,FALSE,?.companyName)
            """,user);

            if (savedUser) {
                long savedUserId = savedUser[0][0];
                if(registrationType == 2){
                    String hashedPassword = bCryptPasswordEncoder.encode(user.password);
                    Map updatePasswordParams = [password:hashedPassword,userId: savedUserId];
                    int passwordUpdateRes = sql.executeUpdate("UPDATE users SET  password = ?.password WHERE id = ?.userId",updatePasswordParams);
                    if(passwordUpdateRes > 0) {
                        passwordManagementService.insertPasswordHistory(savedUserId, hashedPassword);
                    }
                    sendAccountActivationLink(savedUserId);
                }else{
                    sql.executeUpdate("UPDATE users SET is_active = TRUE WHERE id = ?",savedUserId);
                    sendPasswordResetEmail(savedUserId);
                }
                res = new CommonResponse(1, "Success. A confirmation email has been sent to " + email + ". Kindly follow the link in your email to complete the registration process");

            } else {
                res.setStatus(0);
                res.setMessage("Could not save user details");
            }

        }
        sql.close();

        return res;
    }

    public Long getUserIdFromToken(String token){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def userId = sql.firstRow("SELECT user_id FROM account_activation_tokens WHERE token = ?",token).get("user_id");
        return userId;
    }


    public boolean checkTokenValidity(String token){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def query = "SELECT token FROM account_activation_tokens WHERE token = ? AND is_active = TRUE AND now() < (add_date + interval '1 day')";
        def resQuery = sql.firstRow(query, token);
        sql.close();
        if(resQuery){
            return true;
        }else{
            return false;
        }
    }

    public void sendPasswordResetEmail(long userId){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        String tokenStr = UUID.randomUUID().toString();
        passwordManagementService.insertPasswordToken(userId,tokenStr);

        String passwordResetUrl = Constants.BASE_APP_URL+"password/change/"+tokenStr;
        def passwordResetEmailMap = sql.firstRow("SELECT  * FROM  email_template WHERE id = 1");
        String userEmail = getEmailFromUserId(userId);
        sql.close();
        emailSender.sendMail(Constants.FROM_EMAIL, userEmail, passwordResetEmailMap.get("subject"), passwordResetEmailMap.get("message")+passwordResetUrl);

    }

    public void sendAccountActivationLink(long userId){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        String tokenStr = UUID.randomUUID().toString();
        insertAccountActivationToken(userId,tokenStr);
        String accountActivationUrl = Constants.BASE_APP_URL+"useraccount/activate/"+tokenStr;
        def accountActivationEmailMap = sql.firstRow("SELECT  * FROM  email_template WHERE id = 3");
        String userEmail = getEmailFromUserId(userId);
        sql.close();
        emailSender.sendMail(Constants.FROM_EMAIL, userEmail, accountActivationEmailMap.get("subject"), accountActivationEmailMap.get("message")+"</br>"+accountActivationUrl);

    }

    public String getEmailFromUserId(long id){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def email = sql.firstRow("SELECT  users.email FROM  users WHERE  id = ?",id).get("email");
        sql.close();
        return email;

    }

    public boolean insertAccountActivationToken(long userId,String token){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = false;
        def params = [userId: userId, token: token];
        def queryStatus = sql.executeInsert("INSERT INTO account_activation_tokens(token, user_id) VALUES (?.token, ?.userId)", params);
        sql.close();
        if(queryStatus){
            res = true;
        }
        return res;
    }

    public Map getBasicDetailsByEmailMap(String email){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);

        def sqlParams = [email: email];
        def sqlQuery = """SELECT
        users.id,
        users.first_name,
        users.middle_name,
        users.last_name,
        users.email,
        users.phone_number,
        users.identification_type,
        users.identification_number,
        users.is_active
        FROM
        users
        WHERE  users.email = ?.email""";

        Map data = (Map) sql.firstRow(sqlQuery, sqlParams);
        sql.close();

        return data;
    }

    public Map getUserDetailsByEmailMap(String email){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);

        def sqlParams = [email: email];
        def sqlQuery = """SELECT
        users.id,
        users.first_name,
        users.middle_name,
        users.last_name,
        users.email,
        users.phone_number,
        users.identification_type,
        users.identification_number,
        users.is_active,
        users.company_name,
        admin_roles.name role_name,
        admin_roles.id role_id
        FROM
        users
        INNER JOIN user_role_allocations ON users.id = user_role_allocations.user_id
        INNER JOIN admin_roles ON user_role_allocations.role_id = admin_roles.id
        WHERE  users.email = ?.email""";

        Map data = (Map) sql.firstRow(sqlQuery, sqlParams);
        sql.close();

        return data;
    }

    public String getUsers(def parameterMap){

        def params = CommonUtils .flattenListParam(parameterMap);
        Map sqlParams = [start: 0, limit: 5];
        def countParamStatus = false;

        def start = params.start?.toInteger();
        def limit = params.limit?.toInteger();
        def paramQuery  = params.query;
        def fetchAdminOnly = params.admin?.toBoolean();

        sqlParams.start =  start;
        sqlParams.limit = limit;
        sqlParams.paramQuery = paramQuery;

        def adminFilterQuery = "";
        def queryFilterQuery = "";
        def queryFilterPrefix = "";

        if(fetchAdminOnly){
            adminFilterQuery  = " WHERE EXISTS (SELECT * FROM admin_users WHERE user_id = users.id AND is_active = TRUE) ";
            queryFilterPrefix = " AND "

        }else{
            queryFilterPrefix = " WHERE "
        }


        if(paramQuery!=null){
            def vectorQuery = paramQuery.replaceAll(' ','&');
            sqlParams.vectorQuery = vectorQuery;
            queryFilterQuery = queryFilterPrefix+ " to_tsvector(users.first_name|| ' ' || users.middle_name || ' ' || users.last_name) @@ to_tsquery(?.vectorQuery) OR users.email ILIKE ?.paramQuery OR users.identification_number = ?.paramQuery ";
            countParamStatus = true;
        }
        def queryFilter = adminFilterQuery+queryFilterQuery;

        def query = """SELECT
                users.id,
                users.first_name  "firstName",
                users.middle_name "middleName",
                users.last_name "lastName",
                users.email,
                users.phone_number "phoneNumber",
                users.identification_type "identificationType",
                users.identification_number "identificationNumber",
                users.is_active "isActive"
                FROM
                users """+queryFilter+" LIMIT ?.limit OFFSET ?.start";

        def countQuery = """SELECT COUNT(1) FROM users """+queryFilter;
        return  CommonDbFunctions.returnJsonFromQueryWithCount(query,countQuery, sqlParams, countParamStatus);

    }

    public long getUserIdFromEmail(String email){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def userId = sql.firstRow("SELECT  users.id FROM  users WHERE  email = ?",email).get("id");
        return userId;

        sql.close();
    }

    public static String changeStatus(int userId,boolean value){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map params = ["id":userId,"status":value];
        def res = [success:true,status:0,message:'Could not reset user status']; ;
        def affectedRows = sql.executeUpdate("UPDATE users SET is_active = ?.status WHERE id =?.id",params);
        sql.close();
        if(affectedRows == 1){
            res = [success:true,status:1,message:'The user status has been reset'];
        }else{
            res = [success:true,status:0,message:'Could not reset user status'];
        }

        return JsonOutput.toJson(res);


    }

    public String getAllocatedUserRole(long userId){
        def sqlParams = [userId: userId];
        def query  = """SELECT
        admin_roles.id,
        admin_roles.name
        FROM
        admin_roles
        INNER JOIN user_role_allocations ON user_role_allocations.role_id = admin_roles.id
        WHERE user_role_allocations.user_id = ?.userId
        """;
        return  CommonDbFunctions.returnJsonFirstRow(query, sqlParams);
    }

    public String assignRole(long userId,long roleId,long loggedInUser){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def sqlParams = [userId: userId, roleId: roleId, loggedInUser: loggedInUser];
        def res = [success:true,status:0];
        sql.execute("INSERT INTO user_role_allocations(user_id, role_id, allocated_by) VALUES (?.userId, ?.roleId, ?.loggedInUser)", sqlParams);
        sql.close();
        res.put('status',1);
        res.put('message','User role allocated');

        return JsonOutput.toJson(res);
    }

    public String deallocateRole(long userId,long roleId,long loggedInUser){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def params = [userId: userId, roleId: roleId];
        def res = [success:true,status:0];
        def queryStatus = sql.execute("DELETE FROM  user_role_allocations WHERE user_id = ?.userId AND role_id = ?.roleId", params);
        sql.close();
        res.status = 1;
        res.message  = 'User role deallocated';
        return JsonOutput.toJson(res);
    }

    public String getMenuDetails(long userId){
        def sqlParams = [userId: userId];
        def childrenQuery  = """SELECT
                admin_permissions."name" as text,
                admin_permissions.xtype "viewType",
                admin_permissions.parent_menu_id,
                admin_permissions.xtype "routeId",
                admin_permissions.icon_cls "iconCls",
                admin_permissions.leaf AS leaf,
                admin_permissions.menu_priority
                FROM
                admin_roles
                INNER JOIN user_role_allocations ON user_role_allocations.role_id = admin_roles."id"
                INNER JOIN admin_role_permissions ON user_role_allocations.role_id = admin_role_permissions.role_id
                INNER JOIN admin_permissions ON admin_role_permissions.permission_id = admin_permissions."id"
                WHERE
                user_role_allocations.user_id = ?.userId
                """;

        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = [success:true];
        def childrenPermissions = sql.rows(childrenQuery, sqlParams);

        List parentIds = [];
        childrenPermissions.each {
            if(it.get("parent_menu_id")){
                parentIds.add(it.get("parent_menu_id"));
            }
        }

        def parentMenus = [];

        if(parentIds){
            def commaSeparatedParentIds = parentIds.join(",")
            parentMenus = sql.rows("SELECT * FROM admin_menu_parents WHERE  id IN ("+commaSeparatedParentIds+")");
        }

        List menuResponse = [];
        List parentMenuResponse = [];

        if(parentMenus){
            parentMenus.each {
                def parentId = it.get("id");
                Map parentResponse = [:];
                List parentChildren = childrenPermissions.findAll({
                    it.get("parent_menu_id") == parentId;
                });

                def sortedParentChildren = parentChildren.sort { a, b -> a.menu_priority <=> b.menu_priority }

                parentResponse.put("text",it.get("name"));
                parentResponse.put("iconCls",it.get("icon_cls"));
                parentResponse.put("expanded",it.get("expanded"));
                parentResponse.put("leaf",false);
                parentResponse.put("menu_priority",it.get("menu_priority"));
                parentResponse.put("children",sortedParentChildren);
                parentMenuResponse.add(parentResponse);
            }
        }
        List parentLessChildren = childrenPermissions.findAll({
            !it.get("parent_menu_id");
        });
        parentLessChildren.each {
           it.remove("parent_menu_id");
        }
        menuResponse = parentMenuResponse+parentLessChildren;
        List sortedMenuResponse = menuResponse.sort { a, b -> a.menu_priority <=> b.menu_priority }
        def dataMap = [expanded: true, children: sortedMenuResponse];
        res.put('data',dataMap);
        res.put('status',1);
        sql.close();
        return JsonOutput.toJson(res);
    }

    public boolean logLoginAttempt(def ipAddress,boolean success,String email) {
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        Map params = ["ip": ipAddress, "success": success, "email": email];
        def insertRes = sql.executeInsert("INSERT INTO user_login_logs(ip_address, success, entered_email,login_time) VALUES (?.ip,?.success,?.email,current_timestamp)", params);
        sql.close();
        return !!insertRes;
    }

    public String updateProfile(long userId, String userDetailsJsonStr){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        def res = [success:false,status:0, message: 'Update Failed'];

        def userDetails = new JsonSlurper().parseText(userDetailsJsonStr);

        def firstName = userDetails.firstName;
        def middleName = userDetails.middleName;
        def lastName = userDetails.lastName;
        def email = userDetails.email;
        def phoneNumber = userDetails.phoneNumber;
        def identificationType = userDetails.identificationType;
        def identificationNumber = userDetails.identificationNumber;

        Map queryParams = [firstName:firstName, middleName:middleName, lastName:lastName, email:email, phoneNumber:phoneNumber, identificationType:identificationType, identificationNumber:identificationNumber, userId: userId];

        int update = sql.executeUpdate("UPDATE users SET first_name = ?.firstName, middle_name = ?.middleName, last_name = ?.lastName, phone_number = ?.phoneNumber, identification_type = ?.identificationType, identification_number = ?.identificationNumber WHERE id = ?.userId", queryParams);
        sql.close();
        if(update > 0){
            res.success = true;
            res.status = 1;
            res.message  = 'Update Successful';
        }

        return JsonOutput.toJson(res);
    }

    public Boolean addUser(def usersEntity){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        boolean status = false;
        def insertUser = sql.executeInsert("INSERT INTO users (first_name, middle_name, last_name, email, phone_number, identification_type, identification_number, company_name) VALUES(?.firstName, ?.middleName, ?.lastName, ?.email, ?.phoneNumber, ?.identificationType, ?.identificationNumber, ?.companyName)",usersEntity);
        sql.close();
        if(insertUser){
            status = true;
        }
        return status;
    }

    public Boolean updateUserStatus(long userId){
        DriverManagerDataSource dataSource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(dataSource);
        boolean status = false;
        int update = sql.executeUpdate("UPDATE users SET is_active = TRUE WHERE id = ?", userId);
        sql.close();
        if(update > 0){
            status = true
        }
        return status;
    }

    public String getActiveUsers(List<Map<String,String>>userDetails){
        //return JsonOutput.toJson(userDetails);
        DriverManagerDataSource datasource = DataSourceFactory.getApplicationDataSource();
        Sql sql = new Sql(datasource);
        List<Map<String, String>> fetchedUserDetails = new ArrayList<>();
        Map res = [success: true];
        userDetails.each {
            def email = it.get("email");
            def sessionId = it.get("sessionId");
            String sqlQuery = "SELECT first_name, middle_name, last_name, email, phone_number FROM users WHERE email=?";
            def sqlData = sql.firstRow(sqlQuery, email);
            sqlData.put("session_id", sessionId);
            fetchedUserDetails.add(sqlData);
        }
        res.put("data", fetchedUserDetails);
        sql.close();
        return JsonOutput.toJson(fetchedUserDetails);
    }

    public Map getUserDetailsMap(String userStr){
        Map user = new JsonSlurper().parseText(userStr);
        return user;
    }
}
