/**
 * Created by PAVILION 15 on 10/22/2018.
 */

Ext.define('Idsr.view.malariacalculatethreshold.MalariaCalculateThreshold', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Idsr.view.malariacalculatethreshold.MalariaCalculateThresholdModel',
		'Idsr.view.malariacalculatethreshold.MalariaCalculateThresholdController'
    ],

    xtype: 'malariacalculatethreshold',

    viewModel: {
        type: 'malariacalculatethreshold'
    },
    controller: 'malariacalculatethreshold',
    height: 500,
    shrinkWrap: 0,
    layout: 'border',
    title: 'Threshold Computation Batch Operations',
    bodyPadding: 10,
    margin:'10 5 10 5',

    items: [
        {
            xtype: 'gridpanel',
            flex: 1,
            region: 'center',
            split: true,
            resizable: false,
            forceFit: true,
            bind:{
                store: '{batchResults}'
            },
            title:"Batch Operation Results",
            reference:'batchGrid',
            height:500,
            columns:[
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'id',
                    text: 'Batch ID'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'time_calculated',
                    hidden: true,
                    text: 'Time Calculated'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'disease_name',
                    text: 'Disease'
                },

                {
                    xtype: 'gridcolumn',
                    dataIndex: 'week',
                    text: 'Week'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'year',
                    text: 'Year'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'total_computed',
                    text: 'Total Computed'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'total_errors',
                    text: 'Total Errors'
                }

            ],
            listeners: {
                select: 'selectHistoricRecord'
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                dockedItems: [{
                    xtype: 'toolbar'
                }],
                bind: {
                    store: '{batchResults}'
                },
                displayInfo: true,
                displayText: 'Displaying record {0} - {1} of {2}',
                emptyText: 'No records to display'
            }),
            tbar:{
                xtype: 'toolbar',
                items:[
                    '->',
                    {
                        xtype: 'numberfield',
                        hideTrigger: true,
                        width: 200,
                        reference:'searchfield',
                        name: 'query',
                        emptyText: 'Search By Batch Id',
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
        },
        {
            xtype: 'panel',
            forceFit: true,
            flex: 1,
            split: true,
            resizable: false,
            region: 'east',
            width: 150,
            reference:'sideDisplay',
            layout: 'card',
            bodyBorder: true,
            items:[
                {
                    xtype: 'gridpanel',
                    title: 'Batch Errors',
                    reference:'errorsGrid',
                    height:500,
                    bind:{
                        store: '{batchErrors}'
                    },
                    columns:[
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'id',
                            text: 'ID',
                            hidden:true
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'sub_county_name',
                            text: 'Sub County'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'error_code',
                            text: 'Error Code'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'narration',
                            flex:1,
                            text: 'Narration'
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        dockedItems: [{
                            xtype: 'toolbar'
                        }],
                        bind: {
                            store: '{batchErrors}'
                        },
                        displayInfo: true,
                        displayText: 'Displaying record {0} - {1} of {2}',
                        emptyText: 'No records to display'
                    })
                },
                {
                    xtype: "panel",
                    title:'Compute Thresholds',
                    reference:'calculateThresholdsPanel',
                    items:[
                        {
                            xtype:'form',
                            reference:'calculateThresholdsForm',
                            jsonSubmit: true,
                            bodyPadding: 4,
                            items:[
                                {
                                    xtype:'fieldset',
                                    title:'Calculation Parameters',
                                    items:[
                                        {
                                            xtype:"combobox",
                                            fieldLabel:"Disease",
                                            anchor: '80%',
                                            store:'diseasestore',
                                            name:'disease',
                                            reference:'diseaseFilterCombo',
                                            pickerId:'tCDiseaseCombo',
                                            valueField:'id',
                                            displayField:'disease_name',
                                            listConfig: {
                                                loadingText: 'Searching...',
                                                emptyText: 'No Diseases found'
                                            },
                                            pageSize: 10


                                        },
                                        {
                                            xtype: "combobox",
                                            fieldLabel: 'Week',
                                            reference:"weeksFilterCombo",
                                            displayField: "name",
                                            name:'week',
                                            allowBlank: false,
                                            valueField: "week",
                                            anchor: '80%'

                                        },
                                        {
                                            xtype: "combobox",
                                            fieldLabel: 'Year',
                                            displayField: "name",
                                            name:'year',
                                            allowBlank: false,
                                            valueField: "year",
                                            reference: "yearFilterCombo",
                                            anchor:'80%'

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
                                            ui: 'soft-blue',
                                            iconCls: 'x-fa fa-save',
                                            margin: 5,
                                            text: 'Calculate',
                                            listeners: {
                                                click: 'onRequestThresholdCalculation'
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
                                                click: 'onCancelThresholdCalculation'
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
    tbar:{
        xtype: 'toolbar',
        items:[
            {
                xtype: 'button',
                text: 'Calculate Threshold',
                ui: 'soft-cyan',
                iconCls: 'x-fa fa-upload',
                listeners: {
                    click: 'onCalculateThresholdClick'
                }
            }
        ]
    }
});