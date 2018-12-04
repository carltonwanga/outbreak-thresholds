/**
 * Created by PAVILION 15 on 10/16/2018.
 */
Ext.define('Idsr.view.weeklyepidemicdataimportresults.WeeklyEpidemicDataImportResults', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.toolbar.Separator',
        'Idsr.view.weeklyepidemicdataimportresults.WeeklyEpidemicDataImportResultsController',
        'Idsr.view.weeklyepidemicdataimportresults.WeeklyEpidemicDataImportResultsModel'
    ],
    xtype: 'weeklyepidemicdataimportresults',

    viewModel: {
        type: 'weeklyepidemicdataimportresults'
    },
    controller: 'weeklyepidemicdataimportresults',
    height: 500,
    shrinkWrap: 0,
    layout: 'border',
    title: 'Historical Batch Import Results',
    bodyPadding: 10,
    margin:'10 5 10 5',


    items: [
        {
            xtype: 'gridpanel',
            flex: 1,
            region: 'center',
            split: true,
            resizable: false,
            forceFit: true,
            bind:{
                store: '{batchResults}'
            },
            title:"Batch import results",
            reference:'batchGrid',
            height:500,
            columns:[
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'id',
                    text: 'Batch ID'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'time_imported',
                    text: 'Time Imported'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'total_inserted',
                    text: 'Total Imported'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'total_updated',
                    text: 'Total Updated'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'total_errors',
                    text: 'Total Errors'
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
                    store: '{batchResults}'
                },
                displayInfo: true,
                displayText: 'Displaying record {0} - {1} of {2}',
                emptyText: 'No records to display'
            }),
            tbar:{
                xtype: 'toolbar',
                items:[
                    '->',
                    {
                        xtype: 'numberfield',
                        hideTrigger: true,
                        width: 200,
                        reference:'searchfield',
                        name: 'query',
                        emptyText: 'Search By Batch Id',
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
        },
        {
            xtype: 'gridpanel',
            title: 'Batch Errors',
            forceFit: true,
            flex: 1,
            split: true,
            resizable: false,
            region: 'east',
            height:500,
            width: 150,
            bind:{
                store: '{batchErrors}'
            },
            columns:[
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'id',
                    text: 'ID',
                    hidden:true
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'error_code',
                    text: 'Error Code'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'narration',
                    flex:1,
                    text: 'Narration'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'row_number',
                    text: 'Row Number'
                },
                {
                    xtype: 'gridcolumn',
                    dataIndex: 'column_number',
                    text: 'Column Number'
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                dockedItems: [{
                    xtype: 'toolbar'
                }],
                bind: {
                    store: '{batchErrors}'
                },
                displayInfo: true,
                displayText: 'Displaying record {0} - {1} of {2}',
                emptyText: 'No records to display'
            })
        }


    ]
});