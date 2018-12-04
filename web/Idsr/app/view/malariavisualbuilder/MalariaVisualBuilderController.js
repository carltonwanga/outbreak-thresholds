/**
 * Created by PAVILION 15 on 11/23/2018.
 */
Ext.define('Idsr.view.malariavisualbuilder.MalariaVisualBuilderController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.malariavisualbuilder',

    /**
     * Called when the view is created
     */
    init: function() {
        this.loadYearStore();

    },
    requires: [
        'Ext.util.DelayedTask',
        'Idsr.view.malariavisualbuilder.FieldPropertiesContainer',
        'Idsr.view.plugins.logaxis.Logarithmic',
        'Ext.chart.theme.*'
    ],
    onCountySelect:function(combo){
        var selectedCounty = combo.getValue();
        var subCountyCombo = this.lookupReference("subCountyCombo");

        subCountyCombo.reset();

        var filters = {};

        // Reset paging parameters to first page
        filters["start"] = 0;
        filters["limit"] = 25;
        filters["county"] = selectedCounty;

        subCountyCombo.getStore().load({
            params: filters
        });

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
    sourceFieldsGridDrop:function(node, data){
        var sourceGridId = data.view.id;
        var droppedRecords = data.records;
        var propertiesPanel = this.lookupReference("propertiesPanel");
        Ext.Array.each(droppedRecords, function(droppedRecord, index) {
            if(sourceGridId == 'mvbYAxisFieldsGrid'){
                var axisItemId = droppedRecord.get("value")+'-y';
                propertiesPanel.remove(axisItemId);
            }else if(sourceGridId == 'mvbXAxisFieldsGrid'){
                var axisItemId = droppedRecord.get("value")+'-x';
                propertiesPanel.remove(axisItemId);

            }
        });


    },
    onFetchResults:function(){
        var me = this;
        me.getView().mask();
        var filterParams = me.lookupReference("resultsFilterForm").getValues();
        me.getStore("yearThresholdResults").load({
            params:filterParams
        });

    },
    onThresholdStoreLoad:function(store, records, success, operation){
        this.getView().unmask();
        var thresholdChartResultsStore = this.getStore("thresholdChartResults");
        thresholdChartResultsStore.removeAll();
        thresholdChartResultsStore.add(records);
    },
    yAxisItemSelect:function(rowmodel, record, index){
        var selectedContainerId = record.get("value")+'-y';
        var propertiesPanel = this.lookupReference("propertiesPanel");
        new Ext.util.DelayedTask(function(){
            propertiesPanel.getLayout().setActiveItem(propertiesPanel.down("#"+selectedContainerId));
        }).delay(200);

    },
    xAxisItemSelect:function(rowmodel, record, index){
        var selectedContainerId = record.get("value")+'-x';
        var propertiesPanel = this.lookupReference("propertiesPanel");
        new Ext.util.DelayedTask(function(){
            propertiesPanel.getLayout().setActiveItem(propertiesPanel.down("#"+selectedContainerId));
        }).delay(200);

    },
    xAxisRowClick:function(tbl, record, tr, rowIndex){
        var selectedContainerId = record.get("value")+'-x';
        var propertiesPanel = this.lookupReference("propertiesPanel");
        new Ext.util.DelayedTask(function(){
            propertiesPanel.getLayout().setActiveItem(propertiesPanel.down("#"+selectedContainerId));
        }).delay(200);

    },
    yAxisRowClick:function(tbl, record, tr, rowIndex){
        var selectedContainerId = record.get("value")+'-y';
        var propertiesPanel = this.lookupReference("propertiesPanel");
        new Ext.util.DelayedTask(function(){
            propertiesPanel.getLayout().setActiveItem(propertiesPanel.down("#"+selectedContainerId));
        }).delay(200);

    },
    yAxisSetDrop:function( node, data){
        var sourceGridId = data.view.id;
        var droppedRecords = data.records;
        var propertiesPanel = this.lookupReference("propertiesPanel");

        Ext.Array.each(droppedRecords, function(droppedRecord, index) {
           if(sourceGridId == 'mvbFieldsSourceGrid'){
               var recordValue = droppedRecord.get("value");
               propertiesPanel.add({
                   xtype:'fieldpropertiescontainer',
                   itemId:recordValue+'-y',
                   title: droppedRecord.get("name")
               });

           }else if(sourceGridId == 'mvbXAxisFieldsGrid'){
               var recordValue = droppedRecord.get("value");
               var xAxisContainer = recordValue+'-x';
               propertiesPanel.remove(propertiesPanel.down("#"+xAxisContainer));

               propertiesPanel.add({
                   xtype:'fieldpropertiescontainer',
                   itemId:recordValue+'-y',
                   title: droppedRecord.get("name")
               });


           }
        });
    },
    xAxisSetDrop:function( node, data){
        var me = this;
        var sourceGridId = data.view.id;
        var droppedRecords = data.records;
        var propertiesPanel = this.lookupReference("propertiesPanel");
        Ext.Array.each(droppedRecords, function(droppedRecord, index) {
            if(sourceGridId == 'mvbFieldsSourceGrid'){
                var recordValue = droppedRecord.get("value");
                me.getViewModel().set("xAxisTitle",droppedRecord.get("name"));
                propertiesPanel.add({
                    xtype:'xaxispropertiescontainer',
                    itemId:recordValue+'-x',
                    title: droppedRecord.get("name")+' '+'Config'
                });

            }else if(sourceGridId == 'mvbYAxisFieldsGrid'){
                var recordValue = droppedRecord.get("value");
                var yAxisContainer = recordValue+'-y';
                propertiesPanel.remove(propertiesPanel.down("#"+yAxisContainer));

                propertiesPanel.add({
                    xtype:'fieldpropertiescontainer',
                    itemId:recordValue+'-y',
                    title: droppedRecord.get("name")+' '+'Config'
                });

            }
        });
    },
    onBeforeXAxisSetDrop: function(node, data, overModel, dropPosition, dropHandlers) {
        // Defer the handling
        dropHandlers.wait = true;
        var xAxisStoreLength = this.getStore("setXAxisFields").getCount();
        if (xAxisStoreLength == 0) {
            dropHandlers.processDrop();
        } else {
            Ext.Msg.alert("Error","Only One Field Can be Set in the x-Axis");
            dropHandlers.cancelDrop();
        }
    },
    onSeriesConfigSelect:function(combo,record){
        var selectedSeriesConfig = record.get("value");

        var seriesConfigContainer = combo.up('container').down('#seriesConfigContainer');
        seriesConfigContainer.removeAll();


        if(selectedSeriesConfig == 'bar'){
            seriesConfigContainer.add(
                {
                    xtype:'mvbbarchartseriesconfig'
                }
            );
        }else if(selectedSeriesConfig == 'line'){
            seriesConfigContainer.add(
                {
                    xtype:'mvblinechartseriesconfig'
                }
            );

        }else if(selectedSeriesConfig == 'scatter'){
            seriesConfigContainer.add(
                {
                    xtype:'mvbscatterchartseriesconfig'
                }
            );

        }

    },
    onGenerateGraph:function(){
        var me = this;
        var chartTitle = me.lookupReference("chartTitle").getValue();
        var flipConfig  = me.lookupReference("flipAxisConfig").getValue();
        var showLegendConfig = me.lookupReference("showLegendCheck").getValue();
        var legendLocation = me.lookupReference("legendLocationCombo").getValue();

        var propertiesPanel = this.lookupReference("propertiesPanel");


        var chartLegend = null;
        if(showLegendConfig){
            chartLegend = {
                docked: legendLocation
            }
        }

        var xAxisStore  = me.getViewModel().getStore("setXAxisFields");
        var yAxisStore  = me.getViewModel().getStore("setYAxisFields");

        if(xAxisStore.getCount()==0){
            Ext.Msg.alert("Error","Please set a X-Axis field");
        }else{
            if(yAxisStore.getCount()==0){
                Ext.Msg.alert("Error","Please set at least one Y-Axis field");
            }else{
                var xAxisItem = xAxisStore.getAt(0);
                var xAxisItemId = xAxisItem.get("value")+'-x';

                var chartAxes = [];
                var chartSeries = [];

                var bottomAxisConfig = {
                    type: 'category',
                    fields: xAxisItem.get("value"),
                    position: 'bottom',
                    grid: true
                }

                var leftAxisFields = [];
                var rightAxisFields = [];

                yAxisStore.each(function (recordItem) {

                    var configDetails = propertiesPanel.down('#'+recordItem.get("value")+'-y');
                    var selectedSeries = configDetails.down("#seriesType").getValue();

                    var yAxisLocation = configDetails.down("#yAxisLocationCombo").getValue();

                    if(yAxisLocation == 'left'){
                        leftAxisFields.push(recordItem.get("value"));

                    }else if(yAxisLocation == 'right'){
                        rightAxisFields.push(recordItem.get("value"));

                    }


                    if(selectedSeries){
                        var itemSeriesConfig = {
                            type: selectedSeries,
                            title: recordItem.get("name"),
                            xField: xAxisItem.get("value"),
                            yField: recordItem.get("value")

                        }


                        if(selectedSeries == 'bar'){
                            itemSeriesConfig.stacked =  false;
                            var highlightConfig =  {

                            }

                            //Bar highlight Check
                            var fillStyleCombo = configDetails.down("#mvbFillStyle");
                            var strokeStyleCombo = configDetails.down("#mvbStrokeStyle");

                            if(fillStyleCombo.isDirty()){
                                highlightConfig.fillStyle = '#'+fillStyleCombo.getValue();
                            }

                            if(strokeStyleCombo.isDirty()){
                                highlightConfig.strokeStyle = '#'+strokeStyleCombo.getValue();
                            }

                            if(fillStyleCombo.isDirty()||strokeStyleCombo.isDirty()){
                                itemSeriesConfig.highlight = highlightConfig;
                            }

                            //Bar Chart Label
                            var labelDisplayCombo = configDetails.down("#mvbLabelDisplayPicker");
                            var labelColorPicker = configDetails.down("#mvbLabelColorPicker");

                            var labelConfig = {
                                field : recordItem.get("value"),
                                display: labelDisplayCombo.getValue()
                            }

                            if(labelColorPicker.isDirty()){
                                labelConfig.color = '#'+labelColorPicker.getValue();
                            }

                            itemSeriesConfig.label = labelConfig;

                            //Show tooltip Config
                            /*var showTooltipCheck = configDetails.down("#mvbShowTooltipCheck");
                            if(showTooltipCheck.getValue()){
                                itemSeriesConfig.tooltip = {
                                    renderer: 'onCustomBarTipRender'
                                }
                            }*/



                        }

                        if(selectedSeries == 'line'){
                            var lineSmoothValue = configDetails.down("#lineSmoothCombo").getValue();
                            itemSeriesConfig.smooth =  lineSmoothValue;

                            //Line Graph Style Config
                            var lineStyleConfig = {};

                            var mvblLineWidth = configDetails.down("#mvblLineWidth");
                            var mvblFillColor = configDetails.down("#mvblFillColor");
                            var mvblStrokeColor = configDetails.down("#mvblStrokeColor");
                            var mvblFillOpacity = configDetails.down("#mvblFillOpacity");
                            var mvblFillCheck = configDetails.down("#mvblFillCheck");
                            var mvblMarker = configDetails.down("#mvblMarker");

                            if(mvblLineWidth.isDirty()){
                                lineStyleConfig.lineWidth = mvblLineWidth.getValue();
                            }

                            if(mvblStrokeColor.isDirty()){
                                lineStyleConfig.stroke = '#'+mvblStrokeColor.getValue();
                            }

                            if(mvblFillCheck.getValue()){
                                if(mvblFillColor.isDirty()){
                                    lineStyleConfig.fill = '#'+mvblFillColor.getValue();
                                }

                            }

                            if(mvblFillOpacity.isDirty()){
                                lineStyleConfig.fillOpacity = mvblFillOpacity.getValue();
                            }

                            itemSeriesConfig.style = lineStyleConfig;

                            //Marker Config
                            if(mvblMarker.getValue() != 'none'){
                                var markerConfig = {
                                    type: mvblMarker.getValue(),
                                    fx: {
                                        duration: 200,
                                        easing: 'backOut'
                                     }
                                }

                                itemSeriesConfig.marker = markerConfig;

                            }

                            //Line Chart Label
                            var lineLabelDisplayCombo = configDetails.down("#mvblLabelDisplayPicker");
                            var lineLabelColorPicker = configDetails.down("#mvblLabelColorPicker");

                            var labelConfig = {
                                field : recordItem.get("value"),
                                display: lineLabelDisplayCombo.getValue()
                            }

                            if(lineLabelColorPicker.isDirty()){
                                labelConfig.color = '#'+lineLabelColorPicker.getValue();
                            }

                            itemSeriesConfig.label = labelConfig;

                        }

                        if(selectedSeries == 'scatter'){

                            //Scatter Chart Label
                            var scatterLabelDisplayCombo = configDetails.down("#mvbsLabelDisplayPicker");
                            var scatterLabelColorPicker = configDetails.down("#mvbsLabelColorPicker");

                            var labelConfig = {
                                field : recordItem.get("value"),
                                display: scatterLabelDisplayCombo.getValue()
                            }

                            if(scatterLabelColorPicker.isDirty()){
                                labelConfig.color = '#'+scatterLabelColorPicker.getValue();
                            }

                            itemSeriesConfig.label = labelConfig;

                        }
                        chartSeries.push(itemSeriesConfig);

                    }
                });


                chartAxes.push(bottomAxisConfig);

                if(leftAxisFields.length > 0){
                    var leftAxisConfig = {
                        type: 'logarithmic',
                        fields: leftAxisFields,
                        position: 'left',
                        grid: true
                    }

                    chartAxes.push(leftAxisConfig);

                }

                if(rightAxisFields.length > 0){
                    var rightAxisConfig = {
                        type: 'numeric',
                        fields: rightAxisFields,
                        position: 'right',
                        grid: true
                    }

                    chartAxes.push(rightAxisConfig);

                }

                var chartStore = me.getStore("yearThresholdResults");

                var chartToRender = Ext.create('Ext.chart.CartesianChart', {
                    xtype: 'cartesian',
                    reference: 'customChart',
                    width: '100%',
                    height: 500,
                    store: chartStore,
                    margin: '30 5 5 5',
                    sprites: [{
                        type: 'text',
                        text: chartTitle,
                        fontSize: 20,
                        width: 100,
                        height: 30,
                        x: 40, // the sprite x position
                        y: 20  // the sprite y position
                    }],
                    flipXY:flipConfig,
                    legend:chartLegend,
                    axes: chartAxes,
                    series: chartSeries,
                    tbar: [
                        '->',
                        {
                            xtype:'button',
                            ui:'soft-purple',
                            iconCls: 'fa fa-toggle-on',
                            text: 'Change Theme',
                            handler: 'onChangeChartTheme'
                        },
                        {
                            xtype:'button',
                            ui:'soft-blue',
                            iconCls: 'fa fa-expand',
                            text: 'Preview',
                            handler: 'onPreviewChart'
                        },
                        {
                            xtype:'button',
                            ui:'soft-green',
                            iconCls: 'fa fa-download',
                            text: 'Download',
                            handler: 'onDownloadChart'
                        }

                    ]

                });


                var graphPanel = me.lookupReference('graphPanel');
                graphPanel.removeAll();
                graphPanel.add(chartToRender);
            }

        }

    },
    onChangeChartTheme: function () {
        var chart = this.lookupReference('customChart'),
            currentThemeClass = Ext.getClassName(chart.getTheme()),
            themes = Ext.chart.theme,
            themeNames = [],
            currentIndex = 0,
            name;

        for (name in themes) {
            if (Ext.getClassName(themes[name]) === currentThemeClass) {
                currentIndex = themeNames.length;
            }
            if (name !== 'Base' && name.indexOf('Gradients') < 0) {
                themeNames.push(name);
            }
        }
        chart.setTheme(themes[themeNames[++currentIndex % themeNames.length]]);
    },
    onPreviewChart: function () {
        var chart = this.lookupReference('customChart');
        chart.preview();
    },
    onDownloadChart: function() {
        var chart = this.lookupReference('customChart');
        if (Ext.os.is.Desktop) {
            chart.download({
                filename: 'Thresholds Chart'
            });
        } else {
            chart.preview();
        }
    }
});