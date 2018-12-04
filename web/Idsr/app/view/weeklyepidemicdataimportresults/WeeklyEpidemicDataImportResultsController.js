/**
 * Created by PAVILION 15 on 10/16/2018.
 */
Ext.define('Idsr.view.weeklyepidemicdataimportresults.WeeklyEpidemicDataImportResultsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.weeklyepidemicdataimportresults',

    /**
     * Called when the view is created
     */
    init: function() {

    },

    selectHistoricRecord: function(rowmodel, record, index, eOpts) {
        var theController = this;
        // Set selected record
        this.getViewModel().set('record', record);
        // Show details
        //this.sideDisplayShowView('details');
        var task = new Ext.util.DelayedTask(function(){
            theController.getStore("batchErrors").load();
        });
        task.delay(200);


    },
    onApplyFilter : function() {
        var filters = {};

        // Reset paging parameters to first page
        filters["start"] = 0;
        filters["limit"] = 25;
        filters["query"] = this.lookupReference('searchfield').getValue();
        this.getStore('batchResults').load({
            params: filters
        });
    },
    onResetFilter : function(btn, ev) {
        this.lookupReference('searchfield').reset();
        this.getStore('batchResults').load();
    },
    onBatchStoreLoad : function(store, records, successful ){
        if(successful){
            var grid  = this.lookupReference("batchGrid");
            grid.getSelectionModel().select(0);
        }
    },

});