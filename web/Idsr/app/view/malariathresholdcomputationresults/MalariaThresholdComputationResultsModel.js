/**
 * Created by PAVILION 15 on 10/21/2018.
 */
Ext.define('Idsr.view.malariathresholdcomputationresults.MalariaThresholdComputationResultsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.malariathresholdcomputationresults',

    stores: {
        thresholdResults: {
            fields:['id','week','year','sub_county_name','county_name','time_calculated',
                'cases_reported','alert_threshold','action_threshold','sub_county','narration',
                'inference_name','alert_color_codes','inference_id','batch_id',
                'computation_dataset_count','expected_dataset_count','is_active',
                'deaths','lab_positivity','mean','c_sum','c_sum_1_96_sd','reporting_rate','extrapolated_cases','cases_reported_sd'
            ],
            autoLoad: true,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/malariathresholdres"
            }
        }

    },

    data: {


    }
});