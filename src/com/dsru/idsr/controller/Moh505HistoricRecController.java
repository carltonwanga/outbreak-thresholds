package com.dsru.idsr.controller;

import com.dsru.idsr.service.Moh505HistoricRecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("moh505historic")
public class Moh505HistoricRecController {

@Autowired
    Moh505HistoricRecService moh505HistoricRecService;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String fetchHistoricRecords(WebRequest request){

        return moh505HistoricRecService.fetchHistoricRecords(request.getParameterMap());
    }

    @RequestMapping(value = "/batchoperations", method = RequestMethod.GET)
    public String fetchBatchOperations(WebRequest request){

        return moh505HistoricRecService.fetchBatchImports(request.getParameterMap());
    }

    @RequestMapping(value = "/batcherrors/{id}", method = RequestMethod.GET)
    public String fetchBatchErrors(WebRequest request,@PathVariable Long id){

        return moh505HistoricRecService.fetchBatchErrors(request.getParameterMap(),id);
    }

    @RequestMapping(value = "/import", method = RequestMethod.POST)
    public String importHistoricRecords(WebRequest request,@RequestParam("file") MultipartFile file){

        return moh505HistoricRecService.importHistoricData(request.getParameterMap(),file);
    }
}
