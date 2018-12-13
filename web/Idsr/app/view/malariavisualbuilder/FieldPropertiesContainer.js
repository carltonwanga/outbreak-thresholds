/**
 * Created by PAVILION 15 on 11/23/2018.
 */
Ext.define('Idsr.view.malariavisualbuilder.FieldPropertiesContainer', {
    extend: 'Ext.panel.Panel',
    xtype: 'fieldpropertiescontainer',
    scrollable: true,
    items: [
        {
            xtype:'combobox',
            queryMode: 'local',
            margin: '5 3 3 3',
            allowBlank: false,
            fieldLabel: 'Y Axis Location',
            name:'yAxisLocation',
            itemId:'yAxisLocationCombo',
            value:'left',
            store: [['left','Left'],['right','Right']]
        },
        {
            xtype:'combobox',
            queryMode: 'local',
            fieldLabel: 'Series',
            margin: '5 3 3 3',
            allowBlank: false,
            displayField: 'name',
            valueField: 'value',
            name:'seriesType',
            itemId:'seriesType',
            store: 'cartesianseriesconfigstore',
            listeners: {
                select: 'onSeriesConfigSelect'
            }
        },
        {
            xtype:'container',
            itemId: 'seriesConfigContainer'
        }
    ]
});