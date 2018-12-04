package com.dsru.idsr.controller;

import com.dsru.idsr.service.ThresholdInferencesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("thresholdinferences")
public class ThresholdInferencesController {
    @Autowired
    ThresholdInferencesService thresholdInferencesService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String fetchInferences(WebRequest request){

        return thresholdInferencesService.fetchThresholdInferences(request.getParameterMap());
    }

}
