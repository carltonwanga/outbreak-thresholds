package com.dsru.idsr.controller;

import com.dsru.idsr.service.AuditService;
import com.dsru.idsr.service.ThresholdCalculationService;
import com.dsru.idsr.service.MalariaThresholdsComputationService;
import com.dsru.idsr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("malariathresholdcalc")
public class MalariaThresholdCalculationController {

}
