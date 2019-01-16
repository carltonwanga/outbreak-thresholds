/**
 * Created by PAVILION 15 on 6/21/2018.
 */
Ext.define('Idsr.view.usereventlogs.UserEventLogs', {
    extend: 'Ext.Container',

    requires: [
        'Idsr.view.usereventlogs.UserEventLogsModel',
		'Idsr.view.usereventlogs.UserEventLogsController'
    ],
    xtype: 'usereventlogs',
    viewModel: {
        type: 'usereventlogs'
    },

    controller: 'usereventlogs',

    items: [
        {
            xtype:'form',
            reference:'reportFilterFrm',
            items:[
                {
                    xtype:'fieldset',
                    title:'Date Range',
                    margin: '4 4 4 4',
                    layout: 'hbox',
                    items:[
                        {

                            xtype:'datefield',
                            itemId: 'fromDate',
                            format:'Y-m-d',
                            fieldLabel:'From',
                            flex: 1,
                            value: new Date(),
                            margin: '0 4 0 0',
                            name:'from'
                        },
                        {
                            xtype:'datefield',
                            format:'Y-m-d',
                            fieldLabel: 'To',
                            itemId: 'toDate',
                            flex: 1,
                            value: new Date(),
                            maxValue: new Date(),
                            margin: '0 4 0 0',
                            name:'to'
                        }


                    ]
                },
                {
                    xtype: 'panel',
                    title: 'Advance Filter',
                    iconCls: 'x-fa fa-filter',
                    collapsible: true,
                    items:[
                        {
                            xtype:'fieldset',
                            layout: 'hbox',
                            title: 'Details Filter',
                            items:[
                                {
                                    xtype: 'combo',
                                    flex: 1,
                                    name:'user',
                                    reference:'userFilter',
                                    fieldLabel: 'User',
                                    hideTrigger: true,
                                    minChars: 3,
                                    valueField:'id',
                                    displayField:'fullName',
                                    bind:{
                                        store: '{users}'
                                    },
                                    listConfig: {
                                        loadingText: 'Searching...',
                                        emptyText: 'No users found'
                                    },
                                    pageSize: 10
                                },
                                {
                                    xtype: 'textfield',
                                    flex: 1,
                                    name: 'ip',
                                    regex: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
                                    regexText: 'Please enter a valid ip address',
                                    reference:'ipFilter',
                                    fieldLabel: 'IP Address'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Reset',
                                    iconCls: 'fa fa-times',
                                    margin: '0 4 0 0',
                                    ui: 'soft-red',
                                    listeners: {
                                        click: 'onResetFilters'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'button',
                    text: 'Submit',
                    iconCls: 'fa fa-check',
                    margin: '5 5 5 5',
                    listeners: {
                        click: 'onGenerateReport'
                    }
                }
            ]
        },
        {
            xtype: 'grid',
            title: 'User Event Logs',
            height:500,
            scrollable: true,
            bind: {
                store: '{logs}'
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                bind:{
                    store: '{logs}'
                },
                displayInfo: true,
                displayMsg: 'Displaying Records {0} - {1} of {2}',
                emptyMsg: "No Records to display"

            }),
            columns:{
                items:[
                    {
                        text: 'ID',
                        dataIndex: 'id',
                        hidden: true
                    },
                    {
                        text: 'Action',
                        flex:1,
                        dataIndex: 'action'
                    },
                    {
                        text: 'User',
                        flex:1,
                        dataIndex: 'user'
                    },
                    {
                        text: 'IP Address',
                        dataIndex: 'ip_address'
                    },
                    {
                        xtype: 'datecolumn',
                        text: 'Time',
                        dataIndex: 'transaction_time',
                        format: 'Y-m-d H:i:s',
                        flex:1
                    },
                    {
                        text: 'Reference',
                        dataIndex: 'reference'
                    }

                ]

            }
        }
    ]
});