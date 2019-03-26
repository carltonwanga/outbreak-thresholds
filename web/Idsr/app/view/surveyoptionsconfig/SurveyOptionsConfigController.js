/**
 * Created by PAVILION 15 on 2/21/2019.
 */
Ext.define('Idsr.view.surveyoptionsconfig.SurveyOptionsConfigController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.surveyoptionsconfig',

    /**
     * Called when the view is created
     */
    init: function() {

    },
    select: function(rowmodel, record, index, eOpts) {
        var theController = this;

        // Set selected record
        this.getViewModel().set('record', record);
        // Show details
        this.showView('surveyGrid');
        var task = new Ext.util.DelayedTask(function(){
            theController.getStore('optionItems').load();
        });
        task.delay(200);

    },
    showView: function(view) {
        var layout = this.getReferences().display.getLayout();
        layout.setActiveItem(this.lookupReference(view));
    }


});