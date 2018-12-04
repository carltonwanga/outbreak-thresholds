/**
 * Created by PAVILION 15 on 10/16/2018.
 */
Ext.define('Idsr.view.weeklyepidemicdataimportresults.WeeklyEpidemicDataImportResultsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.weeklyepidemicdataimportresults',

    stores: {
        batchResults: {
            fields:['id','total_inserted','total_updated','total_errors'],
            autoLoad: true,
            listeners: {
              load: 'onBatchStoreLoad'
            },
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/moh505historic/batchoperations"
            }
        },
        batchErrors: {
            fields:['id','row_number','column_number','error_code','narration','batch_id'],
            autoLoad: false,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/moh505historic/batcherrors/{record.id}"
            }
        }

    },

    data: {


    }
});