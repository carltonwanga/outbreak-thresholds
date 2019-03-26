/**
 * Created by PAVILION 15 on 2/20/2019.
 */
Ext.define('Idsr.view.surveyconfiguration.SurveyConfigurationModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.surveyconfiguration',

    formulas: {
        statusAction: function (get) {
            var activeStatus = get('record').data.is_active;
            if(activeStatus){
                return "Deactivate";
            }else{
                return "Activate"
            }
        }
    },

    stores: {
        surveys:{
            fields:['id','disease','title','notes','is_active','configuration_complete','disease_name'],
            autoLoad: true,
            proxy: {
                type: 'rest',
                autoLoad: true,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/surveyconfig"
            }

        },
        responseTypes:{


        }


    },

    data: {

    }
});