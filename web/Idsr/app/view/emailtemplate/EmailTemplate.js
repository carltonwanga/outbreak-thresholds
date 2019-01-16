/**
 * Created by Micah on 04/07/2018.
 */
Ext.define('Idsr.view.emailtemplate.EmailTemplate', {
    extend: 'Ext.form.Panel',
    alias: 'widget.notificationtemplates',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.field.ComboBox',
        'Ext.form.field.HtmlEditor',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox',
        'Ext.layout.container.boxOverflow.Menu',
        'Ext.toolbar.Fill',
        'Ext.toolbar.Paging',
        'Idsr.view.emailtemplate.EmailTemplateController',
        'Idsr.view.emailtemplate.EmailTemplateModel'
    ],

    viewModel: {
        type: 'emailtemplate'
    },

    controller: 'emailtemplate',

    shrinkWrap: 0,
    height: 500,
    layout: 'border',
    scrollable: true,
    title: 'Email Template',
    cls: 'shadow',
    bodyPadding: 10,
    margin:'10 5 10 5',

    items: [
        {
            xtype: 'gridpanel',
            flex: 1,
            split: true,
            region: 'center',
            forceFit: true,
            resizable: false,
            bind: {
                store: '{emailtype}'
            },
            columns: [
                {
                    xtype: 'gridcolumn',
                    text: 'Email Type',
                    dataIndex: 'type'
                },
                {
                    xtype: 'gridcolumn',
                    text: 'Email Subject',
                    dataIndex: 'subject'
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar',{
                dockedItems: [{
                    xtype: 'toolbar'
                }],
                bind: {
                    store: '{emailtype}'
                },
                displayInfo: true,
                displayText: 'Displaying {0} - {1} of {2}',
                emptyText: 'No records to display'
            }),
            listeners: {
                select: 'select'
            }
        },
        {
            xtype: 'panel',
            region: 'east',
            flex: 1,
            width: 150,
            split: true,
            bodyBorder: true,
            layout: 'card',
            reference: 'templateDisplay',
            items: [
                {
                    xtype: 'panel',
                    reference: 'selectMessageTemplate',
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
                    reference: 'emailTemplateDetails',
                    title: 'Details',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'panel',
                            title: 'Template',
                            bodyPadding: 10,
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: 'Email Template Details',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Type',
                                            bind: {
                                                value: '{record.type}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Subject',
                                            bind: {
                                                value: '{record.subject}'
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            fieldLabel: 'Message',
                                            bind: {
                                                value: '{record.message}'
                                            }
                                        }
                                    ]

                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    bodyPadding: 10,
                    reference: 'templateEditor',
                    title: 'Edit Template',
                    scrollable: true,
                    layout: {
                        type: 'vbox'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            width: 500,
                            reference: 'emailTemplateId',
                            fieldLabel: 'Id',
                            bind: {
                                value: '{record.id}'
                            },
                            hidden: true
                        },
                        {
                            xtype: 'textfield',
                            width: 500,
                            reference: 'emailTemplateType',
                            fieldLabel: 'Email Type',
                            bind: {
                                value: '{record.type}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            width: 500,
                            fieldLabel: 'Subject',
                            reference: 'emailTemplateSubject',
                            bind:{
                                value: '{record.subject}'
                            }
                        },
                        {
                            xtype: 'htmleditor',
                            reference: 'emailTemplateEditor',

                            // Make tips align neatly below buttons.
                            buttonDefaults: {
                                tooltip: {
                                    align: 't-b',
                                    anchor: true
                                }
                            },
                            width: 500,
                            height: 400,
                            minHeight: 100,
                            labelAlign: 'top',
                            fieldLabel: 'Message',
                            bind: {
                                value: '{record.message}'
                            }
                        },
                        {
                            xtype: 'container',
                            width: 500,
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
                                    text: 'Save',
                                    listeners: {
                                        click: 'onSave'
                                    }
                                },
                                {
                                    xtype: 'button',
                                    flex: 1,
                                    ui: 'soft-red',
                                    iconCls: 'x-fa fa-times',
                                    margin: 5,
                                    text: 'Cancel',
                                    listeners: {
                                        click: 'onCancel'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    dockedItems:[
        {
            xtype: 'toolbar',
            dock: 'top',
            items:[
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
                }
            ]
        }
    ]
});