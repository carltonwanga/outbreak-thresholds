/**
 * Created by PAVILION 15 on 11/27/2018.
 */
Ext.define('Idsr.view.malariavisualbuilder.XAxisPropertiesContainer', {
    extend: 'Ext.Container',
    xtype: 'xaxispropertiescontainer',
    scrollable: true,

    items: [
        {
            xtype:'fieldset',
            title:'Title',
            items:[
                {
                    xtype: 'textfield',
                    fieldLabel: 'Title',
                    name:'text',
                    itemId:'mvbxTitleText',
                    bind:{
                        value:'{xAxisTitle}'
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Font Size',
                    itemId:'mvbxTitleFontSize',
                    value: 11,
                    minValue: 5,
                    maxValue: 100,
                    name:'fontSize'

                }
            ]
        },
        {
            xtype:'fieldset',
            title:'Axis Config',
            items:[
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Minimum',
                    value: 0,
                    itemId: 'mvbxMinimum',
                    name:'minimum'

                },
                {
                    xtype: 'checkbox',
                    fieldLabel: 'Show Grid',
                    itemId: 'mvbxGridCheck',
                    name:'grid',
                    value: true

                }
            ]
        },
        {
            xtype:'fieldset',
            title:'Label',
            items:[
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Font Size',
                    value: 15,
                    minValue: 5,
                    maxValue: 100,
                    itemId:'mvbxLabelFontSize',
                    name:'fontSize'
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items:[
                        {
                            xtype: 'checkbox',
                            fieldLabel: 'Rotate',
                            name:'rotation',
                            labelWidth: 50,
                            itemId:'mvbxRotationCheck',
                            bind:{
                                value: '{xAxisRotate}'
                            }

                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: 'Degrees',
                            name:'degrees',
                            labelWidth: 50,
                            margin: '0 0 0 4',
                            minValue: -360,
                            itemId:'mvbxDegrees',
                            maxValue: 360,
                            bind:{
                              hidden: '{!xAxisRotate}'
                            },
                            value: 0
                        }
                    ]
                }
            ]

        }


    ]
});