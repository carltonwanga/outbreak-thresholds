/**
 * Created by PAVILION 15 on 11/1/2018.
 */
Ext.define('Idsr.view.malariathresholdtracker.MalariaThresholdTrackerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.malariathresholdtracker',

    stores: {
        thresholdChartResults: {
            fields:['id','week','year','sub_county_name','time_calculated',
                'cases_reported','alert_threshold','action_threshold','sub_county',
                'inference_name','alert_color_codes','inference_id','batch_id',
                'computation_dataset_count','expected_dataset_count','is_active'
            ],
            autoLoad: false,
            proxy: {
                type: 'localstorage'
            }
        },
        yearThresholdResults: {
            fields:['id','week','year','sub_county_name','time_calculated',
                'cases_reported','alert_threshold','action_threshold','sub_county',
                'inference_name','alert_color_codes','inference_id','batch_id',
                'computation_dataset_count','expected_dataset_count','is_active','deaths','lab_positivity'
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
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    }
});