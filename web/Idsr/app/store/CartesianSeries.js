/**
 * Created by PAVILION 15 on 11/23/2018.
 */
Ext.define('Idsr.store.CartesianSeries', {
    extend: 'Ext.data.Store',
    storeId: 'cartesianseriesconfigstore',
    fields:['value','name'],
    data : [
        {value: 'bar', name: 'Bar'},
        {value: 'line', name: 'Line'},
        {value: 'scatter', name: 'Scatter'}
    ]
});