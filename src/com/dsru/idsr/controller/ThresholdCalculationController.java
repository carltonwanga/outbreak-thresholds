package com.dsru.idsr.controller;

import com.dsru.idsr.service.AuditService;
import com.dsru.idsr.service.ThresholdCalculationService;
import com.dsru.idsr.service.MalariaThresholdsComputationService;
import com.dsru.idsr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("thresholdcalc")
public class ThresholdCalculationController {

    @Autowired
    ThresholdCalculationService thresholdCalculationService;

    @Autowired
    MalariaThresholdsComputationService malariaThresholdsComputationService;

    @Autowired
    UserService userService;

    @Autowired
    AuditService auditService;

    @RequestMapping(value = "check", method = RequestMethod.GET)
    public String checkIfPeriodThresholdCalculated(WebRequest request){
        return thresholdCalculationService.checkIfPeriodThresholdCalculated(request.getParameterMap());
    }

    @RequestMapping(value = "compute", method = RequestMethod.POST)
    public String requestThresholdCalculation(@RequestBody String body, HttpServletRequest request){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser  = auth.getName();

        return thresholdCalculationService.requestThresholdCalculation(body,request.getRemoteAddr(),currentUser);
    }

    @RequestMapping(value = "/batchoperations", method = RequestMethod.GET)
    public String fetchBatchOperations(WebRequest request){

        return thresholdCalculationService.fetchBatchOperations(request.getParameterMap());
    }

    @RequestMapping(value = "/batcherrors/{id}", method = RequestMethod.GET)
    public String fetchBatchErrors(WebRequest request,@PathVariable Long id){

        return thresholdCalculationService.fetchBatchErrors(request.getParameterMap(),id);
    }

}
