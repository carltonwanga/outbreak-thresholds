package com.dsru.idsr.model;

import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LoggedUser implements HttpSessionBindingListener {

    private String userName;
    private String sessionId;


    private ActiveUserStore activeUserStore;

    public LoggedUser(String userName, String sessionId, ActiveUserStore activeUserStore) {
        this.userName = userName;
        this.sessionId = sessionId;
        this.activeUserStore = activeUserStore;
    }

    public Map isUserDetailsExists(List<Map<String,String>> userDetails, String email){
        boolean isExist = false;
        Map returnValues = new HashMap();
        returnValues.put("status", false);
        returnValues.put("index",0);
        for(Map<String, String> entry : userDetails){
            isExist = entry.containsValue(email);
            int index = userDetails.indexOf(entry);
            if(isExist){
                returnValues.put("status", true);
                returnValues.put("index",index);
                break;
            }
        }
        return returnValues;
    }


    public LoggedUser() {
    }

    @Override
    public void valueBound(HttpSessionBindingEvent event) {
        List<Map<String, String>> userDetails = activeUserStore.getUserDetails();
        LoggedUser user = (LoggedUser) event.getValue();
        String userEmail = user.getUserName();
        String sessionId = user.getSessionId();
        Map userStatus = isUserDetailsExists(userDetails,userEmail);
        boolean isUserExist = (Boolean) userStatus.get("status");
        if(!isUserExist){
            Map<String, String> newUserDetails = new HashMap();
            newUserDetails.put("email", getUserName());
            newUserDetails.put("sessionId", sessionId);
            userDetails.add(newUserDetails);
        }
    }

    @Override
    public void valueUnbound(HttpSessionBindingEvent event) {
        List<Map<String, String>> userDetails = activeUserStore.getUserDetails();
        LoggedUser user = (LoggedUser) event.getValue();
        String userEmail = user.getUserName();
        String sessionId = user.getSessionId();

        Map userStatus = isUserDetailsExists(userDetails,userEmail);
        int index = (Integer) userStatus.get("index");
        boolean isUserExist = (Boolean) userStatus.get("status");
        if(isUserExist){
            userDetails.remove(index);
        }
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public ActiveUserStore getActiveUserStore() {
        return activeUserStore;
    }

    public void setActiveUserStore(ActiveUserStore activeUserStore) {
        this.activeUserStore = activeUserStore;
    }
}
