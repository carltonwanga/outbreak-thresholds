/**
 * Created by Micah on 15/02/2018.
 */
Ext.define('Idsr.model.User', {
    extend: 'Ext.data.Model',
    alias: 'model.user',

    requires: [
        'Ext.data.field.Integer',
        'Ext.data.field.String',
        'Ext.data.field.Boolean'
    ],

    fields: [
        {
            type: 'int',
            name: 'id'
        },
        {
            type: 'string',
            name: 'firstName'
        },
        {
            type: 'string',
            name: 'middleName'
        },
        {
            type: 'string',
            name: 'lastName'
        },
        {
            name: 'fullName',
            calculate: function (data) {
                return data.firstName + ' ' + data.middleName+ ' ' + data.lastName;
            }
        },
        {
            type: 'string',
            name: 'email'
        },
        {
            type: 'string',
            name: 'phoneNumber'
        },
        {
            type: 'string',
            name: 'password'
        },
        {

            name: 'identificationType'
        },
        {
            type: 'string',
            name: 'identificationNumber'
        },
        {
            type: 'boolean',
            name: 'isActive'
        },
        {
            type: 'boolean',
            name: 'isNationalUser'
        },
        {
            type: 'string',
            name: 'subCounty'
        },
        {
            type: 'boolean',
            name: 'sendSubcountySurveys'
        }
    ]
});