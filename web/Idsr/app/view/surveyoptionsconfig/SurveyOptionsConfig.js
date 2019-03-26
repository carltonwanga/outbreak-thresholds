/**
 * Created by PAVILION 15 on 2/21/2019.
 */
Ext.define('Idsr.view.surveyoptionsconfig.SurveyOptionsConfig', {
    extend: 'Ext.panel.Panel',
    xtype: 'surveyoptionsconfig',

    requires: [
        'Idsr.view.surveyoptionsconfig.SurveyOptionsConfigModel',
		'Idsr.view.surveyoptionsconfig.SurveyOptionsConfigController'
    ],
    viewModel: {
        type: 'surveyoptionsconfig'
    },

    controller: 'surveyoptionsconfig',
    height: 500,
    shrinkWrap: 0,
    width: 696,
    layout: 'border',
    collapsed: false,
    title: 'Survey Options List',
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
                store: '{options}'
            },
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'id',
                    text: 'ID'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'options_name',
                    text: 'Name'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'is_active',
                    text: 'Active'
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
                    store: '{options}'
                },
                displayInfo: true,
                displayMsg: 'Displaying record {0} - {1} of {2}',
                emptyMsg: 'No records to display'
            }),
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Add Options List',
                            ui: 'soft-blue',
                            iconCls: 'x-fa fa-plus',
                            listeners: {
                                click: 'add'
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'Edit Options List',
                            ui: 'soft-cyan',
                            iconCls: 'x-fa fa-pencil',
                            reference:'editSurveyBtn',
                            listeners: {
                                click: 'edit'
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-power-off',
                            reference:'changeSurveyStatusBtn',
                            text: 'Deactivate'
                        }
                    ]
                }
            ]

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
            items:[
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
                            html: '<h1>Please select a survey</h1>'
                        }
                    ]
                },
                {
                    xtype: 'gridpanel',
                    title: 'Survey Options',
                    reference:'surveyGrid',
                    bind: {
                        store: '{optionItems}'
                    },

                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'id',
                            hidden:true,
                            text: 'ID'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'item_number',
                            text:'Number'

                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'option_name',
                            text:'Name',
                            flex: 1
                        }
                    ],

                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Add Item',
                                    ui: 'soft-blue',
                                    iconCls: 'x-fa fa-plus',
                                    listeners: {
                                        click: 'addItem'
                                    }
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'x-fa fa-times',
                                    reference:'removeItem',
                                    text: 'Remove Item'
                                }
                            ]
                        }
                    ]

                }

            ]

        }

    ]
});