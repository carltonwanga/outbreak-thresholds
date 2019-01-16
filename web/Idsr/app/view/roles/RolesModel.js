Ext.define('Idsr.view.roles.RolesModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.roles',

    requires: [
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Idsr.model.Role',
        'Idsr.util.Constants'
    ],

    stores: {
        roles: {
            model: 'Idsr.model.Role',
            autoLoad: true,
            autoSync: true,
            proxy: {
                type: 'rest',
                autoLoad: true,
                autoSync: true,
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/roles"
            }
        },
        permissionsin: {
            fields:['id','name'],
            autoLoad: false,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/roles/permissions/in/{record.id}"

            }
        },
        permissionsnotin: {
            fields:['id','name'],
            autoLoad: false,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/roles/permissions/notin/{record.id}"

            }
        }
    }

});