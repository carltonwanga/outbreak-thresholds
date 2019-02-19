package com.dsru.idsr.controller;

import com.dsru.idsr.service.WeatherApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("weatherapi")
public class WeatherApiController {

    @Autowired
    WeatherApiService weatherApiService;

    @RequestMapping(value = "check", method = RequestMethod.GET)
    public String checkIfPeriodThresholdCalculated(WebRequest request, @RequestParam("subcounty")String subCounty,@RequestParam("time") Long time){
        return weatherApiService.getSubCountyWeather(subCounty,time);
    }
}
