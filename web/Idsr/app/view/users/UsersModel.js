Ext.define('Idsr.view.users.UsersModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.users',

    requires: [
        'Ext.data.proxy.Rest',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Idsr.model.User',
        'Idsr.util.Constants'
    ],

    formulas: {
        userType:function(get){
            var isAdmin = get("record.isAdmin");
            if(isAdmin){
                return 'Admin';
            }else{
                return 'User';
            }
        },
        statusAction: function (get) {
            var activeStatus = get('record').data.isActive;
            if(activeStatus){
                return "Deactivate";
            }else{
                return "Activate"
            }
        },
        userTypeAction:function (get) {
            var isAdmin = get("record.isAdmin");
            if(isAdmin){
                return 'Demote from Admin'
            }else{
                return 'Promote to Admin'
            }
        },
        userTypeActionIconCls: function (get) {
            var isAdmin = get("record.isAdmin");
            if(isAdmin){
                return 'x-fa fa-arrow-circle-o-down'
            }else{
                return 'x-fa fa-arrow-circle-o-up'
            }
        }
    },

    stores: {
        users: {
            model: 'Idsr.model.User',
            autoLoad: true,
            proxy: {
                type: 'rest',
                reader:{
                    type: 'json',
                    rootProperty: 'data'
                },
                writer:{
                    type: 'json',
                    writeAllFields: true
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/users"
            }
        },
        roles: {
            fields:['id','name'],
            autoLoad: true,
            proxy: {
                type: 'rest',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                url: Idsr.util.Constants.controllersApiFromIndex+"/roles"
            }
        },
        idtype: {
            type: 'identificationType'
        }
    }

});