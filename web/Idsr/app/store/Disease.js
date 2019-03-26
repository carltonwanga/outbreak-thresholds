/**
 * Created by PAVILION 15 on 2/20/2019.
 */
Ext.define('Idsr.store.Disease', {
    extend: 'Ext.data.Store',
    requires: [
        'Ext.data.proxy.Rest',
        'Idsr.util.Constants'
    ],
    storeId: 'diseasestore',

    fields:['id','disease_name','dhis2_code'],
    autoLoad: true,
    proxy:{
        type: 'rest',
        pageSize: 10,
        url: Idsr.util.Constants.controllersApiFromIndex+'/diseases',
        reader: {
            type: 'json',
            rootProperty: 'data'

        }
    }


});