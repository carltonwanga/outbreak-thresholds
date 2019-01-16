/**
 * Created by Micah on 04/07/2018.
 */
Ext.define('Idsr.view.emailtemplate.EmailTemplateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.emailtemplate',

    requires: [
        'Idsr.util.Constants'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    showView: function(view) {
        var layout = this.getReferences().templateDisplay.getLayout();
        layout.setActiveItem(this.lookupReference(view));
    },

    select: function(rowmodel, record, index, eOpts){
        this.getViewModel().set('record', record);
        this.showView('emailTemplateDetails');
    },

    edit: function(){
      this.showView('templateEditor');
    },

    onCancel: function(){
        this.showView('emailTemplateDetails');
    },

    onSave: function(){
        var me = this;
        var emailTemplateId = me.getViewModel().get('record').id;
        var subjectText = me.lookupReference('emailTemplateSubject').getValue();
        var messageText = me.lookupReference('emailTemplateEditor').getValue();

        Ext.Msg.confirm('Confirmation', 'Are you sure you want to update email template?', function(result){
            if(result == 'yes'){
                me.getView().mask('Saving........Please Wait......');
                Ext.Ajax.request({
                    url: Idsr.util.Constants.controllersApiFromIndex+"/emailtemplate",
                    method: 'POST',
                    params:{
                        emailTemplateId: emailTemplateId,
                        subjectText: subjectText,
                        messageText: messageText
                    },
                    success: function(response, opts){
                        me.getView().unmask();
                        var responseData = Ext.JSON.decode(response.responseText);
                        var status = responseData.status;
                        if(status == 1){
                            Ext.Msg.alert("Success","Email template updated");
                            me.getStore('emailtype').reload();
                        }else{
                            Ext.Msg.alert("Error","Could not update template session");
                        }
                    },
                    failure: function(response, opts){
                        me.getView().unmask();
                        Ext.Msg.alert("Error","Could not submit request");
                    }
                });
            }
        })
    }
});