/**
 * Created by PAVILION 15 on 12/4/2018.
 */
Ext.define('Idsr.view.plugins.logaxis.segmenter.Logarithmic', {
    extend: 'Ext.chart.axis.segmenter.Numeric',
    alias: 'segmenter.logarithmic',
    config: {
        minimum: 200
    },

    renderer: function (value, context) {
        return (Math.pow(10, value)).toFixed(3);
    }
});