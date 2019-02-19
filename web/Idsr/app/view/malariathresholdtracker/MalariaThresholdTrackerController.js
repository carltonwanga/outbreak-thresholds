/**
 * Created by PAVILION 15 on 11/1/2018.
 */
Ext.define('Idsr.view.malariathresholdtracker.MalariaThresholdTrackerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.malariathresholdtracker',

    requires: [
        'Ext.util.TaskManager'
    ],

    /**
     * Called when the view is created
     */
    init: function() {
        this.loadYearStore();
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
    onResetFilterForm:function(){
        this.lookupReference("resultsFilterForm").reset();

    },
    onFetchResults:function(){
        var me = this;
        me.getView().mask();
        var filterParams = me.lookupReference("resultsFilterForm").getValues();
        me.getStore("yearThresholdResults").load({
            params:filterParams
        });

    },
    onThresholdSeriesTooltipRender: function (tooltip, record, item) {
        var title = item.series.getTitle();

        tooltip.setHtml(title + ' on week ' + record.get('week') + ': ' +
            record.get(item.series.getYField()));
    },
    onToggleThresholdTrackingMarkers: function () {
        var chart = this.lookupReference('thresholdchart'),
            seriesList = chart.getSeries(),
            ln = seriesList.length,
            i = 0,
            series;

        for (; i < ln; i++) {
            series = seriesList[i];
            series.setShowMarkers(!series.getShowMarkers());
        }

        chart.redraw();
    },

    onPreviewTrackingChart: function () {
        var chart = this.lookupReference('thresholdchart');
        chart.preview();
    },
    onDownloadTrackingChart: function() {
        var chart = this.lookupReference('thresholdchart');
        if (Ext.os.is.Desktop) {
            chart.download({
                filename: 'Threshold tracking chart'
            });
        } else {
            chart.preview();
        }
    },
    currentAnimationGrowthIndex:0,
    onAnimateThresholdLineChart:function(){
        var chart = this.lookupReference('thresholdchart');
        chart.getStore().removeAll();
        this.addNewThresholdChartData();
        var storeCount = this.getStore('yearThresholdResults').getCount()-1;
        this.timeChartTask = Ext.TaskManager.start({
            run: this.addNewThresholdChartData,
            interval: 1000,
            repeat: storeCount,
            scope: this
        });

    },
    onThresholdChartDestroy:function(){
        if (this.timeChartTask) {
            Ext.TaskManager.stop(this.timeChartTask);
        }
    },
    addNewThresholdChartData:function(){
        var me = this;
        me.currentAnimationGrowthIndex++;
        var resultStore = me.getStore("yearThresholdResults");
        var thresholdChartStore = me.getStore("thresholdChartResults");
        thresholdChartStore.add(resultStore.getAt(me.currentAnimationGrowthIndex));

    },
    onThresholdStoreLoad:function(store, records, success, operation){
        this.getView().unmask();
        var thresholdChartResultsStore = this.getStore("thresholdChartResults");
        thresholdChartResultsStore.removeAll();
        thresholdChartResultsStore.add(records);
    },
    onPositivitySeriesTooltipRender: function (tooltip, record, item) {
        var title = item.series.getTitle();

        tooltip.setHtml(title + ' on week ' + record.get('week') + ': ' +
            record.get(item.series.getYField())+'%');
    },
    onPositivityAxisLabelRender:function(axis, label, layoutContext){
        return layoutContext.renderer(label) + '%';

    },
    onTogglePositivityChartMarkers: function () {
        var chart = this.lookupReference('positivityComparisonChart'),
            seriesList = chart.getSeries(),
            ln = seriesList.length,
            i = 0,
            series;

        for (; i < ln; i++) {
            series = seriesList[i];
            series.setShowMarkers(!series.getShowMarkers());
        }

        chart.redraw();
    },
    onPreviewPositivityChart: function () {
        var chart = this.lookupReference('positivityComparisonChart');
        chart.preview();
    },
    onDownloadPositivityChart: function() {
        var chart = this.lookupReference('positivityComparisonChart');
        if (Ext.os.is.Desktop) {
            chart.download({
                filename: 'Positivity Comparison Chart'
            });
        } else {
            chart.preview();
        }
    },
    onToggleDeathsChartMarkers: function () {
        var chart = this.lookupReference('deathsComparisonChart'),
            seriesList = chart.getSeries(),
            ln = seriesList.length,
            i = 0,
            series;

        for (; i < ln; i++) {
            series = seriesList[i];
            series.setShowMarkers(!series.getShowMarkers());
        }

        chart.redraw();
    },
    onPreviewDeathsChart: function () {
        var chart = this.lookupReference('deathsComparisonChart');
        chart.preview();
    },
    onDownloadDeathsChart: function() {
        var chart = this.lookupReference('deathsComparisonChart');
        if (Ext.os.is.Desktop) {
            chart.download({
                filename: 'Deaths Comparison Chart'
            });
        } else {
            chart.preview();
        }
    }



});