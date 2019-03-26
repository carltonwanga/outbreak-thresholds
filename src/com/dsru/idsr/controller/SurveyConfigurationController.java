package com.dsru.idsr.controller;

import com.dsru.idsr.service.SurveyConfigurationService;
import com.dsru.idsr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/surveyconfig")
public class SurveyConfigurationController {

    @Autowired
    SurveyConfigurationService surveyConfigurationService;

    @Autowired
    UserService userService;

    @RequestMapping(value = "",method = RequestMethod.GET)
    public String getSurveyInvestigations(WebRequest request){
        return surveyConfigurationService.getSurveyInvestigations(request.getParameterMap());
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String addSurveyInvestigation(@RequestBody String body,HttpServletRequest request){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser  = auth.getName();
        long userId = userService.getUserIdFromEmail(currentUser);

        return surveyConfigurationService.addSurveyInvestigation(body,userId);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.POST)
    public String editSurveyInvestigation(@RequestBody String body,@PathVariable Long id){

        return surveyConfigurationService.editSurveyInvestigation(body,id);
    }

    @RequestMapping(value ="/changestatus" ,method= RequestMethod.POST)
    public String changeStatus(Model model, WebRequest request){
        int surveyId = Integer.parseInt(request.getParameter("surveyId"));
        boolean status = Boolean.parseBoolean(request.getParameter("status"));
        return surveyConfigurationService.changeStatus(surveyId,status);
    }

    @RequestMapping(value = "/responsetypes",method = RequestMethod.GET)
    public String getSurveyResponseTypes(WebRequest request){
        return surveyConfigurationService.getSurveyResponseTypes(request.getParameterMap());
    }

    @RequestMapping(value = "/conditions/{id}",method = RequestMethod.GET)
    public String getSurveyConditions(WebRequest request,@PathVariable Integer id){
        return surveyConfigurationService.getNavigationConditions(id,request.getParameterMap());
    }

    @RequestMapping(value = "/questions/{id}",method = RequestMethod.GET)
    public String getSurveyQuestions(WebRequest request,@PathVariable Long id){
        return surveyConfigurationService.getSurveyQuestions(id);
    }




}
