/**
 * Created by PAVILION 15 on 11/27/2018.
 */
Ext.define('Idsr.view.malariavisualbuilder.MvbScatterChartSeriesConfig', {
    extend: 'Ext.Container',
    xtype: 'mvbscatterchartseriesconfig',
    items: [
        {
            xtype: 'fieldset',
            title:'Label',
            itemId:'labelFieldSet',
            items:[
                {
                    xtype:'combobox',
                    queryMode: 'local',
                    fieldLabel:'Display',
                    value: 'over',
                    itemId: 'mvbsLabelDisplayPicker',
                    store: [['under','Under'],['over','Over'],['rotate','Rotate']]
                },
                {
                    xtype: 'colorfield',
                    fieldLabel:'Color',
                    name:'color',
                    itemId: 'mvbsLabelColorPicker',
                    value: '#000'


                }
            ]
        },
        {
            xtype:'form',
            itemId: 'mvbsMarkerForm',
            items:[
                {
                    xtype: 'fieldset',
                    title:'Marker',
                    itemId:'markerFieldSet',
                    items:[
                        {
                            xtype: 'numberfield',
                            name:'lineWidth',
                            fieldLabel: 'Line Width',
                            minValue: 1,
                            maxValue: 10,
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            name:'radius',
                            fieldLabel: 'Radius',
                            minValue: 1,
                            maxValue: 30,
                            allowBlank: false
                        }

                    ]

                }

            ]
        },
        {
            xtype: 'form',
            itemId: 'mvbsHighlightForm',
            items:[
                {
                    xtype: 'fieldset',
                    title:'Highlight',
                    itemId:'highlightFieldSet',
                    items:[
                        {
                            xtype: 'colorfield',
                            fieldLabel:'Fill Color',
                            name:'fill'
                        },
                        {
                            xtype: 'colorfield',
                            fieldLabel:'Stroke Color',
                            name:'stroke'
                        },
                        {
                            xtype: 'numberfield',
                            name:'radius',
                            fieldLabel: 'Radius',
                            minValue: 1,
                            maxValue: 35,
                            allowBlank: false
                        },
                        {
                            xtype: 'numberfield',
                            name:'size',
                            fieldLabel: 'Size',
                            minValue: 1,
                            maxValue: 35,
                            allowBlank: false
                        }

                    ]

                }

            ]
        }

    ]
});