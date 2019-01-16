/**
 * Created by PAVILION 15 on 1/9/2019.
 */
Ext.define('Idsr.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    /**
     * Called when the view is created
     */
    init: function() {
        this.control({
            '#forgotPasswordLink': {
                forgotPwdClick: this.onForgotPassword
            }
        });
        this.control({
            '#backToLoginLink': {
                backToLoginClick: this.backToLogIn
            }
        });

        this.control({
            '#fpBackToLoginLink': {
                backToLoginClick: this.backToLogIn
            }
        });

    },

    onTextFieldSpecialKey: function(field, e, options){
        if (e.getKey() === e.ENTER) {
            this.doLogin();
        }
    },

    onTextFieldKeyPress: function(field, e, options){

        var charCode = e.getCharCode(),
            me = this;

        if((e.shiftKey && charCode >= 97 && charCode <= 122) ||
            (!e.shiftKey && charCode >= 65 && charCode <= 90)){

            if(me.capslockTooltip === undefined){
                me.capslockTooltip = Ext.widget('capslocktooltip');
            }

            me.capslockTooltip.show();

        } else {

            if(me.capslockTooltip !== undefined){
                me.capslockTooltip.hide();
            }
        }
    },

    onButtonClickCancel: function(button, e, options){
        this.lookupReference('loginForm').reset();
    },

    onButtonClickSubmit: function(button, e, options){
        var me = this;

        if (me.lookupReference('loginForm').isValid()){
            me.doLogin();
        }
    },

    doLogin: function() {
        var me = this,
            form = me.lookupReference('loginForm')

        me.getView().mask('Authenticating... Please wait...');


        form.submit({
            clientValidation: true,
            url: Idsr.util.Constants.signInUrl,
            scope: me,
            success: 'onLoginSuccess',
            failure: 'onLoginFailure'
        });
    },

    onLoginFailure: function(form, action) {
        var view = this.getView();
        var responseStatus = action.response.status;
        this.getView().unmask();
        switch (action.failureType) {
            case Ext.form.action.Action.CLIENT_INVALID:
                Ext.Msg.alert('Error','Form fields may not be submitted with invalid values');
                break;
            case Ext.form.action.Action.CONNECT_FAILURE:
                if(responseStatus = 401){
                    Ext.Msg.alert('Error','Invalid Username Password Combination');
                }else{
                    Ext.Msg.alert('Error','Connection failure');
                }
                break;
            default:
                Ext.Msg.alert('Error','Could not log In');
                break;
        }


    },

    onLoginSuccess: function(form, action) {
        var view = this.getView();
        var responseData = Ext.JSON.decode(action.response.responseText);
        view.unmask();

        var theUser = responseData.user;
        view.up('lockingwindow').destroy();
        view.close();
        view.destroy();

        Idsr.util.SessionMonitor.start();
        var theMainView = Ext.create('Idsr.view.main.Main');
        theMainView.getViewModel().set('userDetails',theUser);
        theMainView.getController().onUpdateNavigationStore();

    },

    onLoginButton: function() {
        this.redirectTo('dashboard', true);
    },

    onLoginAsButton: function() {
        var view = this.getView();
        view.up('lockingwindow').destroy();
        Ext.create('Idsr.view.login.Login');
        this.redirectTo('login', true);
    },

    onForgotPassword:function(){
        var view = this.getView();
        view.up("window").close();
        Ext.create('Idsr.view.login.PasswordReset');
    },

    backToLogIn:function(){
        var view = this.getView();
        view.up("window").close();
        Ext.widget('login');
    },

    onResetPassword: function(button, e, eOpts){
        var me = this;
        var userEmail = this.lookupReference('resetPasswordTextField').getValue();
        Ext.Msg.confirm('Confimation', 'Are you sure you want to reset the password ?', function (result) {
            if(result == 'yes'){
                me.getView().mask('Processing.....Please Wait......');
                Ext.Ajax.request({
                    url:Idsr.util.Constants.controllersApiFromIndex+'/password/reset',
                    method: 'POST',
                    params:{
                        email: userEmail
                    },
                    success: function(response, eOpts){
                        me.getView().unmask();
                        var responseData = Ext.JSON.decode(response.responseText);
                        var status = responseData.status;
                        var responseMessage = responseData.message;
                        if(status == 1){
                            Ext.Msg.alert('Success', 'Password reset link sent to '+userEmail+'. Check your email for further instructions');
                            userEmail.reset();
                        }else{
                            Ext.Msg.alert('Error',responseMessage ? responseMessage : 'Could not process request');
                        }
                    },
                    failure: function (response, eOpts) {
                        me.getView().unmask();
                        var responseData = Ext.JSON.decode(response.responseText);
                        var responseMessage = responseData.message;
                        Ext.Msg.alert('Error', responseMessage ? responseMessage : 'Could not process request');
                    }
                });
            }
        });
    }
});