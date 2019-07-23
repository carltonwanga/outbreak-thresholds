Ext.define('Idsr.view.dashboard.DashboardModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.dashboard',

    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],


    stores: {
        positivityChartSummary: {
            fields: ['lab_positivity','sub_county'],
            autoLoad: true,
            proxy:{
                type: 'ajax',
                useDefaultXhrHeader : false,
                url: Idsr.util.Constants.controllersApiFromIndex+'/dashboard/positivityrate/top',
                reader: {
                    type: 'json'
                }
            },
            listeners: {
                beforeload: 'onBeforePositivitySummaryLoad',
                dataChanged: 'onAfterPositivitySummaryLoad'
            }

        },
        yearThresholdResults: {
            fields:['id','week','year','sub_county_name','time_calculated',
                'cases_reported','alert_threshold','action_threshold','sub_county',
                'inference_name','alert_color_codes','inference_id','batch_id',
                'computation_dataset_count','expected_dataset_count','is_active','deaths','lab_positivity',
                'deaths','lab_positivity','mean','c_sum','c_sum_1_96_sd','reporting_rate','extrapolated_cases','cases_reported_sd'
            ],
            autoLoad: true,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/malariathresholdres/subcountyweekly?county=jkG3zaihdSs&subcounty=FoqzDgIByL6&year=2019"
            },
            listeners: {
                load: 'onThresholdStoreLoad'
            }
        }
    },
    data:{
        weekThresholds:{
            epiWeek:'<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>',
            malariaAction:'<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>',
            malariaAlert:'<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>',
            meningitisAction:'<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>',
            meningitisAlert:'<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>'
        }
    }
});