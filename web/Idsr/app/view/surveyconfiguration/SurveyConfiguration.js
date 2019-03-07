/**
 * Created by PAVILION 15 on 2/20/2019.
 */
Ext.define('Idsr.view.surveyconfiguration.SurveyConfiguration', {
    extend: 'Ext.Container',

    requires: [
        'Idsr.view.surveyconfiguration.SurveyConfigurationModel',
		'Idsr.view.surveyconfiguration.SurveyConfigurationController'
    ],

    /*
    Uncomment to give this component an xtype
    xtype: 'surveyconfiguration',
    */

    viewModel: {
        type: 'surveyconfiguration'
    },

    controller: 'surveyconfiguration',

    items: [
        /* include child components here */
    ]
});