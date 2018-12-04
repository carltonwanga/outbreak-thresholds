package com.dsru.idsr.controller;

import com.dsru.idsr.service.MalariaThresholdCalculationService;
import com.dsru.idsr.service.MalariaThresholdsComputationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("malariathresholdcalc")
public class MalariaThresholdCalculationController {

    @Autowired
    MalariaThresholdCalculationService malariaThresholdCalculationService;

    @Autowired
    MalariaThresholdsComputationService malariaThresholdsComputationService;

    @RequestMapping(value = "check", method = RequestMethod.GET)
    public String checkIfPeriodThresholdCalculated(WebRequest request){
        return malariaThresholdCalculationService.checkIfPeriodThresholdCalculated(request.getParameterMap());
    }

    @RequestMapping(value = "compute", method = RequestMethod.POST)
    public String requestThreasholdCalculation(@RequestBody String body){
        return malariaThresholdsComputationService.requestMalariaCalculation(body);
    }
}
