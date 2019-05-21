/**
 * Created by PAVILION 15 on 3/19/2019.
 */
Ext.define('Idsr.view.meningitisthresholdcomputationresults.MeningitisThresholdComputationResultsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.meningitisthresholdcomputationresults',

    stores: {
        thresholdResults: {
            fields:['id','week','year','sub_county_name','county_name','time_calculated',
                'cases_reported','alert_threshold','action_threshold','sub_county','narration',
                'inference_name','alert_color_codes','inference_id','batch_id',
                'population_used','is_active','result_confirmed','confirmation_notes'
            ],
            autoLoad: true,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/meningitisthresholdres"
            }
        }
    },

    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    }
});