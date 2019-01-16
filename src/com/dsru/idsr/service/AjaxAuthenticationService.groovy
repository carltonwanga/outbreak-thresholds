package com.dsru.idsr.service

import groovy.json.JsonOutput
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service

/**
 * Created by PROBOOK 450 on 10/8/2016.
 */
@Service
class AjaxAuthenticationService {
    @Autowired
    UserService userService;

    public String generateAjaxLogInResults(boolean auth){
        int statusNum = auth ? 1 : 0;
        def res = [success:true,status:statusNum];
        return JsonOutput.toJson(res);
    }

    public String userAuthenticationResults(boolean isAuthenticated, Authentication auth){
        int statusNum = isAuthenticated ? 1 : 0;
        def res = [success:true,status:statusNum];
        if(isAuthenticated){
            Map theUser = userService.getUserDetailsByEmailMap(auth.getName());
            res.put("data",theUser);
        }
        return JsonOutput.toJson(res);

    }
}
