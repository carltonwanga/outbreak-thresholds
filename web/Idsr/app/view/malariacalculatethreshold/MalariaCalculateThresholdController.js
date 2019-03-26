/**
 * Created by PAVILION 15 on 10/22/2018.
 */
Ext.define('Idsr.view.malariacalculatethreshold.MalariaCalculateThresholdController', {
    extend: 'Idsr.view.weeklyepidemicdataimportresults.WeeklyEpidemicDataImportResultsController',
    alias: 'controller.malariacalculatethreshold',

    requires: [
        'Idsr.util.Constants'
    ],

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

        this.sideDisplayShowView('errorsGrid');


    },
    onCalculateThresholdClick:function(){
        var me = this;
        me.sideDisplayShowView("calculateThresholdsPanel");
    },
    loadWeeksStore:function(){
        var weeksArray = [];

        for(i = 1; i <=52;i++){

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
    onRequestThresholdCalculation:function () {
        var me = this;
        me.getView().mask('Loading... Please wait...');

        var week = me.lookupReference("weeksFilterCombo").getValue();
        var year = me.lookupReference("yearFilterCombo").getValue();
        var disease = me.lookupReference("diseaseFilterCombo").getValue();

        Ext.Ajax.request({
            url:Idsr.util.Constants.controllersApiFromIndex+'/thresholdcalc/check',
            method:"GET",
            params: {
                week: week,
                year:year,
                disease:disease
            },
            success: function(response, opts) {
                me.getView().unmask();
                var responseData = Ext.JSON.decode(response.responseText);
                var status = responseData.status;
                if(status == 1){
                    Ext.Msg.confirm('Confirm', 'Thresholds for '+year+" week "+week + ' have already been calculated. Do you wish to recalculate' , function(result) {
                        if (result == 'yes') {
                            me.onSubmitThresholdCalculationRequest();

                        }
                    });

                }else{
                    me.onSubmitThresholdCalculationRequest()

                }

            },
            failure: function(response, opts) {
                me.getView().unmask();
                Ext.Msg.alert("Error","Could not submit Request");
            }
        });

    },
    onCancelThresholdCalculation:function () {
        this.lookupReference("calculateThresholdsForm").reset();
        this.sideDisplayShowView('errorsGrid');
    },
    onSubmitThresholdCalculationRequest:function(){
        var me = this;
        me.getView().mask('Calculating... Please wait...');

        var calculationForm = me.lookupReference("calculateThresholdsForm");
        calculationForm.getForm().submit({
            url: Idsr.util.Constants.controllersApiFromIndex+'/thresholdcalc/compute',
            success: function (form, action) {
                me.getView().unmask();
                var responseData = Ext.JSON.decode(action.response.responseText);
                var status = responseData.status;
                if(status == 1) {
                    Ext.Msg.alert('Success', "Thresholds successfully computed");
                    calculationForm.reset();
                    var batchId = responseData.data;
                    me.lookupReference("searchfield").setValue(batchId);
                    me.onApplyFilter();

                }else{
                    Ext.Msg.alert('Error', "Could not submit threshold calculation request");

                }

            },
            failure: function (form, action) {
                me.getView().unmask();
                Ext.Msg.alert('Error', "Could not submit threshold calculation request");
            }
        });
    }
});