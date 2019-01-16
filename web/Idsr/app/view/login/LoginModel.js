/**
 * Created by PAVILION 15 on 1/9/2019.
 */
Ext.define('Idsr.view.login.LoginModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.login',

    data: {
        formDetails:{
            userid : '',
            fullName : '',
            password : '',
            email    : '',
            persist: false,
            agrees : false
        },
        routeDetails:{
            login: 'login',
            passwordReset: 'passwordreset',
            register: 'register',
            lockScreen: 'lockscreen',
            errorpage: 'errorpage'
        },
        iti:null
    },
    stores:{
        idtype: {
            type: 'identificationType'
        },
        routes:{
            type: 'routeStore'
        }
    }
});