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

    },
    addDateToTimeStamp: function(timeStampToCheck,index){
        var startDate = new Date(timeStampToCheck*1000);
        var currentDate = new Date(startDate.setDate(startDate.getDate() + index));

        return Math.round(currentDate.getTime() / 100)

    },
    getDateOfISOWeek:function(w, y){
        var simple = new Date(y, 0, 1 + (w - 1) * 7);
        var dow = simple.getDay();
        var ISOweekStart = simple;
        if (dow <= 4)
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        else
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        var ts = Math.round(ISOweekStart.getTime() / 1000);

        this.addDateToTimeStamp(ts,2);
        return ts;

    },
    onShowWeatherPanel:function () {
        this.sideDisplayShowView('weatherPanel');
        this.lookupReference("weatherPanel").setActiveItem(0);
        this.fetchWeatherData(0);
    },
    fetchWeatherData:function(dayOfWeek){
        var me = this;
        var currentRecord = me.getViewModel().get("record");
        var week = currentRecord.get("week");
        var year = currentRecord.get("year");
        var startOfWeekTime = this.getDateOfISOWeek(week,year);


        var dayOfWeekDate = new Date(startOfWeekTime*1000);
        dayOfWeekDate.setDate(dayOfWeekDate.getDate() +dayOfWeek);

        var dateOfWeekTime = Math.round(dayOfWeekDate.getTime()/ 1000);

        var subCounty = currentRecord.get("sub_county");
        var dayOfWeekPanel = me.lookupReference("weatherPanel").items.items[dayOfWeek];
        dayOfWeekPanel.removeAll();

        me.getView().mask('Loading... Please wait...');

        Ext.Ajax.request({
            url:Idsr.util.Constants.controllersApiFromIndex+'/weatherapi/check',
            method:"GET",
            params: {
                subcounty: subCounty,
                time:dateOfWeekTime
            },
            success: function(response, opts) {
                me.getView().unmask();
                var responseData = Ext.JSON.decode(response.responseText);
                if(typeof(responseData.data.daily) === "undefined"){
                    Ext.Msg.alert("Error","Could not fetch weather details");

                }else{

                    dayOfWeekPanel.add({
                        xtype: 'dailyweatherpanel'
                    });
                    me.getViewModel().set("currentWeekWeather",responseData.data.daily.data[0]);

                }
            },
            failure: function(response, opts) {
                me.getView().unmask();
                Ext.Msg.alert("Error","Could not fetch weather details");
            }
        });


    },
    onWeatherTabChange:function(tabPanel, newTab){
        var activeTabIndex = tabPanel.items.indexOf(newTab);
        this.fetchWeatherData(activeTabIndex);
    }
});