/**
 * Created by PAVILION 15 on 3/20/2019.
 */
Ext.define('Idsr.view.meningitisthresholdtracker.MeningitisThresholdTrackerModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.meningitisthresholdtracker',

    stores: {
        thresholdChartResults: {
            fields:['id','week','year','sub_county_name','time_calculated',
                'cases_reported','alert_threshold','action_threshold','sub_county',
                'inference_name','alert_color_codes','inference_id','batch_id',
                'is_active','population_used'
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
                'is_active','population_used'
            ],
            autoLoad: false,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/meningitisthresholdres/subcountyweekly"
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