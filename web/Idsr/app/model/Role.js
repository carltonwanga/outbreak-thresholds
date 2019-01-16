/**
 * Created by Micah on 23/02/2018.
 */
Ext.define('Idsr.model.Role', {
    extend: 'Ext.data.Model',
    alias: 'model.role',

    requires: [
        'Ext.data.field.Integer'
    ],

    fields: [
        {
            type: 'int',
            name: 'id'
        },
        {
            name: 'name'
        }
    ]
});