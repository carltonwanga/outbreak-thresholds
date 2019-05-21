/**
 * Created by PAVILION 15 on 5/13/2019.
 */
Ext.define('Idsr.view.subcountyconfig.SubCountyConfigModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.subcountyconfig',

    stores: {
        subcounties:{
            fields: ['id','name','dhis2_code','county_code','map_code','geo_latitude','geo_longitude','geo_code_name','population_estimate','focal_person','focal_person_tel'],
            autoLoad: true,
            pageSize:25,
            autoSync: true,
            proxy: {
                type: 'rest',
                url: Idsr.util.Constants.controllersApiFromIndex+'/subcounties',
                actionMethods: { create: 'POST', read: 'GET', update: 'POST', destroy: 'DELETE' },
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                writer: {
                    writeAllFields: true
                }
            }

        }
    },

    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    }
});