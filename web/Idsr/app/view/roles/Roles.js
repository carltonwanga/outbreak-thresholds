Ext.define('Idsr.view.roles.Roles', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.roles',

    requires: [
        'Idsr.view.roles.RolesModel',
        'Idsr.view.roles.RolesController',
        'Ext.grid.Panel',
        'Ext.grid.column.Number',
        'Ext.form.field.Display',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.tab.Panel',
        'Ext.tab.Tab',
        'Ext.toolbar.Toolbar'
    ],

    controller: 'roles',
    viewModel: {
        type: 'roles'
    },
    height: 500,
    shrinkWrap: 0,
    width: 696,
    layout: 'border',
    collapsed: false,
    title: 'Roles & Permissions',
    bodyPadding: 10,
    margin:'10 5 10 5',

    items: [
        {
            xtype: 'gridpanel',
            flex: 1,
            region: 'center',
            split: true,
            reference: 'roleList',
            resizable: false,
            title: '',
            forceFit: true,
            bind: {
                store: '{roles}'
            },
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'id',
                    text: 'ID'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'name',
                    text: 'Name'
                }
            ],
            listeners: {
                select: 'select'
            },
            bbar: Ext.create('Ext.PagingToolbar',{
                dockedItems:[{
                    xtype: 'toolbar'
                }],
                bind: {
                    store: '{roles}'
                },
                displayInfo: true,
                displayMsg: 'Displaying record {0} - {1} of {2}',
                emptyMsg: 'No records to display'
            })
        },
        {
            xtype: 'panel',
            flex: 1,
            region: 'east',
            split: true,
            reference: 'display',
            width: 150,
            layout: 'card',
            bodyBorder: true,
            items: [
                {
                    xtype: 'panel',
                    reference: 'selectMessage',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'container',
                            flex: 1,
                            html: '<h1>Please select a record</h1>'
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    title: 'Details',
                    reference: 'details',
                    bodyPadding: 10,
                    activeTab: 0,
                    items: [
                        {
                            xtype: 'panel',
                            title: 'Role',
                            scrollable: true,
                            items:[
                                {
                                    xtype: 'fieldset',
                                    title: 'Role Details',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Name',
                                            bind: {
                                                value: '{record.name}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            title: 'Deallocate Permissions',
                            scrollable: true,
                            items:[
                                {
                                    xtype: 'gridpanel',
                                    flex: 1,
                                    region: 'center',
                                    split: true,
                                    reference: 'permissioninlist',
                                    resizable: false,
                                    title: 'Assigned Permissions',
                                    forceFit: true,
                                    bind: {
                                        store: '{permissionsin}'
                                    },
                                    height:400,
                                    columnLines: true,
                                    selModel: {
                                        type: 'checkboxmodel',
                                        checkOnly: true,
                                        showHeaderCheckbox: false
                                    },
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'id',
                                            text: 'Permission Id',
                                            hidden: true
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'name',
                                            text: 'Permission Name',
                                            width: 80
                                        }
                                    ],
                                    bbar: Ext.create('Ext.PagingToolbar',{
                                        dockedItems:[{
                                            xtype: 'toolbar'
                                        }],
                                        bind: {
                                            store: '{permissionsin}'
                                        },
                                        displayInfo: true,
                                        displayMsg: 'Displaying records {0} - {1} of {2}',
                                        emptyMsg: 'No records to Display'
                                    }),
                                    dockedItems: [{
                                        xtype: 'toolbar',
                                        items: [{
                                            iconCls: 'fa fa-check-circle',
                                            text: 'Deallocate Selected',
                                            listeners:{
                                                click:'onDeallocateBulk'
                                            }
                                        }
                                        ]
                                    }]
                                }

                            ]
                        },
                        {
                            xtype: 'panel',
                            title: 'Allocate Permissions',
                            scrollable: true,
                            items:[
                                {
                                    xtype: 'gridpanel',
                                    flex: 1,
                                    region: 'center',
                                    split: true,
                                    reference: 'permissionsnotinlist',
                                    resizable: false,
                                    title: 'Unassigned Permissions',
                                    height:400,
                                    forceFit: true,
                                    bind: {
                                        store: '{permissionsnotin}'
                                    },
                                    columnLines: true,
                                    selModel: {
                                        type: 'checkboxmodel',
                                        checkOnly: false,
                                        showHeaderCheckbox: false
                                    },
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'id',
                                            text: 'Permission Id',
                                            hidden: true
                                        },
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'name',
                                            text: 'Permission Name',
                                            width: 80
                                        }
                                    ],
                                    bbar: Ext.create('Ext.PagingToolbar',{
                                        dockedItems:[{
                                            xtype: 'toolbar'
                                        }],
                                        bind: {
                                            store: '{permissionsnotin}'
                                        },
                                        displayInfo: true,
                                        displayMsg: 'Displaying record {0} - {1} of {2}',
                                        emptyMsg: 'No records to display'
                                    }),
                                    dockedItems: [{
                                        xtype: 'toolbar',
                                        items: [{
                                            iconCls: 'fa fa-check-circle',
                                            text: 'Allocate Selected',
                                            listeners:{
                                                click:'onAllocateBulk'
                                            }
                                        }
                                        ]
                                    }]
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'form',
                    reference: 'form',
                    bodyPadding: 10,
                    title: 'Edit Role',
                    jsonSubmit: true,
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Name',
                            width: 400,
                            name: 'name',
                            allowBlank: false
                        },
                        {
                            xtype: 'container',
                            padding: 10,
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    formBind: true,
                                    itemId: 'saveButton',
                                    ui: 'soft-blue',
                                    iconCls: 'x-fa fa-save',
                                    margin: 5,
                                    text: 'Save',
                                    listeners: {
                                        click: 'save'
                                    }
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    itemId: 'cancelButton',
                                    ui: 'soft-red',
                                    iconCls: 'x-fa fa-times',
                                    margin: 5,
                                    text: 'Cancel',
                                    listeners: {
                                        click: 'cancelEdit'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'button',
                    text: 'Add',
                    ui: 'soft-blue',
                    iconCls: 'x-fa fa-plus',
                    listeners: {
                        click: 'add'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Edit',
                    ui: 'soft-cyan',
                    iconCls: 'x-fa fa-pencil',
                    bind: {
                        hidden: '{!record}'
                    },
                    listeners: {
                        click: 'edit'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Manage Permissions',
                    ui: 'soft-red',
                    iconCls: 'x-fa fa-briefcase',
                    bind: {
                        hidden: '{!record}'
                    },
                    menu:{
                        xtype: 'menu',
                        items:[
                            {
                                xtype: 'menuitem',
                                text: 'Allocate',
                                iconCls: 'x-fa fa-plus',
                                listeners: {
                                    click: 'onAllocateNavClick'
                                }
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Deallocate',
                                iconCls: 'x-fa fa-minus',
                                listeners: {
                                    click: 'onDeallocateNavClick'
                                }
                            }
                        ]
                    }
                }
            ]
        }
    ]

});