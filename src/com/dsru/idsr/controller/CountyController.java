package com.dsru.idsr.controller;

import com.dsru.idsr.service.CountyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("counties")
public class CountyController {
    @Autowired
    CountyService countyService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String fetchCounties(WebRequest request){

        return countyService.fetchCounties(request.getParameterMap());
    }
}
