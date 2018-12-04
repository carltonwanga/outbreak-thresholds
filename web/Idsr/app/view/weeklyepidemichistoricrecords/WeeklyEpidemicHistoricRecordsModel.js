/**
 * Created by PAVILION 15 on 10/8/2018.
 */
Ext.define('Idsr.view.weeklyepidemichistoricrecords.WeeklyEpidemicHistoricRecordsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.weeklyepidemichistoricrecords',
    formulas: {

    },
    stores: {
        historicRecords: {
            fields:['id','disease_code','sub_county_code','week','year','cases_less_than_5',
                'cases_greater_than_5','deaths_less_than_5','deaths_greater_than_5','date_reported','week_ending_date',
                'import_batch_id','sub_county','county','disease_name'],
            autoLoad: true,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/moh505historic"
            }
        }

    },

    data: {
        defaultSelected:true,
        customSelected:false,
        templateConfigDefaults:{
            disease:1,
            subcounty:2,
            week:5,
            weekending:6,
            cases_less_5:7,
            cases_greater_5:8,
            deaths_less_5:10,
            deaths_greater_5:11,
            year:13,
            date_reported:16,
            title_column:true,
            sheetnumber:1
        },
        templateConfig:{
            disease:1,
            subcounty:2,
            week:5,
            weekEnding:6,
            casesLessThan5:7,
            casesGreaterThan5:8,
            deathsLessThan5:10,
            deathsGreaterThan5:11,
            year:13,
            dateReported:16,
            sheetNumber:1,
            titleColumn:true

        }
    }
});