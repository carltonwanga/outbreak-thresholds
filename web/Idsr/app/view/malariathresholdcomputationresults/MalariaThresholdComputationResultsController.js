/**
 * Created by PAVILION 15 on 10/21/2018.
 */
Ext.define('Idsr.view.malariathresholdcomputationresults.MalariaThresholdComputationResultsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.malariathresholdcomputationresults',

    /**
     * Called when the view is created
     */

    init: function() {
        this.loadWeeksStore();
        this.loadYearStore();
    },
    sideDisplayShowView: function(view) {
        var layout = this.getReferences().sideDisplay.getLayout();
        layout.setActiveItem(this.lookupReference(view));
    },
    selectRecord: function(rowmodel, record, index, eOpts) {
        var theController = this;
        // Set selected record
        this.getViewModel().set('record', record);
        // Show details
        this.sideDisplayShowView('details');

    },
    onCountyFilterReset:function(){
        this.lookupReference("countyCombo").reset();
        var filters = {};

        // Reset paging parameters to first page
        filters["start"] = 0;
        filters["limit"] = 25;
        this.lookupReference("subCountyCombo").reset();

        this.lookupReference("subCountyCombo").getStore('historicRecords').load({
            params: filters
        });

        this.onSubmitFilterClick();
    },
    onSubCountyFilterReset:function(){
        this.lookupReference("subCountyCombo").reset();
        this.onSubmitFilterClick();
    },
    onWeekFilterReset:function(){
        this.lookupReference("weeksFilterCombo").reset();
        this.onSubmitFilterClick();
    },
    onYearFilterReset:function(){
        this.lookupReference("yearFilterCombo").reset();
        this.onSubmitFilterClick();
    },
    onStatusFilterReset:function(){
        this.lookupReference("statusFilterCombo").setValue("active");
    },
    onResetInference:function(){
        this.lookupReference("thresholdInferenceStore").reset();
        this.onSubmitFilterClick();
    },
    onCountySelect:function(combo){
        var selectedCounty = combo.getValue();
        var subountyCombo = this.lookupReference("subCountyCombo");

        subountyCombo.reset();
        subountyCombo.getStore().removeAll();

        var filters = {};

        // Reset paging parameters to first page
        filters["start"] = 0;
        filters["limit"] = 25;
        filters["county"] = selectedCounty;

        subountyCombo.getStore().load({
            params: filters
        });


    },
    onSubmitFilterClick:function(){
        var me = this;
        var filterForm = me.lookupReference('resultsFilterForm').getForm();
        var filterValues = filterForm.getValues (true,false,false);
        var reportUrl = Idsr.util.Constants.controllersApiFromIndex+"/malariathresholdres?"+filterValues;

        this.getStore('thresholdResults').setConfig('proxy', {
            type: 'rest',
            url:reportUrl,
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }).load();

    },
    onFilterFormReset:function(){
        this.lookupReference("resultsFilterForm").reset();
        var filters = {};

        // Reset paging parameters to first page
        filters["start"] = 0;
        filters["limit"] = 25;

        this.lookupReference("subCountyCombo").getStore().load({
            params: filters
        });

        this.lookupReference("statusFilterCombo").setValue("active");

        this.onSubmitFilterClick();

    },
    loadWeeksStore:function(){
        var weeksArray = [];

        for(i = 1; i <=53;i++){

            var data = {
                name:i,
                week:i
            };

            weeksArray.push(data);
        }
        var weekStore = Ext.create('Ext.data.Store',{
            fields  : ['name','week'],
            autoLoad: true,
            data : weeksArray,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        });
        this.lookupReference('weeksFilterCombo').setStore(weekStore);
    },
    loadYearStore:function(){
        var startYear = Idsr.util.Constants.thresholdDataStartYear;
        var currentYear = new Date().getFullYear();
        var loopYear = startYear;
        var yearsArray = [];

        for(i = startYear; i <=currentYear;i++){

            var data = {
                name:loopYear,
                year:loopYear
            };

            yearsArray.push(data);
            loopYear++;

        }
        var yearsStore = Ext.create('Ext.data.Store',{
            fields  : ['name','year'],
            autoLoad: true,
            data : yearsArray,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        });
        this.lookupReference('yearFilterCombo').setStore(yearsStore);

    }
});