package com.dsru.idsr.controller;

//import com.dsru.idsr.service.AuditService;
import com.dsru.idsr.db.CommonDbFunctions;
import com.dsru.idsr.service.AuditService;
import com.dsru.idsr.service.RoleService;
import com.dsru.idsr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/roles")
public class RolesController {
    @Autowired
    RoleService roleService;
    @Autowired
    AuditService auditService;
    @Autowired
    UserService userService;

    @RequestMapping(value = "",method = RequestMethod.GET)
    public String getRoles(WebRequest request){
        return roleService.getRoles(request.getParameterMap());
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String addRole(@RequestBody String body){
        return roleService.addRole(body);
    }

    @RequestMapping(value = "/permissions/in/{roleId}",method = RequestMethod.GET)
    public String getPermissionsInRole(@PathVariable long roleId, WebRequest request){
        return roleService.getAllocatedPemissions(roleId,request.getParameterMap());
    }

    @RequestMapping(value = "/permissions/notin/{roleId}",method = RequestMethod.GET)
    public String getPermissionsNotInRole(@PathVariable long roleId, WebRequest request){
        return roleService.getUnAllocatedPemissions(roleId,request.getParameterMap());
    }

    @RequestMapping(value = "/allocate/{roleId}",method = RequestMethod.POST)
    public String allocatePermissionsToRole(@PathVariable long roleId, HttpServletRequest request, @RequestBody String body){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser  = auth.getName();
        long userId = userService.getUserIdFromEmail(currentUser);
        auditService.logAuditEvent("Allocate user role",request.getRemoteAddr(),currentUser,"User:"+userId+",Role:"+roleId);
        return roleService.allocatePermissions(body,1,roleId);
    }

    @RequestMapping(value = "/deallocate/{roleId}",method = RequestMethod.POST)
    public String deAllocatePermissionse(@PathVariable long roleId, HttpServletRequest request, @RequestBody String body){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser  = auth.getName();
        long userId = userService.getUserIdFromEmail(currentUser);
        auditService.logAuditEvent("Deallocate user role",request.getRemoteAddr(),currentUser,"User:"+userId+",Role:"+roleId);
        return roleService.deallocatePermissions(body,roleId);
    }

}
