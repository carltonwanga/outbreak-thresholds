/**
 * Created by PAVILION 15 on 10/22/2018.
 */
Ext.define('Idsr.view.malariacalculatethreshold.MalariaCalculateThresholdModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.malariacalculatethreshold',

    stores: {
        batchResults: {
            fields:['id','time_calculated','week','year','total_computed','total_errors'],
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
                url: Idsr.util.Constants.controllersApiFromIndex+"/malariathresholdres/batchoperations"
            }
        },
        batchErrors: {
            fields:['id','sub_county','sub_county_name','error_code','narration','batch_id'],
            autoLoad: false,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/malariathresholdres/batcherrors/{record.id}"
            }
        }
    },

    data: {


    }
});