package com.dsru.idsr.controller;

import com.dsru.idsr.service.EmailTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping(value = "emailtemplate")
public class EmailTemplateController {

    @Autowired
    EmailTemplateService emailTemplateService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String fetchEmailTemplates(WebRequest request){
        return emailTemplateService.getEmailTemplates(request.getParameterMap());
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String updateEmailTemplate(WebRequest request){
        int emailTemplateId = Integer.parseInt(request.getParameter("emailTemplateId"));
        String subjectText = request.getParameter("subjectText");
        String messageText = request.getParameter("messageText");
        return emailTemplateService.updateEmailTemplate(emailTemplateId, subjectText, messageText);
    }
}
