package com.dsru.idsr.components;

import com.dsru.idsr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class LogingAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    UserService userService;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        String emailSubmitted = request.getParameter("username");
        userService.logLoginAttempt(request.getRemoteAddr(),false,emailSubmitted);
        super.onAuthenticationFailure(request, response, exception);
    }
}
