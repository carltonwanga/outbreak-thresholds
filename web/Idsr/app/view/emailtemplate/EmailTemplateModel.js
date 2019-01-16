/**
 * Created by Micah on 04/07/2018.
 */
Ext.define('Idsr.view.emailtemplate.EmailTemplateModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.emailtemplate',

    requires: [
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Idsr.util.Constants'
    ],

    stores: {
        emailtype:{
            fields: ['id','type','subject','message'],
            autoLoad: true,
            proxy:{
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+'/emailtemplate'
            }
        }
    }
});