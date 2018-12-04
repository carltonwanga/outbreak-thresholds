/**
 * Created by PAVILION 15 on 10/17/2018.
 */
Ext.define('Idsr.store.County', {
    extend: 'Ext.data.Store',
    requires: [
        'Ext.data.proxy.Rest',
        'Idsr.util.Constants'
    ],
    storeId: 'countystore',

    fields:['id','name','dhis2_code'],
    proxy:{
        type: 'rest',
        pageSize: 10,
        url: Idsr.util.Constants.controllersApiFromIndex+'/counties',
        reader: {
            type: 'json',
            rootProperty: 'data'

        }
    }
});