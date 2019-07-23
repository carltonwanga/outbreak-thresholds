/**
 * Created by PAVILION 15 on 3/20/2019.
 */
Ext.define('Idsr.view.meningitisthresholdtracker.MeningitisThresholdTracker', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Idsr.view.meningitisthresholdtracker.MeningitisThresholdTrackerModel',
		'Idsr.view.meningitisthresholdtracker.MeningitisThresholdTrackerController'
    ],
    xtype: 'meningitisthresholdtracker',

    viewModel: {
        type: 'meningitisthresholdtracker'
    },

    controller: 'meningitisthresholdtracker',
    title:'Meningitis Thresholds Year Tracking',

    bodyPadding: 10,
    margin:'10 5 10 5',

    items: [
        {
            xtype:'form',
            reference:'resultsFilterForm',
            margin: '0 0 5 0',
            bodyPadding: 3,
            items:[
                {
                    xtype:'fieldcontainer',
                    layout: 'hbox',
                    items:[
                        {
                            xtype: "combobox",
                            fieldLabel: 'County',
                            labelWidth: 45,
                            store: 'countystore',
                            name:'county',
                            pickerId:'menittracCountyCombo',
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
                            pickerId:'menittracSubCountyCombo',
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
            xtype: 'panel',
            items: [
                {
                    xtype: 'cartesian',
                    reference: 'thresholdchart',
                    width: '100%',
                    height: 500,
                    interactions: {
                        type: 'panzoom',
                        zoomOnPanGesture: true
                    },
                    animation: {
                        duration: 200
                    },
                    bind:{
                        store: '{thresholdChartResults}'
                    },
                    insetPadding: 40,
                    innerPadding: {
                        left: 40,
                        right: 40
                    },
                    legend: {
                        docked: 'bottom'
                    },
                    axes: [{
                        type: 'numeric',
                        position: 'left',
                        grid: true,
                        minimum: 0,
                        title: 'Malaria Cases'
                    }, {
                        type: 'numeric',
                        position: 'bottom',
                        grid: true,
                        minimum: 1,
                        increment: 1,
                        maximum: 52,
                        title: 'Week',
                        label: {
                            rotate: {
                                degrees: -45
                            }
                        }
                    }],
                    series: [
                        {
                            type: 'line',
                            title:'Cases Reported',
                            xField: 'week',
                            yField: 'cases_reported',
                            style: {
                                lineWidth: 2
                            },
                            marker: {
                                radius: 4,
                                lineWidth: 2
                            },
                            highlight: {
                                fillStyle: '#000',
                                radius: 5,
                                lineWidth: 2,
                                strokeStyle: '#fff'
                            },
                            tooltip: {
                                trackMouse: true,
                                showDelay: 0,
                                dismissDelay: 0,
                                hideDelay: 0,
                                renderer: 'onThresholdSeriesTooltipRender'
                            }
                        },
                        {
                            type: 'line',
                            title:'Alert Threshold',
                            xField: 'week',
                            yField: 'alert_threshold',
                            style: {
                                lineWidth: 2
                            },
                            marker: {
                                type: 'square',
                                fx: {
                                    duration: 200,
                                    easing: 'backOut'
                                }
                            },
                            highlight: {
                                fillStyle: '#000',
                                radius: 5,
                                lineWidth: 2,
                                strokeStyle: '#fff'
                            },
                            tooltip: {
                                trackMouse: true,
                                showDelay: 0,
                                dismissDelay: 0,
                                hideDelay: 0,
                                renderer: 'onThresholdSeriesTooltipRender'
                            }
                        },
                        {
                            type: 'line',
                            title:'Action Threshold',
                            xField: 'week',
                            yField: 'action_threshold',
                            style: {
                                lineWidth: 2
                            },
                            marker: {
                                type: 'cross',
                                fx: {
                                    duration: 200,
                                    easing: 'backOut'
                                }
                            },
                            highlight: {
                                fillStyle: '#000',
                                radius: 5,
                                lineWidth: 2,
                                strokeStyle: '#fff'
                            },
                            tooltip: {
                                trackMouse: true,
                                showDelay: 0,
                                dismissDelay: 0,
                                hideDelay: 0,
                                renderer: 'onThresholdSeriesTooltipRender'
                            }
                        }

                    ],
                    listeners: {
                        destroy: 'onThresholdChartDestroy'
                    }
                }
            ],
            tbar: ['->',
                {
                    xtype:'button',
                    ui:'soft-purple',
                    iconCls: 'fa fa-toggle-on',
                    text: 'Toggle Markers',
                    handler: 'onToggleThresholdTrackingMarkers'
                },
                {
                    xtype:'button',
                    ui:'soft-blue',
                    iconCls: 'fa fa-expand',
                    text: 'Preview',
                    handler: 'onPreviewTrackingChart'
                },
                {
                    xtype:'button',
                    ui:'soft-green',
                    iconCls: 'fa fa-download',
                    text: 'Download',
                    handler: 'onDownloadTrackingChart'
                },
                {
                    iconCls: 'fa fa-line-chart',
                    text: 'Animate',
                    handler: 'onAnimateThresholdLineChart'
                },
                {
                    xtype:'button',
                    ui:'soft-cyan',
                    iconCls: 'fa fa-download',
                    text: 'Add to Dashboard',
                    handler: 'onAddToDashboard'
                }
            ]
        }
    ]
});