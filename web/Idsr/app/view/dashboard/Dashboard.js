Ext.define('Idsr.view.meningitisthresholdtracker.Dashboard', {
    extend: 'Ext.container.Container',
    alias: 'widget.admindashboard',
    requires: [
        'Ext.chart.CartesianChart',
        'Ext.chart.PolarChart',
        'Ext.chart.axis.Category3D',
        'Ext.chart.axis.Numeric3D',
        'Ext.chart.interactions.Rotate',
        'Ext.chart.series.Bar3D',
        'Ext.chart.series.Pie3D',
        'Ext.container.Container',
        'Ext.layout.container.Fit',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.util.Format',
        'Ext.ux.layout.ResponsiveColumn',
        'Idsr.view.dashboard.DashboardController',
        'Idsr.view.dashboard.DashboardModel',
        'Ext.chart.grid.HorizontalGrid3D',
        'Ext.chart.grid.VerticalGrid3D'
    ],

    controller: 'dashboard',
    viewModel: {
        type: 'dashboard'
    },

    layout: 'responsivecolumn',

    listeners: {
        hide: 'onHideView'
    },
    items: [
        {
            xtype: 'panel',
            userCls: 'big-60 small-100',
            cls: 'dashboard-main-chart shadow',
            height: 420,
            bodyPadding: 15,
            title: 'Highest Recorded Positivity Rates',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            tools: [
                {
                    type: 'refresh',
                    toggleValue: false,
                    listeners: {
                        click: 'onRefreshSubcountyToggle'
                    }
                }
            ],
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'fit',
                    reference:'positivitySummaryContainer',
                    items: [
                        {
                            xtype: 'cartesian',
                            width: '100%',
                            insetPadding: '10px 10px 10px 10px',
                            bind:{
                                store: '{positivityChartSummary}'
                            },
                            axes: [
                                {
                                    type: 'numeric3d',
                                    position: 'left',
                                    grid: true,
                                    title: 'Positivity Rate'
                                },
                                {
                                    type: 'category3d',
                                    position: 'bottom',
                                    grid: true,
                                    title: 'Sub-County',
                                    label: {
                                        rotate: {
                                            degrees: -30
                                        }
                                    }
                                }
                            ],
                            series: [
                                {
                                    type: 'bar3d',
                                    axis: 'left',
                                    xField: 'sub_county',
                                    yField: 'lab_positivity',
                                    label: {
                                        field: 'lab_positivitys',
                                        display: 'insideEnd',
                                        renderer: function (text) {
                                            return Ext.util.Format.number(text, "0,000");
                                        }
                                    },
                                    highlight: {
                                        fillStyle: 'rgba(43, 130, 186, 1.0)',
                                        strokeStyle: 'brown',
                                        showStroke: true,
                                        lineWidth: 2
                                    },
                                    renderer: 'onColumnRender'

                                }
                            ]

                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            userCls: 'big-40 small-100',
            title: 'Epi week',
            titleAlign: 'center',
            ui: 'light',
            iconCls: 'x-fa fa-pie-chart',
            headerPosition: 'bottom',
            cls: 'dashboard-tile shadow',
            height: 130,
            layout: 'fit',
            bodyStyle: 'background:#33abaa; padding:10px;',
            bind:{
                html:'<span class="main-txt">{weekThresholds.epiWeek}</span>'
            }

        },
        {
            xtype: 'panel',
            userCls: 'big-20 small-50',
            title: 'Malaria Action Thresholds',
            ui: 'light',
            iconCls: 'x-fa fa-database',
            headerPosition: 'bottom',
            cls: 'dashboard-tile shadow',
            height: 130,
            layout: 'fit',
            bodyStyle: 'background:#70bf73; padding:10px;',
            bind:{
                html:'<span class="main-txt">{weekThresholds.malariaAction}</span>'
            }
        },
        {
            xtype: 'panel',
            userCls: 'big-20 small-50',
            title: 'Malaria Alert Thresholds',
            ui: 'light',
            iconCls: 'x-fa fa-database',
            headerPosition: 'bottom',
            cls: 'dashboard-tile shadow',
            height: 130,
            layout: 'fit',
            bodyStyle: 'background:#35baf6; padding:10px;',
            bind:{
                html:'<span class="main-txt">{weekThresholds.malariaAlert}</span>'
            }

        },
        {
            xtype: 'panel',
            userCls: 'big-20 small-50',
            title: 'Meningits Action Thresholds',
            ui: 'light',
            iconCls: 'x-fa fa-database',
            headerPosition: 'bottom',
            cls: 'dashboard-tile shadow',
            height: 130,
            layout: 'fit',
            bodyStyle: 'background:#8561c5; padding:10px;',
            bind:{
                html:'<span class="main-txt">{weekThresholds.meningitisAction}</span>'
            }
        },
        {
            xtype: 'panel',
            userCls: 'big-20 small-50',
            title: 'Meningitis Alert Thresholds',
            ui: 'light',
            iconCls: 'x-fa fa-database',
            headerPosition: 'bottom',
            cls: 'dashboard-tile shadow',
            height: 130,
            layout: 'fit',
            bodyStyle: 'background:#f1495b; padding:10px;',
            bind:{
                html:'<span class="main-txt">{weekThresholds.meningitisAlert}</span>'
            }
        },

        {
            xtype: 'panel',
            userCls: 'big-50 small-100',
            title: 'Westlands Malaria Thresholds Chart',
            bodyPadding: 15,
            tools: [
                {
                    type: 'close',
                    toggleValue: false,
                    listeners: {
                        click: 'onRemoveTracker'
                    }
                }
            ],
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
                        store: '{yearThresholdResults}'
                    },
                    insetPadding: 40,
                    innerPadding: {
                        left: 40,
                        right: 40
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

            ]

        },
        {
            xtype: 'panel',
            userCls: 'big-50 small-100',
            title: 'Westlands Malaria Positivity Rate Chart',
            bodyPadding: 15,
            tools: [
                {
                    type: 'close',
                    toggleValue: false,
                    listeners: {
                        click: 'onRemoveTracker'
                    }
                }
            ],
            items: [
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
                        fields:['lab_positivity']
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
            ]

        }

    ]

});