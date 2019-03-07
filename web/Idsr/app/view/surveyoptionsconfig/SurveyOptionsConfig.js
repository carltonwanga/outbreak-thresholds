/**
 * Created by PAVILION 15 on 2/21/2019.
 */
Ext.define('Idsr.view.surveyoptionsconfig.SurveyOptionsConfig', {
    extend: 'Ext.Container',

    requires: [
        'Idsr.view.surveyoptionsconfig.SurveyOptionsConfigModel',
		'Idsr.view.surveyoptionsconfig.SurveyOptionsConfigController'
    ],

    /*
    Uncomment to give this component an xtype
    xtype: 'surveyoptionsconfig',
    */

    viewModel: {
        type: 'surveyoptionsconfig'
    },

    controller: 'surveyoptionsconfig',

    items: [
        /* include child components here */
    ]
});