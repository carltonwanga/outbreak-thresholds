package com.dsru.idsr.controller;

import com.dsru.idsr.components.EmailSender;
import com.dsru.idsr.service.PasswordManagementService;
import com.dsru.idsr.service.UserService;
import  com.dsru.idsr.util.CommonResponse;
import  com.dsru.idsr.constant.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("/password")
public class PasswordManagementController {
    @Autowired
    UserService userService;

    @Autowired
    PasswordManagementService passwordManagementService;

    @Autowired
    EmailSender emailSender;

    @RequestMapping(value = "/change/{token}",method = RequestMethod.GET)
    public String resetPassword(Model model, @PathVariable String token, HttpServletRequest request){
        boolean isTokenValid = passwordManagementService.checkTokenValidity(token);
        if(isTokenValid){
            model.addAttribute("header1Operation", "Change");
            model.addAttribute("header3Operation", "Update");
            return "updatePassword";
        }else{
            model.addAttribute("message","The reset password link has expired.");
            return "error";
        }
    }

    @RequestMapping(value = "/set/{token}",method = RequestMethod.GET)
    public String setPassword(Model model, @PathVariable String token, HttpServletRequest request){
        boolean isTokenValid = passwordManagementService.checkTokenValidity(token);
        if(isTokenValid){
            model.addAttribute("header1Operation", "Set");
            model.addAttribute("header3Operation", "Set");
            return "updatePassword";
        }else{
            model.addAttribute("message","The set password link has expired.");
            return "error";
        }
    }

    @RequestMapping(value = "/save",method = RequestMethod.POST)
    public String savePassword(WebRequest request, Model model, RedirectAttributes redirectAttributes){
        String token = request.getParameter("token");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirm-password");
        String operation, expiryMessage = "";
        String formOperation = request.getParameter("operation");
        if(formOperation.equals("Set")){
            operation = "set";
            expiryMessage = "Verification link has expired. Kindly contact support to complete this process.";
        }else{
            operation = "reset";
            expiryMessage = "Password reset link has expired. Kindly begin the process again.";
        }

        boolean isTokenValid= passwordManagementService.checkTokenValidity(token);
        if(isTokenValid){
            if(password.equals(confirmPassword)){
                if(passwordManagementService.isPasswordStrong(password)){
                    long userId = passwordManagementService.getUserIdFromToken(token);
                    boolean isPasswordExist = passwordManagementService.checkPasswordHistory(userId,password);
                    if(isPasswordExist){
                        String referer = request.getHeader("Referer");
                        redirectAttributes.addFlashAttribute("errorMessage","Password already used. Please type a new password");
                        return "redirect:"+ referer;
                    }else{
                        boolean isPasswordSaved = passwordManagementService.savePassword(userId, password);
                        if(isPasswordSaved){
                            passwordManagementService.updateTokenStatus(token);
                            if(operation.equals("set")){
                                userService.updateUserStatus(userId);
                            }
                            model.addAttribute("successMessage", "Your password has successfully been "+operation);
                            return "passwordResetSuccess";
                        }else{
                            model.addAttribute("message","Failed to "+operation+" password ");
                            return "error";
                        }
                    }
                }else{
                    String referer = request.getHeader("Referer");
                    redirectAttributes.addFlashAttribute("errorMessage","The password must have at least one uppercase letter, one lowercase letter, one number, one special character and should have at least eight characters in length");
                    return "redirect:"+ referer;
                }


            }else{
                String referer = request.getHeader("Referer");
                redirectAttributes.addFlashAttribute("errorMessage","Password Mismatch");
                return "redirect:"+ referer;
            }
        }else{
            model.addAttribute("message", expiryMessage);
            return "error";
        }
    }

    @RequestMapping(value = "/savenew",method = RequestMethod.POST)
    public String saveNewAccountPassword(WebRequest request, Model model, RedirectAttributes redirectAttributes){
        String token = request.getParameter("token");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirm-password");

        boolean isTokenValid = passwordManagementService.checkTokenValidity(token);
        if(isTokenValid){
            if(password.equals(confirmPassword)){
                if(passwordManagementService.isPasswordStrong(password)){
                    long userId = passwordManagementService.getUserIdFromToken(token);
                    boolean isPasswordSaved = passwordManagementService.savePassword(userId, password);
                    if(isPasswordSaved){
                        passwordManagementService.updateTokenStatus(token);
                        model.addAttribute("successMessage", "Your password has successfully been set.");
                        return "passwordResetSuccess";
                    }else{
                        model.addAttribute("message","Failed to set password");
                        return "error";
                    }
                }else{
                    String referer = request.getHeader("Referer");
                    redirectAttributes.addFlashAttribute("errorMessage","The password must have at least one uppercase letter, one lowercase letter, one number, one special character and should have at least eight characters in length");
                    return "redirect:"+ referer;
                }
            }else{
                String referer = request.getHeader("Referer");
                redirectAttributes.addFlashAttribute("errorMessage","Password Mismatch");
                return "redirect:"+ referer;
            }
        }else{
            model.addAttribute("message","Verification link has expired. Kindly contact support to complete this process.");
            return "error";
        }
    }

    @RequestMapping(value = "/reset", method = RequestMethod.POST)
    @ResponseBody
    public CommonResponse passwordResetRequest(WebRequest request, HttpServletRequest servletRequest){
        CommonResponse res = new CommonResponse();
        boolean status = false;
        String email = request.getParameter("email");
        String token;
        Map userExist = userService.getBasicDetailsByEmailMap(email);
        if(userExist != null){
            long userId = (long) userExist.get("id");
            token = passwordManagementService.getValidToken(userId);
            String appUrl = servletRequest.getScheme()+"://"+servletRequest.getServerName()+":"+servletRequest.getLocalPort()+servletRequest.getContextPath()+servletRequest.getServletPath()+"/password/change/";
            if(token == null){
                String tokenStr = UUID.randomUUID().toString();
                status = passwordManagementService.insertPasswordToken(userId,tokenStr);
                if(status){
                    emailSender.sendMail
                            (Constants.FROM_EMAIL,
                                    email,
                                    Constants.PASSWORD_RESET_SUBJECT,
                                    Constants.PASSWORD_RESET_MESSAGE+appUrl+tokenStr+Constants.REGARDS_MESSAGE);

                    res.setStatus(1);
                    res.setMessage("Request successful");
                }else{
                    res.setStatus(0);
                    res.setMessage("Request not successful");
                }
            }else{
                emailSender.sendMail
                        (Constants.FROM_EMAIL,
                                email,
                                Constants.PASSWORD_RESET_SUBJECT,
                                Constants.PASSWORD_RESET_MESSAGE+appUrl+token+Constants.REGARDS_MESSAGE);
                res.setStatus(1);
                res.setMessage("Request successful");
            }

        }else{
            res.setStatus(0);
            res.setMessage("Invalid user");
        }
        return res;
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    @ResponseBody
    public CommonResponse changePassword(WebRequest request, HttpServletRequest servletRequest) {
        CommonResponse res = new CommonResponse();

        String currentPassword = request.getParameter("currentPassword");
        String newPassword = request.getParameter("newPassword");
        String confirmPassword = request.getParameter("confirmPassword");
        String email = request.getParameter("email");

        Map userExist = userService.getBasicDetailsByEmailMap(email);
        if (userExist != null) {
            long userId = (long) userExist.get("id");
            boolean isOldPasswordExist = passwordManagementService.checkCurrentPassword(userId, currentPassword);
            if (isOldPasswordExist) {
                if (newPassword.equals(confirmPassword)) {
                    if (passwordManagementService.isPasswordStrong(newPassword)) {
                        boolean isPasswordExist = passwordManagementService.checkPasswordHistory(userId, newPassword);
                        if (isPasswordExist) {
                            res.setStatus(0);
                            res.setMessage("Password already used. Please type a new password");
                        } else {
                            boolean isPasswordSaved = passwordManagementService.savePassword(userId, newPassword);
                            if (isPasswordSaved) {
                                res.setStatus(1);
                                res.setMessage("Password update successful");
                            } else {
                                res.setStatus(0);
                                res.setMessage("Failed to update password");
                            }
                        }
                    } else {
                        res.setStatus(0);
                        res.setMessage("Weak Password");
                    }
                }else{
                    res.setStatus(0);
                    res.setMessage("New Password and Confirm password do not match");
                }
            }else{
                res.setStatus(0);
                res.setMessage("The current password is wrong");
            }
        }else{
            res.setStatus(0);
            res.setMessage("User does not exist");
        }
        return res;
    }
}

