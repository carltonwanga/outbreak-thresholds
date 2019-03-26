package com.dsru.idsr.controller;


import com.dsru.idsr.service.MeningitisThresholdResultsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("meningitisthresholdres")
public class MeningitisThresholdResultsController {

    @Autowired
    MeningitisThresholdResultsService meningitisThresholdResultsService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String fetchPaginatedThresholdResults(WebRequest request){

        return meningitisThresholdResultsService.fetchThresholdResults(request.getParameterMap(),true);
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public String fetchAllThresholdResults(WebRequest request){

        return meningitisThresholdResultsService.fetchThresholdResults(request.getParameterMap(),false);
    }

    @RequestMapping(value = "/subcountyweekly", method = RequestMethod.GET)
    public String fetchSubCountyWeeklyThresholdResults(WebRequest request){

        return meningitisThresholdResultsService.subCountyActiveWeeklyResults(request.getParameterMap());
    }
}
