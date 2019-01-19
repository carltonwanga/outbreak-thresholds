Ext.define('Idsr.view.users.Users', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.users',
    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Display',
        'Ext.grid.Panel',
        'Ext.grid.column.Template',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Separator',
        'Idsr.view.users.UsersController',
        'Idsr.view.users.UsersModel'
    ],
    controller: 'users',
    viewModel: {
        type: 'users'
    },
    height: 500,
    shrinkWrap: 0,
    layout: 'border',
    collapsed: false,
    title: 'Users',
    cls: 'shadow',
    bodyPadding: 10,
    margin:'10 5 10 5',
    items: [
        {
            xtype: 'gridpanel',
            flex: 1,
            region: 'center',
            split: true,
            reference: 'list',
            resizable: false,
            title: '',
            forceFit: true,
            bind: {
                store: '{users}'
            },
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'id',
                    hidden: true,
                    text: 'ID'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'firstName',
                    text: 'First Name'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'lastName',
                    text: 'Last Name'
                },
                {
                    xtype: 'templatecolumn',
                    tpl: [
                        '<a href="mailto:{email}">{email}</a>'
                    ],
                    dataIndex: 'email',
                    text: 'Email'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'identificationNumber',
                    text: 'Identification Number'
                }
            ],
            listeners: {
                select: 'select'
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                dockedItems: [{
                    xtype: 'toolbar'
                }],
                bind: {
                    store: '{users}'
                },
                displayInfo: true,
                displayText: 'Displaying record {0} - {1} of {2}',
                emptyText: 'No records to display'
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
                            html: '<h3>Please select a record</h3>'
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    reference: 'details',
                    title: 'Details',
                    bodyPadding: 10,
                    items:[
                        {
                            xtype: 'panel',
                            title: 'User',
                            bodyPadding: 10,
                            scrollable: true,
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: 'User Details',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'First Name',
                                            bind: {
                                                value: '{record.firstName}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Middle Name',
                                            bind: {
                                                value: '{record.middleName}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Last Name',
                                            bind: {
                                                value: '{record.lastName}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Email',
                                            bind: {
                                                value: '{record.email}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Phone Number',
                                            bind: {
                                                value: '{record.phoneNumber}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Identification Type',
                                            bind: {
                                                value: '{record.identificationType}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Identification Number',
                                            bind: {
                                                value: '{record.identificationNumber}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Is Active',
                                            bind: {
                                                value: '{record.isActive}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'National User',
                                            bind: {
                                                value: '{record.isNationalUser}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'County',
                                            bind: {
                                                value: '{record.countyName}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Sub-County',
                                            bind: {
                                                value: '{record.subCountyName}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]

                },
                {
                    xtype: 'form',
                    reference: 'form',
                    bodyPadding: 10,
                    jsonSubmit: true,
                    title: 'Edit User',
                    scrollable: true,
                    items: [
                        {
                            xtype: 'textfield',
                            width: 400,
                            fieldLabel: 'First Name',
                            name: 'firstName',
                            allowBlank: false,
                            maxLength: 30,
                            minLength: 2
                        },
                        {
                            xtype: 'textfield',
                            width: 400,
                            fieldLabel: 'Middle Name',
                            name: 'middleName',
                            maxLength: 30
                        },
                        {
                            xtype: 'textfield',
                            width: 400,
                            fieldLabel: 'Last Name',
                            name: 'lastName',
                            allowBlank: false,
                            maxLength: 30,
                            minLength: 2
                        },
                        {
                            xtype: 'textfield',
                            width: 400,
                            fieldLabel: 'Email',
                            name: 'email',
                            reference: 'txtUserEmail',
                            allowBlank: false,
                            emptyText: 'mail@example.com',
                            maxLength: 50,
                            minLength: 5,
                            regex: /^([0-9a-zA-Z]+[\-._+&amp;])*[0-9a-zA-Z]+@([\-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$/,
                            regexText: 'Please provide a valid email'
                        },
                        {
                            xtype: 'textfield',
                            width: 400,
                            fieldLabel: 'Phone Number',
                            name: 'phoneNumber',
                            allowBlank: false
                        },
                        {
                            xtype: 'combobox',
                            width: 400,
                            fieldLabel: 'Identification Type',
                            name: 'identificationType',
                            bind: {
                                store: '{idtype}'
                            },
                            displayField: 'name',
                            valueField: 'name',
                            editable: false,
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            width: 400,
                            fieldLabel: 'Identification Number',
                            name: 'identificationNumber',
                            allowBlank: false
                        },
                        {
                            xtype: 'checkbox',
                            boxLabel: 'National User',
                            name:'isNationalUser',
                            bind:{
                                value: '{nationalUserCheckSelected}'
                            }

                        },
                        {
                            xtype: 'container',
                            bind:{
                                hidden: '{nationalUserCheckSelected}'
                            },
                            items:[
                                {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    flex:1,
                                    items:[
                                        {
                                            xtype: "combobox",
                                            fieldLabel: 'County',
                                            store: 'countystore',
                                            width: 400,
                                            name:'county',
                                            pickerId:'usrRegCountyCombo',
                                            valueField: 'dhis2_code',
                                            reference:'countyCombo',
                                            displayField: 'name',
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No counties found'
                                            },
                                            listeners:{
                                                select: 'onCountySelect'
                                            },
                                            pageSize: 20

                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-times',
                                            ui:'soft-red',
                                            margin: '0 4 0 0',
                                            tooltip: 'Reset County',
                                            listeners: {
                                                click: 'onCountyFilterReset'
                                            }
                                        }
                                    ]

                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    flex:1,
                                    items:[
                                        {
                                            xtype: "combobox",
                                            width: 400,
                                            fieldLabel: 'Sub-County',
                                            pickerId:'usrRegSubCountyCombo',
                                            valueField: 'dhis2_code',
                                            store: 'subcountystore',
                                            reference:'subCountyCombo',
                                            displayField: 'name',
                                            name:'subcounty',
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No sub-counties found'
                                            },
                                            allowBlank: false,
                                            bind:{
                                               disabled: '{nationalUserCheckSelected}'
                                            },
                                            pageSize: 20

                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-times',
                                            ui:'soft-red',
                                            margin: '0 4 0 0',
                                            tooltip: 'Reset Sub-County',
                                            listeners: {
                                                click: 'onSubCountyFilterReset'
                                            }
                                        }
                                    ]

                                }
                            ]
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
                },
                {
                    xtype: 'panel',
                    title:'Manage Role',
                    layout: 'card',
                    reference:'roleAllocationPanel',
                    items:[
                        {
                            xtype: 'panel',
                            bodyPadding: 5,
                            reference:'roleDeallocationFieldset',
                            items:[
                                {
                                    xtype: 'fieldset',
                                    title:'Deallocate Role',
                                    items:[
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Role Id',
                                            bind: {
                                                value: '{allocatedUserRole.id}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Role Name',
                                            bind: {
                                                value: '{allocatedUserRole.name}'
                                            }

                                        }
                                    ]

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
                                            ui: 'soft-red',
                                            iconCls: 'x-fa fa-trash',
                                            margin: 5,
                                            text: 'Remove',
                                            listeners: {
                                                click: 'onDeallocateRole'
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            flex: 1,
                                            ui: 'soft-green',
                                            iconCls: 'x-fa fa-arrow-left',
                                            margin: 5,
                                            text: 'Back',
                                            listeners: {
                                                click: 'backToDetails'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            bodyPadding: 5,
                            xtype: 'fieldset',
                            title: 'Allocate Role',
                            reference:'roleAllocationFieldset',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: 'Allocate Role',
                                    layout: 'anchor',
                                    items:[
                                        {
                                            xtype: 'combobox',
                                            anchor: '90%',
                                            fieldLabel: 'Role',
                                            reference:'roleCombo',
                                            name:'roleId',
                                            bind: {
                                                store:'{roles}'
                                            },
                                            displayField: 'name',
                                            valueField: 'id',
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No matching Roles found'
                                            },
                                            pageSize: 10
                                        }
                                    ]

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
                                            ui: 'soft-blue',
                                            iconCls: 'x-fa fa-save',
                                            margin: 5,
                                            text: 'Submit',
                                            listeners: {
                                                click: 'onAssignRoleSubmit'
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            flex: 1,
                                            ui: 'soft-green',
                                            iconCls: 'x-fa fa-arrow-left',
                                            margin: 5,
                                            text: 'Back',
                                            listeners: {
                                                click: 'backToDetails'
                                            }
                                        }
                                    ]
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
                    text: 'Account Management',
                    iconCls: 'x-fa fa-briefcase',
                    ui: 'soft-red',
                    menu: {
                        xtype: 'menu',
                        items: [
                            {
                                xtype: 'menuitem',
                                text: 'Reset Password',
                                itemId: 'resetPassword',
                                iconCls: 'x-fa fa-unlock',
                                listeners: {
                                    click: 'onResetPassword'
                                }
                            },
                            {
                                xtype: 'menuitem',
                                bind:{
                                    text: '{statusAction}'
                                },
                                itemId: 'activateUser',
                                iconCls: 'x-fa fa-user',
                                listeners: {
                                    click: 'onChangeUserStatus'
                                }
                            },
                            {
                                xtype: 'menuitem',
                                text: 'Resend activation link',
                                itemId: 'resendActivationLink',
                                iconCls: 'x-fa fa-mail-reply',
                                listeners: {
                                    click: 'onResendActivationLink'
                                }
                            }
                        ]
                    }
                },
                {
                    xtype: 'button',
                    text: 'Manage Role',
                    reference: 'manageRoleBtn',
                    iconCls: 'x-fa fa-key',
                    listeners: {
                        click: 'onManageRole'
                    }
                },

                '->',
                '-',
                {
                    xtype: 'textfield',
                    width: 200,
                    reference:'searchfield',
                    name: 'query',
                    emptyText: 'Search by Name,email or Id',
                    allowBlank: true,
                    selectOnFocus : true

                },
                '-',
                {
                    text: 'Search',
                    tooltip: 'Apply current search filter',
                    scope: this,
                    iconCls: 'fa fa-th-large fa-check-circle',
                    listeners: {
                        click: 'onApplyFilter'
                    }

                },
                '-',
                {
                    text: 'Reset',
                    tooltip: 'Reset to no search filters',
                    iconCls: 'fa fa-th-large fa-times-circle',
                    scope: this,
                    listeners: {
                        click: 'onResetFilter'
                    }
                }
            ]
        }
    ]

});