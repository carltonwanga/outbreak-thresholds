Ext.define('Idsr.view.dashboard.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard',

    requires: [
        'Ext.util.TaskRunner'
    ],
    colors: [
        '#8ca640',
        '#974144',
        '#4091ba',
        '#8e658e',
        '#3b8d8b',
        '#b86465',
        '#d2af69',
        '#6e8852',
        '#3dcc7e',
        '#a6bed1',
        '#cbaa4b',
        '#998baa'
    ],
    init:function(){

        this.fetchDashboardData();
    },
    fetchDashboardData:function(){
        this.fetchTileSummaries();
    },
    onColumnRender: function (sprite, config, data, index) {
        return {
            fillStyle: this.colors[index],
            strokeStyle: index % 2 ? 'none' : 'black',
            opacity: index % 2 ? 1 : 0.5
        };
    },
    onRefreshToggle: function(tool, e, owner) {
        var store, runner;

        if (tool.toggleValue){
            this.clearChartUpdates();
        } else {
            store = this.getStore('networkData');
            if (store.getCount()) {
                runner = this.chartTaskRunner;
                if (!runner) {
                    this.chartTaskRunner = runner = new Ext.util.TaskRunner();
                }
                runner.start({
                    run : function () {
                        // Move the first record to the end
                        var rec = store.first();
                        store.remove(rec);
                        store.add(rec);
                    },
                    interval : 200
                });
            }
        }

        // change the toggle value
        tool.toggleValue = !tool.toggleValue;
    },
    fetchTileSummaries:function(){
        var me = this;
        Ext.Ajax.request({
            url: Idsr.util.Constants.controllersApiFromIndex+'/dashboard/summary/tiles',
            method:"GET",
            success: function(response, opts) {
                var responseData = Ext.JSON.decode(response.responseText);
                var stats = responseData.data;
                me.getViewModel().set("weekThresholds",stats);

            },

            failure: function(response, opts) {
            }
        });
    },
    clearChartUpdates : function() {
        this.chartTaskRunner = Ext.destroy(this.chartTaskRunner);
    },

    destroy: function () {
        this.clearChartUpdates();
        this.callParent();
    },

    onHideView: function () {
        this.clearChartUpdates();
    },
    onRefreshSubcountyToggle:function(){
        this.getViewModel().getStore("positivityChartSummary").reload();
    },
    onBeforePositivitySummaryLoad:function(store, opt){
        this.lookupReference("positivitySummaryContainer").mask("Loading");
    },
    onAfterPositivitySummaryLoad:function(store, opt){
        this.lookupReference("positivitySummaryContainer").unmask();
    },
    onRemoveTracker:function(){
        Ext.Msg.confirm('Confirm', 'Are you sure you want to stop tracking thresholds' , function(result) {
            if (result == 'yes') {

            }
        });

    },
});