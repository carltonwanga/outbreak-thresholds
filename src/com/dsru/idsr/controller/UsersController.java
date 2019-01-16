package com.dsru.idsr.controller;


import com.dsru.idsr.model.UsersEntity;

import com.dsru.idsr.service.PasswordManagementService;
import com.dsru.idsr.service.UserService;
import com.dsru.idsr.util.CommonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import java.util.Map;


@RestController
@RequestMapping("/users")
public class UsersController {



    @Autowired
    UserService userService;


    @Autowired
    PasswordManagementService passwordManagementService;

    @RequestMapping(value = "",method = RequestMethod.GET)
    public String getUsers(WebRequest request){
        return userService.getUsers(request.getParameterMap());
    }

    @RequestMapping(value = "/",method = RequestMethod.POST)
    public CommonResponse addUser(@RequestBody String userStr){
        return userService.addUser(userStr,1);
    }

    @RequestMapping(value = "/{userId}",method = RequestMethod.PUT)
    public String editUser(@RequestBody String user, @PathVariable long userId){
        return userService.updateProfile(userId,user);
    }

    @RequestMapping(value ="/changestatus" ,method= RequestMethod.POST)
    public String changeStatus(Model model, WebRequest request){
        int userId = Integer.parseInt(request.getParameter("userId"));
        boolean status = Boolean.parseBoolean(request.getParameter("status"));
        return userService.changeStatus(userId,status);
    }

    @RequestMapping(value ="/resendactivationlink" ,method= RequestMethod.POST)
    public CommonResponse resendActivationLink(Model model, WebRequest request){
        int userId = Integer.parseInt(request.getParameter("userId"));
        userService.sendAccountActivationLink(userId);
        return new CommonResponse(1,"Account activation link Sent");
    }



    @RequestMapping(value = "/role",method = RequestMethod.GET)
    public String getPermissionsInRole(@RequestParam long userId){
        return userService.getAllocatedUserRole(userId);
    }

    @RequestMapping(value ="/assignrole" ,method= RequestMethod.POST)
    public String assignRole(WebRequest request){
        /*Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser  = auth.getName();*/
        long loggedInUserId = 11; //userService.getUserIdFromEmail(currentUser);
        long userId = Long.parseLong(request.getParameter("userId"));
        long roleId = Long.parseLong(request.getParameter("roleId"));
        return userService.assignRole(userId,roleId,loggedInUserId);
    }

    @RequestMapping(value ="/deallocaterole" ,method= RequestMethod.POST)
    public String deallocateRole(WebRequest request){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentUser  = auth.getName();
        long loggedInUserId = userService.getUserIdFromEmail(currentUser);
        long userId = Long.parseLong(request.getParameter("userId"));
        long roleId = Long.parseLong(request.getParameter("roleId"));
        return userService.deallocateRole(userId,roleId,loggedInUserId);
    }

    @RequestMapping(value = "/registeruser",method = RequestMethod.POST)
    public CommonResponse registerUser(@RequestBody String userStr){
        Map user = userService.getUserDetailsMap(userStr);
        String password = user.get("password").toString();
        String confirmPassword = user.get("confirmPassword").toString();

        CommonResponse res = new CommonResponse();
        if(password.equals(confirmPassword)){
            if(passwordManagementService.isPasswordStrong(password)){
                return userService.addUser(userStr,2);
            }else{
                res.setStatus(0);
                res.setSuccess(true);
                res.setMessage("The password must have at least one uppercase letter, one lowercase letter, one number, one special character and should have at least eight characters in length");
                return res;
            }
        }else{
            res.setStatus(0);
            res.setSuccess(true);
            res.setMessage("Password Mismatch");
            return res;
        }
    }

    @RequestMapping(value = "/menus/{userId}", method = RequestMethod.GET)
    public String getAllowedMenuItems(@PathVariable long userId) {
        return userService.getMenuDetails(userId);
    }

    @RequestMapping(value = "/updateprofile", method = RequestMethod.POST)
    public String updateProfile(@RequestBody String body){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        long userId = userService.getUserIdFromEmail(userName);
        return userService.updateProfile(userId, body);

    }
}
