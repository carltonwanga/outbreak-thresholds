/**
 * Created by PAVILION 15 on 10/29/2018.
 */
Ext.define('Idsr.view.malariathresholdmap.MalariaThresholdMap', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Idsr.view.malariathresholdmap.MalariaThresholdMapModel',
		'Idsr.view.malariathresholdmap.MalariaThresholdMapController'
    ],
    xtype: 'malariathresholdmap',
    bodyPadding: 10,
    margin:'10 5 10 5',
    height: 500,
    shrinkWrap: 0,
    layout: 'border',
    viewModel: {
        type: 'malariathresholdmap'
    },
    title:'Malaria Threshold Map',

    controller: 'malariathresholdmap',

    items: [
        {
            xtype: 'panel',
            flex:1,
            region: 'center',
            split: true,
            minHeight: 700,
            forceFit: true,
            width:600,
            html:'<div id = "counties-map-container"></div>',
            itemId:'malCountiesMap',
            title:'Counties',
            listeners:{
                click: {
                    element: 'el',
                    preventDefault: true,
                    fn: function (e, target) {
                        var el = Ext.fly(target);

                        if (el.dom.nodeName === "path") {
                            var cmp = Ext.ComponentQuery.query('#malCountiesMap')[0];
                            cmp.fireEvent('countiesMapClick', e);
                        }
                    }
                },
                mouseover: {
                    element: 'el',
                    preventDefault: true,
                    fn: function (e, target) {
                        var el = Ext.fly(target);

                        if (el.dom.nodeName === "path") {
                            var cmp = Ext.ComponentQuery.query('#malCountiesMap')[0];
                            cmp.fireEvent('countiesMapHover', e);
                        }
                    }
                }
            },
            tbar: {
                xtype: 'toolbar',
                items:[
                    {
                        xtype: "combobox",
                        fieldLabel: 'Week',
                        labelWidth: 50,
                        reference:"weeksFilterCombo",
                        displayField: "name",
                        name:'week',
                        allowBlank: false,
                        valueField: "week",

                    },
                    {
                        xtype: "combobox",
                        fieldLabel: 'Year',
                        labelWidth: 50,
                        displayField: "name",
                        name:'year',
                        allowBlank: false,
                        valueField: "year",
                        reference: "yearFilterCombo"

                    },
                    {
                        xtype: 'button',
                        text: 'Filter',
                        iconCls: 'x-fa fa-check',
                        margin: '0 5 0 4',
                        ui:'soft-blue',
                        listeners: {
                            click: 'onFetchThresholds'
                        }
                    }

                ]
            }
        },
        {
            xtype:'tabpanel',
            width:400,
            flex: 1,
            split: true,
            bind:{
                title: '{detailViewPanel}'
            },
            region: 'east',
            bodyBorder: true,
            items:[
                {
                    title: 'Map View',
                    html: '<div id = "mal-sub-counties-map"> </div>',
                    minHeight: 600,
                    itemId:'malSubCountyMap',
                    listeners: {
                        click: {
                            element: 'el',
                            preventDefault: true,
                            fn: function (e, target) {
                                var el = Ext.fly(target);

                                if (el.dom.nodeName === "path") {
                                    var cmp = Ext.ComponentQuery.query('#malSubCountyMap')[0];
                                    cmp.fireEvent('onSubCountiesMapClick', e);
                                }
                            }
                        }
                    }

                },
                {
                    title: 'Grid View',
                    xtype:'grid',
                    bind:{
                        store: '{currentSubCountyThresholds}'
                    },
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'sub_county_name',
                            text: 'Sub County'
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
                            dataIndex: 'narration',
                            flex:1,
                            text: 'Narration'
                        }
                    ]


                }
            ]


        }

    ],
    listeners: {
        afterrender: 'renderCountiesMap'

    }
});