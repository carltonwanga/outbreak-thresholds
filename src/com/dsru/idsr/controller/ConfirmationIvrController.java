package com.dsru.idsr.controller;

import com.dsru.idsr.service.ConfirmationIvrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping(value = "confirmationivr")
public class ConfirmationIvrController {

    @Autowired
    ConfirmationIvrService confirmationIvrService;

    @RequestMapping(value = "/initiate", method = RequestMethod.POST)
    public String initiateIvrConfirmation(@RequestParam  int disease,@RequestParam int resultId){
        String res = "";
        if(disease == 1){
            res = confirmationIvrService.initiateMalariaConfirmation(resultId);
        }else{
            res = confirmationIvrService.initiateMeningitisConfirmation(resultId);

        }
        return res;

    }

    @RequestMapping(value = "/callback", method = RequestMethod.POST)
    public String processIvrCallback(WebRequest request){
        return confirmationIvrService.processIvrCallback(request.getParameterMap());
    }

}
