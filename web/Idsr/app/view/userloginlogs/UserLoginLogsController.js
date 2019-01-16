/**
 * Created by PAVILION 15 on 6/21/2018.
 */
Ext.define('Idsr.view.userloginlogs.UserLoginLogsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.userloginlogs',

    /**
     * Called when the view is created
     */
    init: function() {
        this.onGenerateReport();
    },
    onGenerateReport:function(){
        var me = this;
        var filterForm = me.lookupReference('reportFilterFrm').getForm();
        if(filterForm.isValid()){
            var filterValues = filterForm.getValues (true,false,false);
            var reportUrl = Idsr.util.Constants.controllersApiFromIndex +"/audit/login/logs?"+filterValues;
            this.getStore('logs').setConfig('proxy', {
                type: 'rest',
                url:reportUrl,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                }
            })
                .load();
        }else{
            Ext.Msg.alert("Error","Please fill all the fields correctly");
        }

    },
    onResetFilters:function(){
        this.lookupReference('ipFilter').reset();
        this.lookupReference('successFilter').reset();
    }
});