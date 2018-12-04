/**
 * Created by PAVILION 15 on 10/8/2018.
 */
Ext.define('Idsr.view.weeklyepidemichistoricrecords.WeeklyEpidemicHistoricRecords', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.form.RadioGroup',
        'Ext.grid.column.Column',
        'Idsr.view.weeklyepidemichistoricrecords.WeeklyEpidemicHistoricRecordsController',
        'Idsr.view.weeklyepidemichistoricrecords.WeeklyEpidemicHistoricRecordsModel'
    ],
    xtype: 'weeklyepidemichistoricrecords',

    viewModel: {
        type: 'weeklyepidemichistoricrecords'
    },

    controller: 'weeklyepidemichistoricrecords',
    height: 500,
    shrinkWrap: 0,
    layout: 'border',
    title: 'Historical Data Management',
    bodyPadding: 10,
    margin:'10 5 10 5',

    items: [
        {
            xtype: 'panel',
            flex: 1,
            region: 'center',
            split: true,
            resizable: false,
            forceFit: true,
            items:[
                {
                    xtype: 'form',
                    title:'Data Filters',
                    reference:'recordsFilterForm',
                    collapsible: true,
                    collapsed: true,
                    margin: '0 0 5 0',
                    bodyPadding: 5,
                    items:[
                        {
                            xtype: 'fieldcontainer',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items:[
                                {
                                    xtype: "combobox",
                                    fieldLabel: 'County',
                                    store: 'countystore',
                                    name:'county',
                                    pickerId:'weRecCountyCombo',
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
                                    xtype: 'button',
                                    iconCls: 'fa fa-times',
                                    ui:'soft-red',
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
                            items:[
                                {
                                    xtype: "combobox",
                                    fieldLabel: 'Sub-County',
                                    pickerId:'weRecSSubCountyCombo',
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
                                    pageSize: 20

                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'fa fa-times',
                                    ui:'soft-red',
                                    tooltip: 'Reset Sub-County',
                                    listeners: {
                                        click: 'onSubCountyFilterReset'
                                    }
                                }
                            ]

                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: "combobox",
                                    fieldLabel: 'Week',
                                    reference:"weeksFilterCombo",
                                    displayField: "name",
                                    name:'week',
                                    valueField: "week",
                                    flex:1

                                },
                                {
                                    xtype: "combobox",
                                    fieldLabel: 'Year',
                                    displayField: "name",
                                    name:'year',
                                    valueField: "year",
                                    reference: "yearFilterCombo",
                                    flex:1

                                }
                            ]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: "button",
                                    text: 'Reset',
                                    ui: 'soft-red',
                                    listeners: {
                                      click: 'onFilterFormReset'
                                    },
                                    iconCls: 'x-fa fa-times'


                                },
                                {
                                    xtype: "button",
                                    text: 'Filter',
                                    ui:'soft-blue',
                                    iconCls: 'x-fa fa-filter',
                                    listeners: {
                                        click: 'onSubmitFilterClick'
                                    }


                                }
                            ]

                        }
                    ]
                },
                {
                    xtype: 'gridpanel',
                    reference: 'historicDataList',
                    bind:{
                        store: '{historicRecords}'
                    },
                    height:500,
                    columns:[
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'id',
                            text: 'ID',
                            hidden:true
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'disease_name',
                            flex:1,
                            text: 'Disease'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'sub_county',
                            flex:1,
                            text: 'Sub-county'
                        },
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'county',
                            text: 'County'
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
                            store: '{historicRecords}'
                        },
                        displayInfo: true,
                        displayText: 'Displaying record {0} - {1} of {2}',
                        emptyText: 'No records to display'
                    })


                }
            ]

        },
        {
            xtype: 'panel',
            flex: 1,
            region: 'east',
            split: true,
            reference: 'sideDisplay',
            width: 150,
            layout: 'card',
            bodyBorder: true,
            items:[
                {
                    xtype: 'panel',
                    reference: 'selectMessage',
                    bodyPadding: 10,
                    items: [
                        {
                          xtype:'fieldset',
                          title:'About Records',
                          flex: 1,
                          items: [
                              {
                                  xtype: 'container',
                                  html: ['<p>These are historic records on based on the weekly epidemic</p>',
                                      '<p>Monitoring Form MOH 505. This data that is not Available in DHIS2</p>'
                                  ]

                              }
                          ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            items:[
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    html: '<h2>Please select a record to view details</h2>'
                                }
                            ]

                        }

                    ]
                },
                {
                    xtype: "panel",
                    title: "Details",
                    reference: "details",
                    bodyPadding: 10,
                    scrollable: true,
                    items:[
                        {
                            xtype: 'fieldset',
                            title: 'Record Details',
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
                                    fieldLabel: 'Sub County',
                                    bind: {
                                        value: '{record.sub_county}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'County',
                                    bind: {
                                        value: '{record.county}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Week',
                                    bind: {
                                        value: '{record.week}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Year',
                                    bind: {
                                        value: '{record.year}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Date Reported',
                                    bind: {
                                        value: '{record.date_reported}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Week Ending',
                                    bind: {
                                        value: '{record.week_ending_date}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: "fieldset",
                            title:"Data Values",
                            items:[
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Cases Less than 5',
                                    bind: {
                                        value: '{record.cases_less_than_5}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Cases Greater than 5',
                                    bind: {
                                        value: '{record.cases_greater_than_5}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Deaths Less than 5',
                                    bind: {
                                        value: '{record.deaths_less_than_5}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Deaths Greater than 5',
                                    bind: {
                                        value: '{record.deaths_greater_than_5}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'panel',
                    title:'Import Historic Records',
                    reference: 'importPanel',
                    bodyPadding: 5,
                    height: 500,
                    scrollable: true,
                    items:[
                        {
                            xtype: 'fieldset',
                            title: 'Template Config',
                            items:[
                                {
                                    xtype      : 'radiogroup',
                                    fieldLabel : 'Template',
                                    defaultType: 'radiofield',
                                    defaults: {
                                        flex: 1
                                    },
                                    layout: 'hbox',
                                    items:[
                                        {
                                            boxLabel  : 'Default',
                                            name      : 'template',
                                            inputValue: 'default',
                                            bind:{
                                                value:'{defaultSelected}'
                                            },
                                            checked:true,
                                            listeners: {
                                                change: 'onDefaultChanged'
                                            }
                                        }, {
                                            boxLabel  : 'Custom',
                                            name      : 'template',
                                            bind:{
                                                value:'{customSelected}'
                                            },
                                            inputValue: 'custom'
                                        }
                                    ]
                                }

                            ]
                        },
                        {
                            xtype: 'form',
                            bodyPadding: 5,
                            reference:'importConfigForm',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            fieldDefaults: {
                                allowBlank:false,
                                margin:'3 3 3 3',
                                minValue:1
                            },
                            items: [
                                {
                                    xtype:'fieldset',
                                    title:'Column Positions',
                                    items:[
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Disease',
                                                    name:'disease',
                                                    minValue: 1,
                                                    bind:{
                                                        value: '{templateConfig.disease}',
                                                        readOnly: '{defaultSelected}'
                                                    }
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Sub-County',
                                                    minValue: 1,
                                                    name:'subcounty',
                                                    bind:{
                                                        value: '{templateConfig.subcounty}',
                                                        readOnly: '{defaultSelected}'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Week',
                                                    minValue: 1,
                                                    name:'week',
                                                    bind:{
                                                        value: '{templateConfig.week}',
                                                        readOnly: '{defaultSelected}'
                                                    }
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Week Ending',
                                                    minValue: 1,
                                                    name:'weekending',
                                                    bind:{
                                                        value: '{templateConfig.weekEnding}',
                                                        readOnly: '{defaultSelected}'
                                                    },
                                                    allowBlank:true
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Cases(Less than 5)',
                                                    name:'cases_less_5',
                                                    minValue: 1,
                                                    bind:{
                                                        value: '{templateConfig.casesLessThan5}',
                                                        readOnly: '{defaultSelected}'
                                                    }
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    minValue: 1,
                                                    fieldLabel: 'Cases(Greater than 5)',
                                                    name:'cases_greater_5',
                                                    bind:{
                                                        value: '{templateConfig.casesGreaterThan5}',
                                                        readOnly: '{defaultSelected}'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Deaths(Less than 5)',
                                                    name:'deaths_less_5',
                                                    minValue: 1,
                                                    bind:{
                                                        value: '{templateConfig.deathsLessThan5}',
                                                        readOnly: '{defaultSelected}'
                                                    }
                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Deaths(Greater than 5)',
                                                    name:'deaths_greater_5',
                                                    minValue: 1,
                                                    bind:{
                                                        value: '{templateConfig.deathsGreaterThan5}',
                                                        readOnly: '{defaultSelected}'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Year',
                                                    name:'year',
                                                    minValue: 1,
                                                    bind:{
                                                        value: '{templateConfig.year}',
                                                        readOnly: '{defaultSelected}'
                                                    }

                                                },
                                                {
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Date Reported',
                                                    name:'date_reported',
                                                    minValue: 1,
                                                    bind:{
                                                        value: '{templateConfig.dateReported}',
                                                        readOnly: '{defaultSelected}'
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    layout: 'anchor',
                                    items:[
                                        {
                                            xtype: 'checkbox',
                                            boxLabel  : 'Title Column Included',
                                            name      : 'title_column',
                                            bind:{
                                                readOnly: '{defaultSelected}',
                                                value: '{templateConfig.titleColumn}'
                                            }
                                        },
                                        {
                                            xtype: 'numberfield',
                                            fieldLabel: 'Sheet Number',
                                            name:'sheetnumber',
                                            bind:{
                                                value: '{templateConfig.sheetNumber}',
                                                readOnly: '{defaultSelected}'

                                            },
                                            anchor: '80%',
                                            minValue: 1
                                        },
                                        {
                                            xtype: 'filefield',
                                            name: 'file',
                                            fieldLabel: 'File',
                                            anchor: '80%',
                                            allowBlank: false,
                                            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'button',
                                    text: 'Submit',
                                    iconCls: 'fa fa-save',
                                    listeners: {
                                        click:'onSubmitImport'
                                    }
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
                text: 'Import Records',
                ui: 'soft-cyan',
                iconCls: 'x-fa fa-upload',
                listeners: {
                    click: 'onImportDataClick'
                }
            }
        ]
    }
});