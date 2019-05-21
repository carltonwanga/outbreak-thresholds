/**
 * Created by PAVILION 15 on 3/19/2019.
 */
Ext.define('Idsr.view.meningitisthresholdcomputationresults.MeningitisThresholdComputationResultsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.meningitisthresholdcomputationresults',

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

        this.lookupReference("subCountyCombo").getStore().load({
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
    onConfirmatonFilterReset:function(){
        this.lookupReference("confirmationFilterCombo").reset();
        this.onSubmitFilterClick();
    },
    onResetInference:function(){
        this.lookupReference("thresholdInferenceStore").reset();
        this.onSubmitFilterClick();
    },
    onCountySelect:function(combo){
        var selectedCounty = combo.getValue();

        var subCountiesUrl = Idsr.util.Constants.controllersApiFromIndex+'/subcounties?county='+selectedCounty;

        var newSubCountiesProxy = {
            type: 'rest',
            pageSize: 25,
            url:subCountiesUrl ,
            reader: {
                type: 'json',
                rootProperty:'data'
            }
        }

        var subCountiesField = this.lookupReference("subCountyCombo");
        subCountiesField.reset();

        subCountiesField.store.setConfig('proxy',newSubCountiesProxy);
        subCountiesField.store.reload();


    },
    onSubmitFilterClick:function(){
        var me = this;
        var filterForm = me.lookupReference('resultsFilterForm').getForm();
        var filterValues = filterForm.getValues (true,false,false);
        var reportUrl = Idsr.util.Constants.controllersApiFromIndex+"/meningitisthresholdres?"+filterValues;

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

    },
    onSetConfirmationResult:function(){
        var me = this;
        me.sideDisplayShowView('confirmationStatusPanel');

    },
    onSaveConfirmationResults:function(){
        var me = this;
        var form = this.lookupReference("confirmationStatusPanel");

        var requestUrl = Idsr.util.Constants.controllersApiFromIndex+"/meningitisthresholdres/confirm";
        form.submit({
            url:requestUrl,
            waitMsg:'Saving...',
            method:"POST",
            success: function (form, action) {
                var responseStatus = action.result.status;
                if(responseStatus == 1){
                    Ext.Msg.alert('Success', "Confirmation Saved");
                    form.reset();
                    me.getStore('thresholdResults').reload();
                    me.sideDisplayShowView("details");

                    //Update Status Details
                }else{
                    Ext.Msg.alert('Failed', "Could not Save Threshold Confirmation");
                }

            },
            failure: function (form, action) {
                Ext.Msg.alert('Failed', "Could not Save Threshold Confirmation");
            }

        });

    },
    onCancelConfirmationForm:function () {
        this.lookupReference("confirmationStatusPanel").reset();
        this.sideDisplayShowView('details');
    }
});