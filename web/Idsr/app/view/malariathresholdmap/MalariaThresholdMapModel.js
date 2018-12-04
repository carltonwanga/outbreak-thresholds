/**
 * Created by PAVILION 15 on 10/29/2018.
 */
Ext.define('Idsr.view.malariathresholdmap.MalariaThresholdMapModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.malariathresholdmap',

    stores: {
        currentSubCountyThresholds:{
            fields:['id','sub_county','county_name','cases_reported','alert_threshold','action_threshold','inference_id','inference_name','alert_color_codes'],
            autoLoad: false

        }
    },

    data: {
       detailViewPanel:'Click Map to View Details',
        weekThresholdData:null,
        selectedCounty:null
    }
});