package com.dsru.idsr.controller;

import com.dsru.idsr.service.SubCountyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("subcounties")
public class SubCountyController {

    @Autowired
    SubCountyService subCountyService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String fetchHistoricRecords(WebRequest request){

        return subCountyService.fetchSubCounties(request.getParameterMap());
    }
}
