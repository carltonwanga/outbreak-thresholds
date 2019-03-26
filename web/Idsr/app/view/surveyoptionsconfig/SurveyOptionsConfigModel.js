/**
 * Created by PAVILION 15 on 2/21/2019.
 */
Ext.define('Idsr.view.surveyoptionsconfig.SurveyOptionsConfigModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.surveyoptionsconfig',

    stores: {
        options:{
            fields:['id','options_name','is_active'],
            autoLoad: true,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/surveyoptions"
            }

        },
        optionItems:{
            fields:['id','option_id','item_number','option_name'],
            autoLoad: true,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/surveyoptions/{record.id}"
            }
        }

    },

    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    }
});