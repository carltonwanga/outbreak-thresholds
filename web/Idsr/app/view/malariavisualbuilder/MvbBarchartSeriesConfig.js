/**
 * Created by PAVILION 15 on 11/23/2018.
 */
Ext.define('Idsr.view.malariavisualbuilder.MvbBarchartSeriesConfig', {
    extend: 'Ext.Container',
    xtype: 'mvbbarchartseriesconfig',
    items: [
        {
            xtype: 'fieldset',
            title:'Highlight',
            itemId:'highlightFieldSet',
            items:[
                {
                    xtype: 'colorfield',
                    fieldLabel:'Fill Style',
                    name:'fillStyle',
                    itemId:'mvbFillStyle'
                },
                {
                    xtype: 'colorfield',
                    fieldLabel:'Stroke Style',
                    name:'strokeStyle',
                    itemId:'mvbStrokeStyle'

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
                    value: 'insideEnd',
                    itemId:'mvbLabelDisplayPicker',
                    store: [['insideStart','Inside Start'],['insideEnd','Inside End'],['outside','Outside'],['none','Hide']]
                },
                {
                    xtype: 'colorfield',
                    fieldLabel:'Color',
                    itemId:'mvbLabelColorPicker',
                    name:'color',
                    value: '#000'


                }
            ]
        }
    ]
});