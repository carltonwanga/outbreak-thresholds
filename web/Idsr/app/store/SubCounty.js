/**
 * Created by PAVILION 15 on 10/17/2018.
 */
Ext.define('Idsr.store.SubCounty', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.Rest',
        'Idsr.util.Constants'
    ],
    storeId: 'subcountystore',

    fields:['id','name','dhis2_code','county_code'],
    autoLoad: false,
    proxy:{
        type: 'rest',
        pageSize: 10,
        url: Idsr.util.Constants.controllersApiFromIndex+'/subcounties',
        reader: {
            type: 'json',
            rootProperty: 'data'

        }
    }
});