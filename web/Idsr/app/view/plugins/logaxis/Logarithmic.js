/**
 * Created by PAVILION 15 on 12/4/2018.
 */
Ext.define('Idsr.view.plugins.logaxis.Logarithmic', {
    extend: 'Ext.chart.axis.Numeric',

    requires: [
        'Idsr.view.plugins.logaxis.layout.Logarithmic',
        'Idsr.view.plugins.logaxis.segmenter.Logarithmic'
    ],

    type: 'logarithmic',
    alias: [
        'axis.logarithmic',
    ],
    config: {
        layout: 'logarithmic',
        segmenter: 'logarithmic',
    }
});