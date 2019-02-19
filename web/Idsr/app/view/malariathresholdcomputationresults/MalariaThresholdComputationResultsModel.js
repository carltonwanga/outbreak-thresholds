/**
 * Created by PAVILION 15 on 10/21/2018.
 */
Ext.define('Idsr.view.malariathresholdcomputationresults.MalariaThresholdComputationResultsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.malariathresholdcomputationresults',

    formulas: {
        iconurl:function(get){
            var icon = get("currentWeekWeather.icon");

            if(icon == 'partly-cloudy-day'){
                return 'https://www.weatherbit.io/static/img/icons/c04d.png';
            }else if(icon == 'clear-day'){
                return 'https://www.weatherbit.io/static/img/icons/c01d.png';
            }else if(icon == 'clear-night'){
                return 'https://www.weatherbit.io/static/img/icons/c01n.png';
            }else if(icon == 'rain'){
                return 'https://www.weatherbit.io/static/img/icons/r03d.png';
            }else if(icon == 'wind'){
                return 'https://www.weatherbit.io/static/img/icons/a01d.png';
            }else if(icon == 'fog'){
                return 'https://www.weatherbit.io/static/img/icons/a05d.png';
            }else if(icon == 'partly-cloudy-day'){
                return 'https://www.weatherbit.io/static/img/icons/c02d.png';
            }else if(icon == 'partly-cloudy-night'){
                return 'https://www.weatherbit.io/static/img/icons/c02n.png';
            }else{
                return 'https://www.weatherbit.io/static/img/icons/t01d.png';
            }
        }
    },
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