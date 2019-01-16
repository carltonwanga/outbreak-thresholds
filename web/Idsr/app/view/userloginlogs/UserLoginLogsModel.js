/**
 * Created by PAVILION 15 on 6/21/2018.
 */
Ext.define('Idsr.view.userloginlogs.UserLoginLogsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.userloginlogs',

    stores: {
       logs: {
            fields: ["id","ip_address","success","entered_email","login_time"],
            autoLoad: false,
            autoSync: true,
            pageSize: 25,
            proxy: {
                type: 'rest',
                url: Idsr.util.Constants.controllersApiFromIndex + "/audit/login/logs",
                reader: {
                    totalProperty: 'total',
                    type: 'json',
                    rootProperty: 'data'
                }
            }

        }
    },

    data: {

    }
});