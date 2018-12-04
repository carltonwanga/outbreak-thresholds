/**
 * Created by PAVILION 15 on 10/22/2018.
 */
Ext.define('Idsr.store.ThresholdInferences', {
    extend: 'Ext.data.Store',
    requires: [
        'Ext.data.proxy.Rest',
        'Idsr.util.Constants'
    ],
    storeId: 'thresholdinferencestore',

    fields:['id','name','narration','alert_color_codes'],
    proxy:{
        type: 'rest',
        pageSize: 10,
        url: Idsr.util.Constants.controllersApiFromIndex+'/thresholdinferences',
        reader: {
            type: 'json',
            rootProperty: 'data'

        }
    }

});