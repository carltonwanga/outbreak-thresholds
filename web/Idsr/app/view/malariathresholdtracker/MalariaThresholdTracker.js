/**
 * Created by PAVILION 15 on 11/1/2018.
 */

Ext.define('Idsr.view.malariathresholdtracker.MalariaThresholdTracker', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Idsr.view.malariathresholdtracker.MalariaThresholdTrackerModel',
		'Idsr.view.malariathresholdtracker.MalariaThresholdTrackerController',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.series.Line',
        'Ext.chart.interactions.ItemHighlight'
    ],
    xtype: 'malariathresholdtracker',

    viewModel: {
        type: 'malariathresholdtracker'
    },

    controller: 'malariathresholdtracker',
    title:'Threshold Year Tracking',

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
                            pickerId:'mttracCountyCombo',
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
                            pickerId:'mttracSubCountyCombo',
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
            xtype:'tabpanel',
            items:[
                {
                    title:'Threshold Graph',
                    items:[
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
                        }
                    ]

                },
                {
                    title:'Positivity Rate Comparison',
                    items:[
                        {
                            xtype: 'cartesian',
                            reference: 'positivityComparisonChart',
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
                                store: '{yearThresholdResults}'
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
                                fields:['cases_reported','alert_threshold','action_threshold'],
                                title: 'Malaria Cases'
                            },{
                                type: 'numeric',
                                position: 'right',
                                grid: true,
                                title: 'Malaria Positivity Rate',
                                minimum: 0,
                                maximum: 100,
                                fields:['lab_positivity'],
                                renderer:'onPositivityAxisLabelRender'
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
                                    hidden:true,
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
                                    hidden:true,
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
                                },
                                {
                                    type: 'line',
                                    title:'Positivity Rate',
                                    xField: 'week',
                                    yField: 'lab_positivity',
                                    style: {
                                        lineWidth: 2
                                    },
                                    marker: {
                                        type: 'triangle',
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
                                        renderer: 'onPositivitySeriesTooltipRender'
                                    }
                                }

                            ]

                        }

                    ],
                    tbar: ['->',
                        {
                            xtype:'button',
                            ui:'soft-purple',
                            iconCls: 'fa fa-toggle-on',
                            text: 'Toggle Markers',
                            handler: 'onTogglePositivityChartMarkers'
                        },
                        {
                            xtype:'button',
                            ui:'soft-blue',
                            iconCls: 'fa fa-expand',
                            text: 'Preview',
                            handler: 'onPreviewPositivityChart'
                        },
                        {
                            xtype:'button',
                            ui:'soft-green',
                            iconCls: 'fa fa-download',
                            text: 'Download',
                            handler: 'onDownloadPositivityChart'
                        }
                    ]
                },
                {
                    title:'Deaths Comparison',
                    items:[
                        {
                            xtype: 'cartesian',
                            reference: 'deathsComparisonChart',
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
                                store: '{yearThresholdResults}'
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
                                fields:['cases_reported','alert_threshold','action_threshold'],
                                title: 'Malaria Cases'
                            },{
                                type: 'numeric',
                                position: 'right',
                                grid: true,
                                title: 'Reported Deaths',
                                minimum: 0,
                                fields:['deaths']
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
                                    hidden:true,
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
                                    hidden:true,
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
                                },
                                {
                                    type: 'line',
                                    title:'Deaths',
                                    xField: 'week',
                                    yField: 'deaths',
                                    style: {
                                        lineWidth: 2
                                    },
                                    marker: {
                                        type: 'triangle',
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

                            ]

                        }

                    ],
                    tbar: ['->',
                        {
                            xtype:'button',
                            ui:'soft-purple',
                            iconCls: 'fa fa-toggle-on',
                            text: 'Toggle Markers',
                            handler: 'onToggleDeathsChartMarkers'
                        },
                        {
                            xtype:'button',
                            ui:'soft-blue',
                            iconCls: 'fa fa-expand',
                            text: 'Preview',
                            handler: 'onPreviewDeathsChart'
                        },
                        {
                            xtype:'button',
                            ui:'soft-green',
                            iconCls: 'fa fa-download',
                            text: 'Download',
                            handler: 'onDownloadDeathsChart'
                        }
                    ]
                },
                {
                    title:'Other Comparisons',
                    items:[
                        {
                            xtype: 'cartesian',
                            reference: 'statisticalComparisonChart',
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
                                store: '{yearThresholdResults}'
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
                                fields:['cases_reported','alert_threshold','action_threshold','mean','c_sum','c_sum_1_96_sd','extrapolated_cases'],
                                title: 'Malaria Cases'
                            },{
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
                                    title:'Third Quartile',
                                    xField: 'week',
                                    yField: 'alert_threshold',
                                    hidden:true,
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
                                    title:'Mean+2 SD',
                                    hidden:true,
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
                                },
                                {
                                    type: 'line',
                                    title:'C-SUM',
                                    hidden:true,
                                    xField: 'week',
                                    yField: 'c_sum',
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
                                },
                                {
                                    type: 'line',
                                    title:'C-SUM + 1.96 SD',
                                    hidden:true,
                                    xField: 'week',
                                    yField: 'c_sum_1_96_sd',
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
                                },
                                {
                                    type: 'line',
                                    title:'Extrapolated Case',
                                    hidden:true,
                                    xField: 'week',
                                    yField: 'extrapolated_cases',
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


                            ]

                        }

                    ],
                    tbar: ['->',
                        {
                            xtype:'button',
                            ui:'soft-purple',
                            iconCls: 'fa fa-toggle-on',
                            text: 'Toggle Markers',
                            handler: 'onToggleOtherStatsChartMarkers'
                        },
                        {
                            xtype:'button',
                            ui:'soft-blue',
                            iconCls: 'fa fa-expand',
                            text: 'Preview',
                            handler: 'onPreviewOtherStatsChart'
                        },
                        {
                            xtype:'button',
                            ui:'soft-green',
                            iconCls: 'fa fa-download',
                            text: 'Download',
                            handler: 'onDownloadOtherStatsChart'
                        }
                    ]
                },

                {
                    title:'Grid View',
                    items:[
                        {
                            xtype: 'gridpanel',
                            bind:{
                                store: '{yearThresholdResults}'
                            },
                            scrollable: true,
                            height:400,
                            columns:[
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'week',
                                    flex:1,
                                    text: 'Week'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'cases_reported',
                                    flex:1,
                                    text: 'Cases Reported'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'alert_threshold',
                                    flex:1,
                                    text: 'Alert Threshold(3rd Quartile)'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'action_threshold',
                                    flex:1,
                                    text: 'Action Threshold(Mean+2 S.D)'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'lab_positivity',
                                    flex:1,
                                    renderer: function(value){
                                        return value+'%';
                                    },
                                    text: 'Positivity Rate'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'deaths',
                                    flex:1,
                                    text: 'Deaths'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'c_sum',
                                    flex:1,
                                    text: 'C-SUM'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'c_sum_1_96_sd',
                                    flex:1,
                                    text: 'C-SUM + 1.96 S.D'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'reporting_rate',
                                    flex:1,
                                    hidden:true,
                                    text: 'Reporting Rate'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'extrapolated_cases',
                                    flex:1,
                                    hidden:true,
                                    text: 'Extrapolated Cases'
                                }
                            ]

                        }

                    ]

                }

            ]
        }

    ]
});