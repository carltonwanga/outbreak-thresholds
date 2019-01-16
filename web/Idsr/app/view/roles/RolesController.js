Ext.define('Idsr.view.roles.RolesController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.roles',

    requires: [
        'Idsr.util.Constants'
    ],

    showView: function(view) {
        var layout = this.getReferences().display.getLayout();
        layout.setActiveItem(this.lookupReference(view));
    },

    select: function(rowmodel, record, index, eOpts) {
        var theController = this;
        // Set selected record
        this.getViewModel().set('record', record);
        // Show details
        this.showView('details');
        var task = new Ext.util.DelayedTask(function(){
            theController.getStore('permissionsin').load();
            theController.getStore('permissionsnotin').load();
        });
        task.delay(200);


    },

    save: function(button, e, eOpts) {
        var me = this;
        var form = this.getReferences().form.getForm(),
            record = form.getRecord(),
            store = this.getStore('roles');

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
                        requestUrl = Idsr.util.Constants.controllersApiFromIndex+"/roles/";
                        form.submit({
                            url:requestUrl,
                            waitMsg:'Saving...',
                            method:requestMethod,
                            success: function (form, action) {
                                Ext.Msg.alert('Success', action.result.message);
                                store.reload();
                                me.createDialog(record);
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                            }
                        });
                    }else{
                        requestMethod = 'PUT';
                        requestUrl = Idsr.util.Constants.apiFromIndex+"/roles/"+record.get("id");
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

            // Display record
            this.select(this, record);

        }
    },

    cancelEdit: function(button, e, eOpts) {
        // Show details
        this.showView('details');
    },

    add: function(button, e, eOpts) {
        var formPanel = this.getReferences().form,
            form = formPanel.getForm(),
            newRecord = Ext.create('model.role');

        // Clear form
        form.reset();

        // Set record
        form.loadRecord(newRecord);

        // Set title
        formPanel.setTitle('Add Role');

        // Show form
        this.showView('form');
    },

    edit: function(button, e, eOpts) {
        var formPanel = this.getReferences().form,
            form = formPanel.getForm(),
            record = this.getViewModel().get('record');

        // Load record model into form
        form.loadRecord(record);

        // Set title
        formPanel.setTitle('Edit Role');

        // Show form
        this.showView('form');
    },
    onAllocateNavClick:function(){
        this.lookupReference("details").setActiveTab(2);

    },

    onDeallocateNavClick:function(){
        this.lookupReference("details").setActiveTab(1);
    },

    onAllocateBulk: function (button, e, options) {
        this.managePermissions('allocate');
    },

    onDeallocateBulk: function (button, e, options) {
        this.managePermissions('deallocate');
    },

    managePermissions: function (action) {
        var me = this;
        var selectedRole = me.getViewModel().get('record.name');
        var selectedRoleId = me.getViewModel().get('record.id');
        var permissionsGrid;

        Ext.Msg.confirm('Confirm', 'Are you sure you want to '+action+' selected permissions to role '+selectedRole+' ?', function (result) {
            if (result == 'yes') {

                if(action == 'allocate'){
                    permissionsGrid = me.lookupReference("permissionsnotinlist");
                }else if(action == 'deallocate'){
                    permissionsGrid = me.lookupReference("permissioninlist");
                }

                var permissionsSelection = permissionsGrid.getSelection();

                var count = permissionsSelection.length;

                var permissionPayload = [];

                Ext.Array.each( permissionsSelection, function(selection, index, all) {
                    var currentId = selection.data.id;

                    var selectedPermission = {
                        permissionId:currentId
                    }
                    permissionPayload.push(selectedPermission);
                });

                if(count > 0 ){
                    me.getView().mask('Allocating... Please wait...');
                    Ext.Ajax.request({
                        url:Idsr.util.Constants.controllersApiFromIndex+'/roles/'+action+'/'+selectedRoleId,
                        method:"POST",
                        jsonData:permissionPayload,
                        success: function(response, opts) {
                            me.getView().unmask();
                            var responseData = Ext.JSON.decode(response.responseText);
                            var status = responseData.status;
                            if(status == 1){
                                Ext.Msg.alert("Success","Permissions successfully "+action+"d");
                                me.getStore('permissionsin').reload();
                                me.getStore('permissionsnotin').reload();
                            }else{
                                Ext.Msg.alert("Error","Could not "+action+" permissions");
                            }

                        },
                        failure: function(response, opts) {
                            me.getView().unmask();
                            Ext.Msg.alert("Error","Could not submit Request");
                        }
                    });

                }else{
                    Ext.Msg.alert('Error','Please select at least one permission');
                }
            }
        });


    }

});
