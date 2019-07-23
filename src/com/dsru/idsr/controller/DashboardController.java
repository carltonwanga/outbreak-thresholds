package com.dsru.idsr.controller;

import com.dsru.idsr.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("dashboard")
public class DashboardController {
    @Autowired
    DashboardService dashboardService;

    @RequestMapping(value = "/summary/tiles", method = RequestMethod.GET)
    public String fetchCounties(WebRequest request){

        return dashboardService.fetchSummaryTiles();
    }

    @RequestMapping(value = "/positivityrate/top", method = RequestMethod.GET)
    public String fetchTopPositivity(WebRequest request){

        return dashboardService.fetchHighestPositivityRates();
    }
}
