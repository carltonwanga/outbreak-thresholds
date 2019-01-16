package com.dsru.idsr.controller;

import com.dsru.idsr.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("/audit")
public class Audit {
    @Autowired
    AuditService auditService;

    @RequestMapping(value = "login/logs",method = RequestMethod.GET)
    public String getLoginLogs(WebRequest request){
        return auditService.getLogInLogs(request.getParameterMap());
    }

    @RequestMapping(value = "event/logs",method = RequestMethod.GET)
    public String getEventLogs(WebRequest request){
        return auditService.getEventLogs(request.getParameterMap());
    }

}
