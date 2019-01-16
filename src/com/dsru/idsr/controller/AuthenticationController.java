package com.dsru.idsr.controller;


import com.dsru.idsr.service.AjaxAuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by PROBOOK 450 on 10/7/2016.
 */

@RestController
@RequestMapping(value = "/auth")
public class AuthenticationController {
    @Autowired
    AjaxAuthenticationService ajaxAuthenticationService;

    @RequestMapping(value="/logout", method = RequestMethod.GET)
    public String logoutPage (HttpServletRequest request, HttpServletResponse response, Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isUserAuthenticated = auth != null;
        if (isUserAuthenticated){
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return ajaxAuthenticationService.generateAjaxLogInResults(isUserAuthenticated);
    }

    @RequestMapping(value="/isloggedin", method = RequestMethod.GET)
    public String isUserAuthenticated () {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isUserAuthenticated = (auth != null &&
                auth.isAuthenticated() &&
                !(SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken));

        return ajaxAuthenticationService.userAuthenticationResults(isUserAuthenticated,auth);
    }
}
