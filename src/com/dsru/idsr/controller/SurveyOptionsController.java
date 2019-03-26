package com.dsru.idsr.controller;


import com.dsru.idsr.service.SurveyOptionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("/surveyoptions")
public class SurveyOptionsController {

    @Autowired
    SurveyOptionsService surveyOptionsService;

    @RequestMapping(value = "",method = RequestMethod.GET)
    public String getSurveyOptions(WebRequest request){
        return surveyOptionsService.getSurveyOptions(request.getParameterMap());
    }
    @RequestMapping(value = "/{id}",method = RequestMethod.GET)
    public String getSurveyOptionItems(WebRequest request,@PathVariable Long id){
        return surveyOptionsService.getSurveyOptionItems(id,request.getParameterMap());
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.POST)
    public String editSurveyOptions(@RequestBody String body, @PathVariable Long id){

        return surveyOptionsService.editSurveyOption(body,id);
    }

    @RequestMapping(value ="/changestatus" ,method= RequestMethod.POST)
    public String changeStatus(Model model, WebRequest request){
        int surveyId = Integer.parseInt(request.getParameter("surveyId"));
        boolean status = Boolean.parseBoolean(request.getParameter("status"));
        return surveyOptionsService.changeStatus(surveyId,status);
    }


}
