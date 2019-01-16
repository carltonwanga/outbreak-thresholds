/**
 * Created by PAVILION 15 on 10/29/2018.
 */
Ext.define('Idsr.view.malariathresholdmap.MalariaThresholdMapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.malariathresholdmap',

    requires: [
        'Idsr.util.Constants',
        'Idsr.util.CountiesPaths',
        'Idsr.util.Functions',
        'Idsr.util.SubCountiesPaths'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

        var me = this;
        var task = new Ext.util.DelayedTask(function(){
            me.loadWeeksStore();
            me.loadYearStore();
            me.setPeriodDefaults();
            me.onFetchThresholds();

        });
        task.delay(200);



        this.control({
            '#malCountiesMap': {
                countiesMapClick: this.onCountiesMapClick,
                countiesMapHover: this.onCountiesMapHover
            },
            '#malSubCountyMap': {
                onSubCountiesMapClick: this.onSubCountiesMapClick
            }
        });

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
    setPeriodDefaults:function(){
        var period = Idsr.util.Functions.getCurrentWeekNumber(new Date());
        this.lookupReference('weeksFilterCombo').setValue(period[1]-1);
        this.lookupReference('yearFilterCombo').setValue(period[0]);



    },
    countyTip:null,
    subCountyTipWindow:null,
    onFetchThresholds:function(){
        var me = this;
        var defaultPeriod = Idsr.util.Functions.getCurrentWeekNumber(new Date());
        var week = this.lookupReference('weeksFilterCombo').getValue() ? this.lookupReference('weeksFilterCombo').getValue():defaultPeriod[1];
        var year = this.lookupReference('yearFilterCombo').getValue() ? this.lookupReference('yearFilterCombo').getValue():defaultPeriod[0];

        me.getView().mask('Loading... Please wait...');

        Ext.Ajax.request({
            url:Idsr.util.Constants.controllersApiFromIndex+'/malariathresholdres/all',
            method:"GET",
            params: {
                week: week,
                year:year,
                status:'active'
            },
            success: function(response, opts) {
                me.getView().unmask();
                var responseData = Ext.JSON.decode(response.responseText);
                me.getViewModel().set("weekThresholdData",responseData.data);
            },
            failure: function(response, opts) {
                me.getView().unmask();
                Ext.Msg.alert("Error","Could not fetch thresholds");
            }
        });
    },
    renderCountiesMap:function(){
        var R = Raphael("counties-map-container", 600, 700),
            attr = {
                "fill": "#cccccc",
                "stroke": "#fff",
                "stroke-miterlimit": "4",
                "stroke-width": "1",
                "transform": "s0.8,0.8,60,0"

            };
        var kenyaCounties = Idsr.util.CountiesPaths.kenyaCounties;

        var kenyaMap = {};
        for (var county in kenyaCounties) {
            // Draw a path, then apply attributes to it.
            kenyaMap[county] = R.path(kenyaCounties[county]).attr(attr);
            // Name the internal Raphael id after the countiesPaths property name.
            kenyaMap[county].id = county;
            // Name the element id after the countiesPaths property name.
            kenyaMap[county].node.id = county;
        }
    },
    subCountiesRaphaelMap:null,
    onCountiesMapClick:function(ev){
        var me = this;
        var origEl = ev.target || ev.srcElement;
        var pathEl = Ext.get(origEl);
        var selectedCounty = pathEl.id;
        me.getViewModel().set("selectedCounty",selectedCounty);

        me.getStore("currentSubCountyThresholds").removeAll();


        //Update Title
        me.getViewModel().set('detailViewPanel',me.humanize(selectedCounty)+' sub-counties');

        //Show sub-counties map
        if(me.subCountiesRaphaelMap){
            me.subCountiesRaphaelMap.clear();
        }
        me.subCountiesRaphaelMap = Raphael("mal-sub-counties-map", 500, 600),
            attr = {
                "fill": "#b9b9b9",
                "stroke": "#fff",
                "stroke-miterlimit": "4",
                "stroke-width": "1",
                "transform": "s0.8,0.8,60,0"

            };
        var subCounties = Idsr.util.SubCountiesPaths.kenyaCountySubCounties[selectedCounty];

        var countyMap = {};
        for (var subCounty in subCounties) {
            // Draw a path, then apply attributes to it.
            countyMap[subCounty] = me.subCountiesRaphaelMap.path(subCounties[subCounty]).attr(attr);
            // Name the internal Raphael id after the countiesPaths property name.
            countyMap[subCounty].id = subCounty;
            // Name the element id after the countiesPaths property name.
            countyMap[subCounty].node.id = subCounty;
        }

        //Load results and color on map
        var weekThresholdData = me.getViewModel().get("weekThresholdData");

        var countySubCounties = [];
        for(i=0;i<weekThresholdData.length;i++){
            if(weekThresholdData[i]['county_map_code'] == selectedCounty){
                var subCountyRes = weekThresholdData[i];
                me.getStore("currentSubCountyThresholds").add(subCountyRes);
                var subCounty = subCountyRes['sub_county_map_code'];
                var subCountyColor = subCountyRes['alert_color_codes'];
                var subCountyPath = me.subCountiesRaphaelMap.getById(subCounty);
                if(subCountyPath){
                    subCountyPath.attr({ fill: subCountyColor})
                }


            }

        }

    },
    onCountiesMapHover:function(ev){
        var me = this;
        if(me.countyTip){
            me.countyTip.destroy();
        }
        var origEl = ev.target || ev.srcElement;
        var pathEl = Ext.get(origEl);
        var selectedCounty = pathEl.id;
        var toolTipText = me.humanize(selectedCounty);
        me.countyTip = Ext.create('Ext.tip.ToolTip', {
            html: toolTipText
        });
        me.countyTip.showBy(pathEl);
    },

    onSubCountiesMapClick:function(ev){
        var me = this;
        if(me.subCountyTipWindow){
            me.subCountyTipWindow.close();
        }

        var origEl = ev.target || ev.srcElement;
        var pathEl = Ext.get(origEl);
        var selectedCounty = me.getViewModel().get('selectedCounty');
        var selectedSubCounty = pathEl.id;

        var weekThresholdData = me.getViewModel().get("weekThresholdData");
        var subCountyData;
        for(j = 0;j<weekThresholdData.length;j++){
            if(weekThresholdData[j].county_map_code == selectedCounty && weekThresholdData[j].sub_county_map_code == selectedSubCounty){
                subCountyData = weekThresholdData[j];


            }
        }

        if(subCountyData){
            me.subCountyTipWindow = Ext.create('Ext.window.Window', {
                title: me.humanize(selectedSubCounty),
                bodyPadding: 4,
                height: 300,
                width: 400,
                items:[
                    {
                     xtype: 'displayfield',
                     fieldLabel: 'Inference',
                     value: subCountyData.inference_name
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Cases',
                        value: subCountyData.cases_reported
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Alert Threshold',
                        value: subCountyData.alert_threshold
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Action Threshold',
                        value: subCountyData.action_threshold
                    }
                ]
            }).showBy(pathEl);
        }else{
            me.subCountyTipWindow = Ext.create('Ext.window.Window', {
                title: me.humanize(selectedSubCounty),
                bodyPadding: 4,
                height: 150,
                width: 400,
                items:[
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Status',
                        value: "Could not find threshold results for "+me.humanize(selectedSubCounty)+" Sub-county"
                    }
                ]
            }).showBy(pathEl);

        }



    },
    humanize:function(str) {
        var frags = str.split('_');
        for (i=0; i<frags.length; i++) {
            frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
        }
        return frags.join(' ');
    }
});