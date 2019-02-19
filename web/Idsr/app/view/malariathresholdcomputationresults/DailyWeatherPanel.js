/**
 * Created by PAVILION 15 on 2/11/2019.
 */
Ext.define('Idsr.view.malariathresholdcomputationresults.DailyWeatherPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'dailyweatherpanel',
    scrollable: true,
    items: [
        {
            xtype: 'fieldset',
            title:'Summary',
            items:[
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Status',
                    bind:{
                        value: '{currentWeekWeather.summary}'
                    }
                },
                {
                    xtype: 'container',
                    bind: {
                        html:'<img src="{iconurl}">'
                    }
                }

            ]
        },
        {
            xtype: 'fieldset',
            title:'Rainfall',
            items:[
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Probability',
                    bind:{
                        value: '{currentWeekWeather.precipProbability }'
                    }
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Intensity',
                    bind:{
                        value: '{currentWeekWeather.precipIntensity} Millimeters/Hour'
                    }
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Max Precipitation Intensity',
                    bind:{
                        value: '{currentWeekWeather.precipIntensityMax} Millimeters/Hour'
                    }
                }

            ]
        },
        {
            xtype: 'fieldset',
            title:'Temperature',
            items:[
                {
                    xtype: 'displayfield',
                    fieldLabel: 'High Temperature',
                    bind:{
                        value: '{currentWeekWeather.temperatureHigh} °C'
                    }
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Max Temp for the Day',
                    bind:{
                        value: '{currentWeekWeather.temperatureMax} °C'
                    }
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Low Temperature',
                    bind:{
                        value: '{currentWeekWeather.temperatureLow} °C'
                    }
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Min Temp for the Day',
                    bind:{
                        value: '{currentWeekWeather.temperatureMin } °C'
                    }
                }

            ]
        },
        {
            xtype: 'fieldset',
            title:'Humidity',
            items:[
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Humidity',
                    bind:{
                        value: '{currentWeekWeather.humidity}'
                    }
                }

            ]
        }
    ]
});