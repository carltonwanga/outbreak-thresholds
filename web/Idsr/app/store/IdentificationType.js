/**
 * Created by Micah on 19/02/2018.
 */
Ext.define('Idsr.store.IdentificationType', {
    extend: 'Ext.data.Store',

    alias: 'store.identificationType',

    fields: [
        {name: 'name', type: 'string'}
    ],

    data : [
        {name: 'National ID'},
        {name: 'Passport'}
    ]
});