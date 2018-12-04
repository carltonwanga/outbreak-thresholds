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

    },

    data: {
        currentView: null,
        userDetails:{
            user:{
                name:"Guest User"
            },
            role_name:"Guest"
        }
    },
    stores:{

    }
});
