/**
 * Created by PAVILION 15 on 5/13/2019.
 */
Ext.define('Idsr.view.subcountyconfig.SubCountyConfig', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Idsr.view.subcountyconfig.SubCountyConfigModel',
		'Idsr.view.subcountyconfig.SubCountyConfigController'
    ],
    xtype: 'subcountyconfig',

    viewModel: {
        type: 'subcountyconfig'
    },

    controller: 'subcountyconfig',
    title:'Sub County Configuration',
    shrinkWrap: 0,
    bodyPadding: 10,
    margin:'10 5 10 5',
    scrollable: 'y',

    items: [
        {
            xtype: 'gridpanel',
            bind:{
                store: '{subcounties}'
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                bind:{
                    store: '{subcounties}'
                },
                displayInfo: true,
                displayMsg: 'Displaying sub-counties {0} - {1} of {2}',
                emptyMsg: "No sub-counties to display"

            }),
            columns: [
                {
                    text: 'Id',
                    dataIndex: 'id',
                    hidden:true
                },
                {
                    text: 'Name',
                    dataIndex: 'name',
                    editor: {
                        xtype:'textfield',
                        allowBlank: false
                    },
                    flex:1
                },
                {
                    text: 'Map Code',
                    dataIndex: 'map_code',
                    editor: {
                        xtype:'textfield',
                        allowBlank: false
                    },
                    flex:1
                },
                {
                    text: 'Latitude',
                    dataIndex: 'geo_latitude',
                    editor: {
                        xtype:'textfield',
                        allowBlank: false
                    },
                    flex:1
                },
                {
                    text: 'Longitude',
                    dataIndex: 'geo_longitude',
                    editor: {
                        xtype:'textfield',
                        allowBlank: false
                    },
                    flex:1
                },
                {
                    text: 'Geo Code Name',
                    dataIndex: 'geo_code_name',
                    editor: {
                        xtype:'textarea',
                        allowBlank: false
                    },
                    flex:1
                },
                {
                    text: 'Population Estimate',
                    dataIndex: 'population_estimate',
                    editor: {
                        xtype:'numberfield',
                        allowBlank: false
                    },
                    flex:1
                },
                {
                    text: 'Focal Person Name',
                    dataIndex: 'focal_person',
                    editor: {
                        xtype:'textarea',
                        allowBlank: false
                    },
                    flex:1
                },
                {
                    text: 'Contact',
                    dataIndex: 'focal_person_tel',
                    editor: {
                        xtype:'textfield',
                        allowBlank: false,
                        regex:/^07\d{8}$/,
                        regexText:'This field should follow the format 07 followed by 8 digits'
                    },
                    flex:1
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        '->',
                        '-',
                        {
                            xtype: 'textfield',
                            width: 200,
                            reference:'searchfield',
                            name: 'query',
                            emptyText: 'Search by Name',
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
            ],
            plugins: {
                ptype: 'rowediting',
                clicksToEdit: 2,
                listeners: {
                    edit: function(editor, e) {
                        e.record.commit();
                    }
                }
            }

        }
    ]
});