package com.dsru.idsr.model;



import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Component
public class ActiveUserStore {

    public List<Map<String, String>> userDetails;

    public ActiveUserStore() {
        userDetails = new ArrayList<Map<String, String>>();
    }

    public List<Map<String, String>> getUserDetails() {
        return userDetails;
    }

    public void setUserDetails(List<Map<String, String>> userDetails) {
        this.userDetails = userDetails;
    }

}
