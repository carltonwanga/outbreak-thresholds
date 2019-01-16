/**
 * Created by PAVILION 15 on 6/21/2018.
 */
Ext.define('Idsr.view.userloginlogs.UserLoginLogs', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Idsr.view.userloginlogs.UserLoginLogsModel',
		'Idsr.view.userloginlogs.UserLoginLogsController'
    ],
    xtype: 'userloginlogs',
    viewModel: {
        type: 'userloginlogs'
    },

    controller: 'userloginlogs',

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
                                    xtype: 'combobox',
                                    flex: 1,
                                    name:'success',
                                    reference:'successFilter',
                                    fieldLabel: 'Status',
                                    store: [
                                        [
                                            'true',
                                            'Success'
                                        ],
                                        [
                                            'false',
                                            'Failed'
                                        ]
                                    ]
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
            title: 'User Log in Logs',
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
                        text: 'Entered email',
                        flex:1,
                        dataIndex: 'entered_email'
                    },
                    {
                        text: 'Status',
                        dataIndex: 'success',
                        renderer: function (value, meta) {
                            if (value) {
                                meta.style = "background-color:green;color:white;";
                                return 'Successful';
                            }else{
                                meta.style = "background-color:red;color:white;";
                                return 'Failed';
                            }
                        }
                    },
                    {
                        text: 'IP Address',
                        dataIndex: 'ip_address',
                        flex:1
                    },
                    {
                        xtype: 'datecolumn',
                        text: 'Time',
                        dataIndex: 'login_time',
                        format: 'Y-m-d H:i:s',
                        flex:1
                    }

                ]

            }
        }
    ]
});