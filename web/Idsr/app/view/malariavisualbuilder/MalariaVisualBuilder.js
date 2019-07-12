/**
 * Created by PAVILION 15 on 11/23/2018.
 */
Ext.define('Idsr.view.malariavisualbuilder.MalariaVisualBuilder', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.chart.*',
        'Ext.toolbar.Fill',
        'Idsr.view.malariavisualbuilder.MalariaVisualBuilderController',
        'Idsr.view.malariavisualbuilder.MalariaVisualBuilderModel'
    ],
    xtype: 'malariavisualbuilder',

    title:'Malaria Visual Analysis Builder',

    viewModel: {
        type: 'malariavisualbuilder'
    },

    controller: 'malariavisualbuilder',
    items: [
        {
            xtype: 'tabpanel',
            reference: 'visualizationBuilderTabPanel',
            items:[
                {
                    title:'Graph Builder',
                    layout: 'border',
                    height: 600,
                    items:[
                        {
                            xtype:'panel',
                            region: 'north',
                            split: true,
                            margin: '5 5 5 5',
                            bodyPadding: 3,
                            title:'Chart Configurations',
                            collapsible: true,
                            items:[
                                {
                                    xtype:'form',
                                    reference:'resultsFilterForm',
                                    margin: '0 0 5 0',
                                    bodyPadding: 3,
                                    items:[
                                        {
                                            xtype:'fieldcontainer',
                                            height:32,
                                            layout: 'hbox',
                                            items:[
                                                {
                                                    xtype: "combobox",
                                                    fieldLabel: 'County',
                                                    labelWidth: 45,
                                                    store: 'countystore',
                                                    name:'county',
                                                    pickerId:'mvbCountyCombo',
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
                                                    flex:1,
                                                    pageSize: 20

                                                },
                                                {
                                                    xtype: "combobox",
                                                    fieldLabel: 'Sub-County',
                                                    labelWidth: 75,
                                                    pickerId:'mvbSubCountyCombo',
                                                    valueField: 'dhis2_code',
                                                    store: 'subcountystore',
                                                    reference:'subCountyCombo',
                                                    displayField: 'name',
                                                    name:'subcounty',
                                                    listConfig: {
                                                        loadingText: 'Searching...',
                                                        emptyText: 'No sub-counties found'
                                                    },
                                                    flex:1,
                                                    multiSelect: true,
                                                    allowBlank: false,
                                                    pageSize: 20

                                                },
                                                {
                                                    xtype: "combobox",
                                                    fieldLabel: 'Year',
                                                    labelWidth: 75,
                                                    displayField: "name",
                                                    name:'year',
                                                    valueField: "year",
                                                    allowBlank: false,
                                                    reference: "yearFilterCombo",
                                                    flex:1

                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'fa fa-times',
                                                    ui:'soft-red',
                                                    margin: '0 4 0 0',
                                                    text: 'Reset',
                                                    listeners: {
                                                        click: 'onResetFilterForm'
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'fa fa-times',
                                                    ui:'soft-blue',
                                                    margin: '0 4 0 0',
                                                    text: 'Fetch',
                                                    formBind: true,
                                                    listeners: {
                                                        click: 'onFetchResults'
                                                    }
                                                }
                                            ]
                                        }

                                    ]
                                },
                                {
                                    xtype:'fieldset',
                                    title:'Chart Properties',
                                    items:[
                                        {
                                            xtype:'fieldcontainer',
                                            layout: 'hbox',
                                            items:[
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Chart Title',
                                                    reference:'chartTitle',
                                                    flex:1
                                                },
                                                {
                                                    xtype: 'checkbox',
                                                    fieldLabel: 'Use Log Scale',
                                                    margin: '0 5 0 5',
                                                    labelWidth: 60,
                                                    hidden:true,
                                                    itemId:'yAxisLogScaleCheck',
                                                    value: false
                                                },
                                                {
                                                    xtype: 'checkbox',
                                                    fieldLabel: 'Flip Axis',
                                                    labelWidth: 60,
                                                    margin: '0 5 0 10',
                                                    reference:'flipAxisConfig',
                                                    bind: {
                                                        value: '{flipAxis}'
                                                    }
                                                },
                                                {
                                                    xtype: 'checkbox',
                                                    fieldLabel: 'Show Legend',
                                                    margin: '0 10 0 10',
                                                    reference:'showLegendCheck',
                                                    bind:{
                                                        value:'{showLegend}'
                                                    }
                                                },
                                                {
                                                    xtype:'combobox',
                                                    fieldLabel: 'Legend Location',
                                                    queryMode: 'local',
                                                    displayField: 'name',
                                                    margin: '0 0 0 10',
                                                    valueField: 'value',
                                                    reference:'legendLocationCombo',
                                                    bind:{
                                                        store: '{legendLocations}',
                                                        value: '{legendDock}',
                                                        hidden: '{!showLegend}'
                                                    }
                                                }

                                            ]

                                        }
                                    ]

                                }
                            ]

                        },
                        {
                            xtype: 'gridpanel',
                            height:400,
                            region: 'west',
                            title: 'Data Fields',
                            margin: '0 0 0 5',
                            split: true,
                            collapsible: true,
                            layout: 'fit',
                            width:200,
                            bind:{
                                store: '{dataFields}',
                                hidden: '{!dataStoreLoaded}'
                            },
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'name',
                                    text: 'Data Field',
                                    flex: 1
                                }
                            ],
                            viewConfig: {
                                id:'mvbFieldsSourceGrid',
                                plugins: {
                                    ptype: 'gridviewdragdrop',
                                    ddGroup:'fieldSetter',
                                    dragText: 'Drag and drop to set chart Fields'
                                }
                            },
                            listeners: {
                                drop:'sourceFieldsGridDrop'
                            }

                        },
                        {
                            xtype: 'panel',
                            height:400,
                            region: 'center',
                            items:[
                                {
                                    xtype:'gridpanel',
                                    title:'Set Y-Axis Fields',
                                    bind:{
                                        store: '{setYAxisFields}'
                                    },
                                    minHeight: 200,
                                    scrollable: true,
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'name',
                                            text: 'Y Field',
                                            flex: 1
                                        }
                                    ],
                                    viewConfig: {
                                        id:'mvbYAxisFieldsGrid',
                                        plugins: {
                                            ptype: 'gridviewdragdrop',
                                            ddGroup:'fieldSetter'
                                        }
                                    },
                                    listeners: {
                                        drop:'yAxisSetDrop',
                                        select: 'yAxisItemSelect',
                                        rowclick: 'yAxisRowClick'
                                    }
                                },
                                {
                                    xtype:'gridpanel',
                                    title:'Set X-Axis Fields',
                                    minHeight: 200,
                                    scrollable: true,
                                    bind:{
                                        store: '{setXAxisFields}'
                                    },
                                    columns: [
                                        {
                                            xtype: 'gridcolumn',
                                            dataIndex: 'name',
                                            text: 'X Field',
                                            flex: 1
                                        }
                                    ],
                                    viewConfig: {
                                        id:'mvbXAxisFieldsGrid',
                                        plugins: {
                                            ptype: 'gridviewdragdrop',
                                            ddGroup:'fieldSetter'
                                        }
                                    },
                                    listeners:{
                                        beforedrop:'onBeforeXAxisSetDrop',
                                        drop:'xAxisSetDrop',
                                        select:'xAxisItemSelect',
                                        rowclick: 'xAxisRowClick'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            height:420,
                            title: 'Properties',
                            reference:'propertiesPanel',
                            region: 'east',
                            margin: '0 5 0 0',
                            bodyPadding: 4,
                            width:350,
                            collapsible: true,
                            split: true,
                            scrollable: true,
                            layout: 'card'
                        }
                    ],
                    bbar: {
                        xtype: 'toolbar',
                        items:[
                            '->',
                            {
                                xtype: 'button',
                                text: 'Reset to Series Defaults',
                                ui: 'soft-red',
                                iconCls: 'x-fa fa-times',
                                listeners: {
                                    click: 'onResetToSeriesDefaults'
                                }
                            },
                            {
                                xtype: 'button',
                                text: 'Generate Graph',
                                ui: 'soft-cyan',
                                iconCls: 'x-fa fa-upload',
                                listeners: {
                                    click: 'onGenerateGraph'
                                }
                            }
                        ]
                    }


                },
                {
                    title:'Graph',
                    reference:'graphPanel',
                    items:[

                    ]
                }
            ]
        }

    ]
});