/**
 * Created by PAVILION 15 on 10/8/2018.
 */
Ext.define('Idsr.view.weeklyepidemichistoricrecords.WeeklyEpidemicHistoricRecordsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.weeklyepidemichistoricrecords',

    requires: [
        'Idsr.util.Constants'
    ],

    /**
     * Called when the view is created
     */
    init: function() {
        this.loadYearStore();
        this.loadWeeksStore();

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
        var startYear = Idsr.util.Constants.historicDataStartYear;
        var currentYear = Idsr.util.Constants.historicDataEndYear;
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
    sideDisplayShowView: function(view) {
        var layout = this.getReferences().sideDisplay.getLayout();
        layout.setActiveItem(this.lookupReference(view));
    },
    onDefaultChanged:function (radio, newValue, oldValue) {
        if(radio.getValue()){
            var importConfigForm = this.lookupReference("importConfigForm");
            importConfigForm.reset();
            var defaultValues = this.getViewModel().get("templateConfigDefaults");
            var defaultRecord = Ext.create("Ext.data.Model",defaultValues);
            importConfigForm.loadRecord(defaultRecord);
        }

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
    onFilterFormReset:function(){
        this.lookupReference("recordsFilterForm").reset();
        var filters = {};

        // Reset paging parameters to first page
        filters["start"] = 0;
        filters["limit"] = 25;

        this.lookupReference("subCountyCombo").getStore().load({
            params: filters
        });

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
    selectHistoricRecord: function(rowmodel, record, index, eOpts) {
        var theController = this;
        // Set selected record
        this.getViewModel().set('record', record);
        // Show details
        this.sideDisplayShowView('details');

    },
    onImportDataClick:function(){
        this.sideDisplayShowView('importPanel');
    },
    onSubmitImport:function(){
        var me = this;
        var importConfigForm = this.lookupReference("importConfigForm");
        if(importConfigForm.isValid()){
            var formValues = importConfigForm.getValues();
            var configItems = [];
            configItems.push(formValues.cases_greater_5);
            configItems.push(formValues.cases_less_5);
            configItems.push(formValues.date_reported);
            configItems.push(formValues.deaths_greater_5);
            configItems.push(formValues.deaths_less_5);
            configItems.push(formValues.disease);
            configItems.push(formValues.subcounty);
            configItems.push(formValues.week);
            configItems.push(formValues.weekending);
            configItems.push(formValues.year);

            if(this.hasDuplicates(configItems)){
                Ext.Msg.alert("Error","Duplicate column positions in the template configuration");
            }else{

                importConfigForm.mask("Submitting");
                importConfigForm.submit({
                    url:Idsr.util.Constants.controllersApiFromIndex+'/moh505historic/import',
                    success: function(form, action) {
                        importConfigForm.unmask();
                        var responseData = Ext.JSON.decode(action.response.responseText);
                        var status = responseData.status;
                        if(status == 1){
                            importConfigForm.getForm().reset();
                            Ext.Msg.alert("Success","Data imported successfully");
                        }else{
                            Ext.Msg.alert("Error",responseData.message);
                        }
                    },
                    failure: function(form, action) {
                        importConfigForm.unmask();
                        Ext.Msg.alert('Error', "Could not import data");
                    }

                });

            }

        }else{
            Ext.Msg.alert("Error","Please ensure that all fields have valid values");
        }
    },

    hasDuplicates:function(array) {
        var valuesSoFar = [];
        for (var i = 0; i < array.length; ++i) {
            var value = array[i];
            if (valuesSoFar.indexOf(value) !== -1) {
                return true;
            }
            valuesSoFar.push(value);
        }
        return false;
    },

    onSubmitFilterClick:function(){
        var me = this;
        var filterForm = me.lookupReference('recordsFilterForm').getForm();
        var filterValues = filterForm.getValues (true,false,false);
        var reportUrl = Idsr.util.Constants.controllersApiFromIndex+"/moh505historic?"+filterValues;

        this.getStore('historicRecords').setConfig('proxy', {
            type: 'rest',
            url:reportUrl,
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }).load();

    }
});