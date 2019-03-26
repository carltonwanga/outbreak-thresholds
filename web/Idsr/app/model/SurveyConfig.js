/**
 * Created by PAVILION 15 on 2/21/2019.
 */
Ext.define('Idsr.model.SurveyConfig', {
    extend: 'Ext.data.Model',
    alias: 'model.surveyconfig',

    fields:['id','disease','title','notes','is_active','configuration_complete','disease_name']

});