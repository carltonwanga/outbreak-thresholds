/**
 * Created by PAVILION 15 on 2/20/2019.
 */
Ext.define('Idsr.view.surveyconfiguration.SurveyConfiguration', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Idsr.view.surveyconfiguration.SurveyConfigurationModel',
		'Idsr.view.surveyconfiguration.SurveyConfigurationController'
    ],

    xtype: 'surveyconfiguration',


    viewModel: {
        type: 'surveyconfiguration'
    },

    controller: 'surveyconfiguration',

    height: 500,
    shrinkWrap: 0,
    width: 696,
    layout: 'border',
    collapsed: false,
    title: 'Survey Configuration',
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
                store: '{surveys}'
            },
            columns: [
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'id',
                    text: 'ID'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'disease_name',
                    text: 'Disease'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'title',
                    text: 'Title'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'is_active',
                    text: 'Active'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'configuration_complete',
                    text: 'Complete'
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
                    store: '{surveys}'
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
                            html: '<h1>Please select a survey</h1>'
                        }
                    ]
                },
                {
                    xtype:'panel',
                    scrollable: true,
                    reference: 'details',
                    items:[
                        {
                            xtype: 'fieldset',
                            title: 'Survey Details',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Disease',
                                    bind: {
                                        value: '{record.disease_name}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Survey',
                                    bind: {
                                        value: '{record.title}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Notes',
                                    bind: {
                                        value: '{record.notes}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Active',
                                    bind: {
                                        value: '{record.is_active}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Complete',
                                    bind: {
                                        value: '{record.configuration_complete}'
                                    }
                                }
                            ]
                        }

                    ]

                },
                {
                    xtype: 'form',
                    reference: 'form',
                    bodyPadding: 10,
                    title: 'Edit Survey',
                    jsonSubmit: true,
                    items: [
                        {
                            xtype: "combobox",
                            width: 450,
                            fieldLabel: 'Disease',
                            store: 'diseasestore',
                            name:'disease',
                            pickerId:'scDiseaseCombo',
                            valueField: 'id',
                            reference:'countyCombo',
                            displayField: 'disease_name',
                            listConfig: {
                                loadingText: 'Searching...',
                                emptyText: 'No Diseases found'
                            },
                            flex:1,
                            pageSize: 20

                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Title',
                            width: 450,
                            name: 'title',
                            allowBlank: false
                        },
                        {
                            xtype: 'textarea',
                            fieldLabel: 'Notes',
                            width: 450,
                            name: 'notes',
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

                },
                {
                    xtype: 'treepanel',
                    title:'Survey Questions',
                    store: 'SurveyQuestionsStore',
                    reference:'questionsConfigPanel',
                    reserveScrollbar: true,
                    useArrows: true,
                    rootVisible: false,
                    multiSelect: false,
                    singleExpand: true,
                    columns: [
                        {
                            xtype: 'treecolumn', //this is so we know which column will show the tree
                            text: 'Narrative',
                            dataIndex: 'question_narrative',
                            flex: 1,
                            sortable: false
                        },
                        {
                            text: 'Response Type',
                            dataIndex: 'expected_response_name'
                        },
                        {
                            text: 'Condition',
                            dataIndex: 'condition_narration'
                        },
                        {
                            text: 'Value',
                            dataIndex: 'condition_value'
                        },
                        {
                            text: 'Active',
                            dataIndex: 'is_active',
                            hidden:true
                        }

                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Add Question',
                                    ui: 'soft-blue',
                                    iconCls: 'x-fa fa-plus',
                                    listeners: {
                                        click: 'addQuestion'
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Edit Question',
                                    ui: 'soft-cyan',
                                    iconCls: 'x-fa fa-pencil',
                                    listeners: {
                                        click: 'editQuestion'
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
                    reference:'editSurveyBtn',
                    bind: {
                        hidden: '{!record}'
                    },
                    listeners: {
                        click: 'edit'
                    }
                },
                {
                    xtype: 'button',
                    text: 'Configure Questions',
                    ui: 'soft-green',
                    iconCls: 'x-fa fa-cogs',
                    reference:'configureQuestionsBtn',
                    bind: {
                        hidden: '{!record}'
                    },
                    listeners: {
                        click: 'configureQuestions'
                    }
                },
                {

                    xtype: 'button',
                    iconCls: 'x-fa fa-power-off',
                    reference:'changeSurveyStatusBtn',
                    bind: {
                        hidden: '{!record}',
                        text: '{statusAction}'
                    },
                    listeners: {
                        click: 'onChangeSurveyStatus'
                    }
                }
            ]
        }
    ]
});