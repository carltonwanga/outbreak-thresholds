/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Idsr.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',

    requires: [
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Idsr.util.Constants'
    ],

    formulas: {
        userFullNames:function(get){
            var user = get("userDetails");
            return user.first_name+" "+user.last_name;
        }

    },

    data: {
        currentView: null,
        userDetails:null
    },
    stores:{

    }
});
