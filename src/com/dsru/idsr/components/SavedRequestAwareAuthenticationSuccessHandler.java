package com.dsru.idsr.components;

import com.dsru.idsr.model.ActiveUserStore;
import com.dsru.idsr.model.LoggedUser;
import com.dsru.idsr.service.AuditService;
import com.dsru.idsr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.util.StringUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by PROBOOK 450 on 9/18/2016.
 */
public class SavedRequestAwareAuthenticationSuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private RequestCache requestCache = new HttpSessionRequestCache();

    @Autowired
    UserService userService;

    @Autowired
    AuditService auditService;

    /*@Autowired
    ActiveUserStore activeUserStore;*/

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws ServletException, IOException {

        HttpSession session = request.getSession();
        if(session !=null){
            /*LoggedUser user = new LoggedUser(authentication.getName(), session.getId(), activeUserStore);
            session.setAttribute("user", user);*/
        }

        SavedRequest savedRequest = requestCache.getRequest(request, response);
        String emailSubmitted = request.getParameter("username");
        userService.logLoginAttempt(request.getRemoteAddr(),true,emailSubmitted);
        auditService.logAuditEvent("Successful user log in",request.getRemoteAddr(),emailSubmitted,"");


        if (savedRequest == null) {
            clearAuthenticationAttributes(request);
            String theUser=userService.getUserDetailsByEmail(authentication.getName());
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.print(theUser);
            out.flush();

            return;
        }
        String targetUrlParam = getTargetUrlParameter();
        if (isAlwaysUseDefaultTargetUrl() ||
                (targetUrlParam != null &&
                        StringUtils.hasText(request.getParameter(targetUrlParam)))) {
            requestCache.removeRequest(request, response);
            clearAuthenticationAttributes(request);
            return;
        }
        clearAuthenticationAttributes(request);
        String theUser = userService.getUserDetailsByEmail(authentication.getName());
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.print(theUser);
        out.flush();


    }

    public void setRequestCache(RequestCache requestCache) {
        this.requestCache = requestCache;
    }
}