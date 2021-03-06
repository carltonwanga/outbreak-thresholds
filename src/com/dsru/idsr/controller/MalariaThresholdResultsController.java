package com.dsru.idsr.controller;

import com.dsru.idsr.service.MalariaThresholdResultsService;
import com.dsru.idsr.service.MalariaThresholdsComputationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("malariathresholdres")
public class MalariaThresholdResultsController {
    @Autowired
    MalariaThresholdResultsService malariaThresholdResultsService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String fetchPaginatedThresholdResults(WebRequest request){

        return malariaThresholdResultsService.fetchThresholdResults(request.getParameterMap(),true);
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public String fetchAllThresholdResults(WebRequest request){

        return malariaThresholdResultsService.fetchThresholdResults(request.getParameterMap(),false);
    }

    @RequestMapping(value = "/subcountyweekly", method = RequestMethod.GET)
    public String fetchSubCountyWeeklyThresholdResults(WebRequest request){

        return malariaThresholdResultsService.subCountyActiveWeeklyResults(request.getParameterMap());
    }

    @RequestMapping(value = "/confirm", method = RequestMethod.POST)
    public String confirmMalariaThresholdRes(WebRequest request){

        return malariaThresholdResultsService.updateThresholdConfirmationStatus(request.getParameterMap());
    }

}
