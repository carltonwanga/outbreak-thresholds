/**
 * Created by PAVILION 15 on 11/23/2018.
 */
Ext.define('Idsr.view.malariavisualbuilder.MalariaVisualBuilderModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.malariavisualbuilder',

    stores: {
        legendLocations:{
            fields: ['value', 'name'],
            data : [
                {"value":"top", "name":"Top"},
                {"value":"bottom", "name":"Bottom"},
                {"value":"right", "name":"Right"},
                {"value":"left", "name":"Left"}
            ]
        },
        dataFields:{
            fields: ['value','name','type'],
            data : [
                {"value":"cases_reported", "name":"Cases", "type":"numeric"},
                {"value":"alert_threshold", "name":"Alert Threshold", "type":"numeric"},
                {"value":"action_threshold", "name":"Action Threshold", "type":"numeric"},
                {"value":"deaths", "name":"Deaths", "type":"numeric"},
                {"value":"lab_positivity", "name":"Positivity Rate", "type":"numeric"},
                {"value":"mean", "name":"Mean", "type":"numeric"},
                {"value":"c_sum", "name":"C-SUM", "type":"float"},
                {"value":"c_sum_1_96_sd", "name":"C-SUM+1.96SD", "type":"float"},
                {"value":"extrapolated_cases", "name":"Extrapolated Cases", "type":"numeric"},
                {"value":"cases_reported_sd", "name":"Standard deviation", "type":"numeric"},
                {"value":"week", "name":"Week", "type":"numeric"}
            ]
        },
        setYAxisFields:{
            fields: ['value','name','type']
        },
        setXAxisFields:{
            fields: ['value','name','type']
        },
        yearThresholdResults: {
            fields:['id','week','year','sub_county_name','time_calculated',
                'cases_reported','alert_threshold','action_threshold','sub_county',
                'inference_name','alert_color_codes','inference_id','batch_id',
                'computation_dataset_count','expected_dataset_count','is_active',
                'deaths','lab_positivity','mean','c_sum','c_sum_1_96_sd',
                'reporting_rate','extrapolated_cases','cases_reported_sd'
            ],
            autoLoad: false,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/malariathresholdres/subcountyweekly"
            },
            listeners: {
                load: 'onThresholdStoreLoad'
            }
        }
    },

    data: {
        showLegend:true,
        legendDock:'bottom',
        flipAxis:false,
        xAxisTitle:'',
        xAxisRotate:false,
        dataStoreLoaded:false
    }
});