package com.dsru.idsr.controller;


import com.dsru.idsr.service.DiseaseMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("/diseases")
public class DiseaseMappingController {

    @Autowired
    DiseaseMappingService diseaseMappingService;

    @RequestMapping(value = "",method = RequestMethod.GET)
    public String getSurveyInvestigations(WebRequest request){
        return diseaseMappingService.getDiseaseMapping(request.getParameterMap());
    }
}
