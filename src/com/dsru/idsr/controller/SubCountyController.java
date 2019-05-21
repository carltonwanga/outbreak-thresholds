package com.dsru.idsr.controller;

import com.dsru.idsr.service.SubCountyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("subcounties")
public class SubCountyController {

    @Autowired
    SubCountyService subCountyService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String fetchSubCounties(WebRequest request){

        return subCountyService.fetchSubCounties(request.getParameterMap());
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.POST)
    public String editSubCounties( @PathVariable long id, @RequestBody String body){

        return subCountyService.editSubCounty(body,id);

    }
}
