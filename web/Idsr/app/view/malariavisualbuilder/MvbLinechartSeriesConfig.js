/**
 * Created by PAVILION 15 on 11/23/2018.
 */
Ext.define('Idsr.view.malariavisualbuilder.MvbLinechartSeriesConfig', {
    extend: 'Ext.Container',
    xtype: 'mvblinechartseriesconfig',
    items: [
        {
            xtype: 'fieldset',
            title:'Style',
            items:[
                {
                    xtype: 'numberfield',
                    name:'lineWidth',
                    fieldLabel: 'Line Width',
                    itemId:'mvblLineWidth',
                    minValue: 1,
                    maxValue: 10,
                    value: 2,
                    allowBlank: false
                },
                {
                    xtype: 'colorfield',
                    fieldLabel:'Stroke Color',
                    itemId:'mvblStrokeColor',
                    name:'stroke'
                },
                {
                  xtype: 'container',
                  layout: 'hbox',
                  items:[
                      {
                          xtype: 'checkbox',
                          fieldLabel: 'Fill',
                          labelWidth: 60,
                          margin: '0 5 0 0',
                          itemId:'mvblFillCheck',
                          value: false
                      },
                      {
                          xtype: 'colorfield',
                          fieldLabel:'Fill Color',
                          itemId:'mvblFillColor',
                          name:'fill'
                      }

                  ]
                },
                {
                    xtype: 'slider',
                    width: 200,
                    fieldLabel: 'Opacity',
                    name:'fillOpacity',
                    itemId:'mvblFillOpacity',
                    value: 0.6,
                    increment: 0.1,
                    decimalPrecision: false,
                    minValue: 0.1,
                    maxValue: 0.9
                }


            ]
        },
        {
            xtype: 'fieldset',
            title: 'Marker',
            items:[
                {
                    xtype:'combobox',
                    queryMode: 'local',
                    fieldLabel:'Display',
                    value: 'none',
                    itemId:'mvblMarker',
                    store: [['none','None'],['circle','Circle'],['square','Square'],['triangle','Triangle'],['arrow','Arrow'],['cross','Cross']]
                }
            ]
        },
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
                    itemId: 'mvblLabelDisplayPicker',
                    store: [['under','Under'],['over','Over'],['rotate','Rotate'],['none','Hide']]
                },
                {
                    xtype: 'colorfield',
                    fieldLabel:'Color',
                    name:'color',
                    itemId: 'mvblLabelColorPicker',
                    value: '#000'


                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Curve',
            items:[
                {
                    xtype:'combobox',
                    queryMode: 'local',
                    fieldLabel:'Smooth',
                    itemId:'lineSmoothCombo',
                    value: false,
                    store: [[false,'False'],[true,'True']]
                }
            ]
        }
    ]
});