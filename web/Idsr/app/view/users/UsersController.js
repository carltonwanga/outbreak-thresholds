Ext.define('Idsr.view.users.UsersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.users',

    requires: [
        'Idsr.util.Constants'
    ],

    init: function () {

    },

    showView: function(view) {
        var layout = this.getReferences().display.getLayout();
        layout.setActiveItem(this.lookupReference(view));
    },

    select: function(rowmodel, record, index, eOpts) {
        // Set selected record
        this.getViewModel().set('record', record);

        // Show details
        this.showView('details');
    },

    save: function(button, e, eOpts) {
        var form = this.getReferences().form.getForm(),
            record = form.getRecord(),
            store = this.getStore('users');

       

        // Valid
        if (form.isValid()) {

            // Ask user to confirm this action
            Ext.Msg.confirm('Confirm Saving', 'Are you sure you want to save?', function(result) {

                // User confirmed yes
                if (result == 'yes') {

                    // Update associated record with values
                    form.updateRecord();
                    var requestMethod = '';
                    var requestUrl = '';

                    // Add to store if new record
                    if (record.phantom) {
                        requestMethod = 'POST';
                        requestUrl = Idsr.util.Constants.controllersApiFromIndex+"/users/";
                        form.submit({
                            url:requestUrl,
                            waitMsg:'Saving...',
                            method:requestMethod,
                            success: function (form, action) {
                                Ext.Msg.alert('Success', action.result.message);
                                store.reload();
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                            }

                        });


                    }else{
                        requestMethod = 'PUT';
                        requestUrl = Idsr.util.Constants.controllersApiFromIndex+"/users/"+record.get("id");
                        form.submit({
                            url:requestUrl,
                            waitMsg:'Saving...',
                            method:requestMethod,
                            success: function (form, action) {
                                Ext.Msg.alert('Success', action.result.message);
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                            }
                        });

                    }
                }
            });
        }
    },

    cancelEdit: function(button, e, eOpts) {
        // Show details
        this.showView('details');
    },

    add: function(button, e, eOpts) {
        var me = this;
        me.getReferences().txtUserEmail.setHidden(false);

        var formPanel = this.getReferences().form,
            form = formPanel.getForm(),
            newRecord = Ext.create('model.user');

        // Clear form
        form.reset();

        // Set record
        form.loadRecord(newRecord);

        // Set title
        formPanel.setTitle('Add User');

        // Show form
        this.showView('form');
    },

    edit: function(button, e, eOpts) {
        var me = this;
        me.getReferences().txtUserEmail.setHidden(true);

        var formPanel = this.getReferences().form,
            form = formPanel.getForm(),
            record = this.getViewModel().get('record');

        // Load record model into form
        form.loadRecord(record);

        // Set title
        formPanel.setTitle('Edit User');

        // Show form
        this.showView('form');
    },

    onApplyFilter : function(btn, ev) {
        var filters = {};

        // Reset paging parameters to first page
        filters["start"] = 0;
        filters["limit"] = 25;
        filters["query"] = this.lookupReference('searchfield').getValue();
        filters["admin"] = this.lookupReference('adminfiltercheckbox').getValue();

        this.getStore('users').load({
            params: filters
        });
    },

    onResetFilter : function(btn, ev) {
        this.lookupReference('searchfield').reset();
        this.lookupReference('adminfiltercheckbox').setValue('0');
        this.getStore('users').load();
    },

    onResendActivationLink:function(){
        var me = this;
        var userStatus = this.getViewModel().get('record').get('isActive');
        var currentUserId = me.getViewModel().get('record').get("id");
        var userRecord  = me.getViewModel().get('record');
        var userFullName = userRecord.get("firstName")+' '+userRecord.get("middleName")+' '+userRecord.get("lastName");

        if(userStatus){
            Ext.Msg.alert("Error","User account active");
        }else{
            Ext.Msg.confirm('Confirm', 'Are you sure you want to resend account activation link to'+" "+userFullName+"?", function(result) {
                if (result == 'yes') {
                    me.getView().mask('Loading... Please wait...');
                    Ext.Ajax.request({
                        url: Idsr.util.Constants.controllersApiFromIndex+"/users/resendactivationlink",
                        params:{
                            userId:currentUserId
                        },
                        method:"POST",
                        success: function(response, opts) {
                            me.getView().unmask();
                            var responseData = Ext.JSON.decode(response.responseText);
                            var status = responseData.status;
                            if(status == 1){
                                Ext.Msg.alert("Success","Account activation link sent");

                            }else{
                                Ext.Msg.alert("Error","Could not resend account activation link");
                            }

                        },

                        failure: function(response, opts) {
                            me.getView().unmask();
                            Ext.Msg.alert("Error","Could not resend account activation link");
                        }
                    });

                }

            });

        }

    },

    onChangeUserStatus:function(){
        var me = this;
        var currentStatusAction = this.getViewModel().get('record').get('isActive')?"Deactivate":"Activate";
        var newStatus = this.getViewModel().get('record').get('isActive')?false:true;
        var currentUserId = me.getViewModel().get('record').get("id");
        var userRecord  = me.getViewModel().get('record');
        var userFullName = userRecord.get("firstName")+' '+userRecord.get("middleName")+' '+userRecord.get("lastName");
        Ext.Msg.confirm('Confirm', 'Are you sure you want to '+currentStatusAction+" "+userFullName+"?", function(result) {
            if (result == 'yes') {
                me.getView().mask('Loading... Please wait...');
                Ext.Ajax.request({
                    url: Idsr.util.Constants.controllersApiFromIndex+"/users/changestatus",
                    params:{
                        userId:currentUserId,
                        status:newStatus
                    },
                    method:"POST",
                    success: function(response, opts) {
                        me.getView().unmask();
                        var responseData = Ext.JSON.decode(response.responseText);
                        var status = responseData.status;
                        if(status == 1){
                            Ext.Msg.alert("Success","The user has successfully been "+currentStatusAction+"d");
                            userRecord.set('isActive',newStatus);
                            var newUserRecord = Ext.create('Idsr.model.User',userRecord.data);
                            me.getViewModel().set('record', newUserRecord);

                        }else{
                            Ext.Msg.alert("Error","Could not "+currentStatusAction+" user");
                        }

                    },

                    failure: function(response, opts) {
                        me.getView().unmask();
                        Ext.Msg.alert("Error","Could not change user status");
                    }
                });

            }

        });

    },
    onCountySelect:function(combo){
        var selectedCounty = combo.getValue();
        var subountyCombo = this.lookupReference("subCountyCombo");

        subountyCombo.reset();
        subountyCombo.getStore().removeAll();

        var filters = {};

        // Reset paging parameters to first page
        filters["start"] = 0;
        filters["limit"] = 25;
        filters["county"] = selectedCounty;

        subountyCombo.getStore().load({
            params: filters
        });


    },
    onCountyFilterReset:function(){
        this.lookupReference("countyCombo").reset();
        var filters = {};

        // Reset paging parameters to first page
        filters["start"] = 0;
        filters["limit"] = 25;
        this.lookupReference("subCountyCombo").reset();

        this.lookupReference("subCountyCombo").getStore('historicRecords').load({
            params: filters
        });
    },
    onSubCountyFilterReset:function(){
        this.lookupReference("subCountyCombo").reset();
    },


    onManageRole:function(){
        var me = this;
        var rolePanel = me.lookupReference('roleAllocationPanel');
        me.showView('roleAllocationPanel');
        me.getView().mask('Please wait...');
        var userRecord = me.getViewModel();
        var currentUserId = userRecord.get('record').get("id");
        var roleId  = userRecord.get('record').get("id");
        me.getView().mask('Loading... Please wait...');
        Ext.Ajax.request({
            url: Idsr.util.Constants.controllersApiFromIndex + "/users/role",
            params: {
                userId: currentUserId
            },
            method: "GET",
            success: function (response, opts) {
                me.getView().unmask();
                var responseData = Ext.JSON.decode(response.responseText);
                var status = responseData.status;
                if (status == 1) {
                    var roleDetails = responseData.data;
                    if (roleDetails != null) {
                        var layout = rolePanel.getLayout();
                        layout.setActiveItem(me.lookupReference('roleDeallocationFieldset'));
                        me.getViewModel().set('allocatedUserRole', roleDetails);
                    } else {
                        var layout = rolePanel.getLayout();
                        layout.setActiveItem(me.lookupReference('roleAllocationFieldset'));
                    }

                } else {
                    Ext.Msg.alert("Error", "Could not fetch user role status");
                    me.backToDetails();
                }

            },

            failure: function (response, opts) {
                me.getView().unmask();
                Ext.Msg.alert("Error", "Could not change user status");
            }
        });

    },

    onAssignRoleSubmit:function(){
        var me = this;
        var userRecord = me.getViewModel().get('record');
        var currentUserId = userRecord.get("id");
        var roleCombo = me.lookupReference('roleCombo');
        var selectedRoleId = roleCombo.getValue();
        var selectedRoleName = roleCombo.getRawValue();

        var userFullName = userRecord.get("firstName")+' '+userRecord.get("middleName")+' '+userRecord.get("lastName");

        Ext.Msg.confirm('Confirm', 'Are you sure you want to assign role: '+selectedRoleName+' to '+userFullName , function(result) {
            if (result == 'yes') {
                Ext.Ajax.request({
                    url: Idsr.util.Constants.controllersApiFromIndex + "/users/assignrole",
                    params: {
                        userId: currentUserId,
                        roleId:selectedRoleId
                    },
                    method: "POST",
                    success: function (response, opts) {
                        me.getView().unmask();
                        var responseData = Ext.JSON.decode(response.responseText);
                        var status = responseData.status;
                        if (status == 1) {

                            Ext.Msg.alert("Success", "User role assigned");
                            roleCombo.clearValue();
                            me.backToDetails();
                        } else {
                            Ext.Msg.alert("Error", "Could not assign role to user");
                        }

                    },

                    failure: function (response, opts) {
                        me.getView().unmask();
                        Ext.Msg.alert("Error", "Could not assign role to user");
                    }
                });
            }
        });


    },

    onDeallocateRole:function(){
        var me = this;
        var viewModel = me.getViewModel();
        var userRecord = viewModel.get('record');
        var currentUserId = userRecord.get("id");
        var userRoleId = viewModel.get('allocatedUserRole').id;
        var userRoleName = viewModel.get('allocatedUserRole').name;

        var userFullName = userRecord.get("firstName")+' '+userRecord.get("middleName")+' '+userRecord.get("lastName");

        Ext.Msg.confirm('Confirm', 'Are you sure you want to deallocate '+userRoleName+' role from '+userFullName, function(result) {
            if (result == 'yes') {
                Ext.Ajax.request({
                    url: Idsr.util.Constants.controllersApiFromIndex + "/users/deallocaterole",
                    params: {
                        userId: currentUserId,
                        roleId: userRoleId
                    },
                    method: "POST",
                    success: function (response, opts) {
                        me.getView().unmask();
                        var responseData = Ext.JSON.decode(response.responseText);
                        var status = responseData.status;
                        if (status == 1) {
                            Ext.Msg.alert("Success", "User role deallocated");
                            me.onManageRole();

                        } else {
                            Ext.Msg.alert("Error", "Could not deallocated user role");
                        }

                    },

                    failure: function (response, opts) {
                        me.getView().unmask();
                        Ext.Msg.alert("Error", "Could not deallocated user role");
                    }
                });
            }
        });


    },

    onResetPassword: function(){
        var me = this;
        var userRecord = me.getViewModel().get('record');
        var userFullName = userRecord.get('firstName')+' '+userRecord.get('middleName')+' '+userRecord.get('lastName');
        var userEmail = userRecord.get('email');

        Ext.Msg.confirm('Confimation', 'Are you sure you want to reset the password of '+userFullName+'?', function (result) {
            if(result == 'yes'){
                me.getView().mask('Loading.....Please Wait......');
                Ext.Ajax.request({
                    url:Idsr.util.Constants.controllersApiFromIndex+'/password/reset',
                    method: 'POST',
                    params:{
                        email: userEmail
                    },
                    success: function(response, eOpts){
                        me.getView().unmask();
                        var responseData = Ext.JSON.decode(response.responseText);
                        var status = responseData.status;
                        var responseMessage = responseData.message;
                        if(status == 1){
                            Ext.Msg.alert('Success', responseMessage ? responseMessage : 'Password reset link sent to '+userEmail);
                        }else{
                            Ext.Msg.alert('Error',responseMessage ? responseMessage : 'Could not process request');
                        }
                    },
                    failure: function (response, eOpts) {
                        me.getView().unmask();
                        var responseData = Ext.JSON.decode(response.responseText);
                        var responseMessage = responseData.message;
                        Ext.Msg.alert('Error', responseMessage ? responseMessage : 'Could not process request');
                    }
                });
            }
        });
    },

    backToDetails:function(){
        this.showView('details');
    }

});
