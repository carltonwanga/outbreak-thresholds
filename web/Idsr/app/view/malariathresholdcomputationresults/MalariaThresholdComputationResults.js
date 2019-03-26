/**
 * Created by PAVILION 15 on 10/21/2018.
 */
Ext.define('Idsr.view.malariathresholdcomputationresults.MalariaThresholdComputationResults', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Idsr.view.malariathresholdcomputationresults.MalariaThresholdComputationResultsModel',
		'Idsr.view.malariathresholdcomputationresults.MalariaThresholdComputationResultsController'
    ],

    xtype: 'malariathresholdcomputationresults',

    viewModel: {
        type: 'malariathresholdcomputationresults'
    },

    controller: 'malariathresholdcomputationresults',

    title: 'Malaria Threshold Computation Results',
    height: 500,
    shrinkWrap: 0,
    layout: 'border',
    bodyPadding: 10,
    margin:'10 5 10 5',
    scrollable: 'y',
    items: [
        {
            xtype: 'form',
            region: 'north',
            reference:'resultsFilterForm',
            margin: '0 0 5 0',
            bodyPadding: 3,
            items:[
                {
                    xtype:'fieldset',
                    title: 'Filter',
                    items:[
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
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
                                            labelWidth: 45,
                                            store: 'countystore',
                                            name:'county',
                                            pickerId:'mtcrCountyCombo',
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
                                            fieldLabel: 'Sub-County',
                                            labelWidth: 75,
                                            pickerId:'mtcrSubCountyCombo',
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
                                            margin: '0 4 0 0',
                                            tooltip: 'Reset Sub-County',
                                            listeners: {
                                                click: 'onSubCountyFilterReset'
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
                                            fieldLabel: 'Inference',
                                            labelWidth: 60,
                                            pickerId:'mtcrInferenceCombo',
                                            valueField: 'id',
                                            store: 'thresholdinferencestore',
                                            reference:'thresholdInferenceStore',
                                            displayField: 'name',
                                            name:'inference'
                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-times',
                                            ui:'soft-red',
                                            tooltip: 'Reset Inference',
                                            listeners: {
                                                click: 'onResetInference'
                                            }
                                        }
                                    ]

                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            margin: '4 0 0 0',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
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
                                            fieldLabel: 'Week',
                                            reference:"weeksFilterCombo",
                                            displayField: "name",
                                            name:'week',
                                            labelWidth: 45,
                                            valueField: "week",
                                            flex:1

                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-times',
                                            ui:'soft-red',
                                            margin: '0 4 0 6',
                                            tooltip: 'Reset Week',
                                            listeners: {
                                                click: 'onWeekFilterReset'
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
                                            fieldLabel: 'Year',
                                            labelWidth: 75,
                                            displayField: "name",
                                            name:'year',
                                            valueField: "year",
                                            reference: "yearFilterCombo",
                                            flex:1

                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-times',
                                            ui:'soft-red',
                                            margin: '0 4 0 0',
                                            tooltip: 'Reset Year',
                                            listeners: {
                                                click: 'onYearFilterReset'
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
                                            xtype: 'combobox',
                                            fieldLabel: 'Status',
                                            labelWidth: 60,
                                            reference:'statusFilterCombo',
                                            name:'status',
                                            value:'active',
                                            store:[
                                                [
                                                    'active',
                                                    'Active'
                                                ],
                                                [
                                                    'all',
                                                    'All'
                                                ]
                                            ]

                                        },
                                        {
                                            xtype: 'button',
                                            iconCls: 'fa fa-times',
                                            ui:'soft-red',
                                            margin: '0 4 0 0',
                                            tooltip: 'Reset Status',
                                            listeners: {
                                                click: 'onStatusFilterReset'
                                            }
                                        }
                                    ]
                                }


                            ]

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
            flex: 1,
            region: 'center',
            split: true,
            resizable: false,
            forceFit: true,
            reference:'resultsList',
            bind:{
                store: '{thresholdResults}'
            },
            minHeight:500,
            columns:[
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'id',
                    text: 'ID',
                    hidden:true
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
                    dataIndex: 'sub_county_name',
                    text: 'Sub-County'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'county_name',
                    hidden: true,
                    text: 'County'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'time_calculated',
                    text: 'Time Calculated',
                    hidden: true
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'cases_reported',
                    text: 'Cases Reported'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'alert_threshold',
                    text: 'Alert Threshold'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'action_threshold',
                    text: 'Action Threshold'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'inference_name',
                    text: 'Inference',
                    hidden: true
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'deaths',
                    text: 'Deaths',
                    hidden: true
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'lab_positivity',
                    text: 'Positivity Rate',
                    hidden: true
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'alert_color_codes',
                    text: 'Inference',
                    renderer: function (value, meta) {
                        meta.style = "background-color:"+value;

                    }
                }
            ],
            listeners: {
                select: 'selectRecord'
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                dockedItems: [{
                    xtype: 'toolbar'
                }],
                bind: {
                    store: '{thresholdResults}'
                },
                displayInfo: true,
                displayText: 'Displaying record {0} - {1} of {2}',
                emptyText: 'No records to display'
            }),
            tbar: {
                items: [
                    {
                        xtype: 'button',
                        text:'View weather details',
                        iconCls: 'fa fa-cloud',
                        listeners: {
                            click: 'onShowWeatherPanel'
                        }
                    }
                ]
            }

        },
        {
            xtype: 'panel',
            region: 'east',
            split: true,
            reference: 'sideDisplay',
            width: 150,
            flex: 1,
            layout: 'card',
            bodyBorder: true,
            minHeight:500,
            items:[
                {
                    xtype: 'panel',
                    reference: 'selectMessage',
                    bodyPadding: 10,
                    items: [
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
                    height: 500,
                    bodyPadding: 10,
                    scrollable: true,
                    items:[
                        {
                            xtype: 'fieldset',
                            title: 'Result Details',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Sub County',
                                    bind: {
                                        value: '{record.sub_county_name}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'County',
                                    bind: {
                                        value: '{record.county_name}'
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
                                    fieldLabel: 'Time Calculated',
                                    bind: {
                                        value: '{record.time_calculated}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Results',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Week cases reported',
                                    bind: {
                                        value: '{record.cases_reported}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Alert threshold',
                                    bind: {
                                        value: '{record.alert_threshold}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Action Threshold',
                                    bind: {
                                        value: '{record.action_threshold}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype:'fieldset',
                            fieldLabel:'Parameters',
                            items:[
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Computed datasets',
                                    bind: {
                                        value: '{record.computation_dataset_count}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Expected datasets',
                                    bind: {
                                        value: '{record.expected_dataset_count}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Reporting rate',
                                    bind: {
                                        value: '{record.reporting_rate}%'
                                    }
                                }

                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Other Indicators',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Deaths',
                                    bind: {
                                        value: '{record.deaths}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Positivity Rate',
                                    bind: {
                                        value: '{record.lab_positivity}%'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Mean',
                                    bind: {
                                        value: '{record.mean}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'C-SUM',
                                    bind: {
                                        value: '{record.c_sum}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'C-SUM+1.96SD',
                                    bind: {
                                        value: '{record.c_sum_1_96_sd}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Extrapolated Cases',
                                    bind: {
                                        value: '{record.extrapolated_cases}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'SD',
                                    bind: {
                                        value: '{record.cases_reported_sd}'
                                    }
                                }
                            ]

                        },
                        {
                            xtype: 'fieldset',
                            title: 'Inference',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Inference',
                                    bind: {
                                        value: '{record.inference_name}'
                                    }
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: 'Narration',
                                    bind: {
                                        value: '{record.narration}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Batch Id',
                            bind: {
                                value: '{record.batch_id}'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: 'Active',
                            bind: {
                                value: '{record.is_active}'
                            }
                        }

                    ]

                },
                {
                    xtype: 'tabpanel',
                    reference: 'weatherPanel',
                    title:'Weather Details',
                    items:[
                        {
                            title: 'Monday'
                        },
                        {
                            title: 'Tuesday'
                        },
                        {
                            title: 'Wednesday'
                        },
                        {
                            title: 'Thursday'
                        },
                        {
                            title: 'Friday'
                        },
                        {
                            title: 'Saturday'
                        },
                        {
                            title: 'Sunday'
                        }
                    ],
                    listeners:{
                        tabchange:'onWeatherTabChange'
                    }
                }

            ]
        }
    ]
});