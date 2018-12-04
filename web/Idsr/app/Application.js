/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Idsr.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Idsr.*'
    ],
    
    name: 'Idsr',

    stores: [
        'NavigationTree',
        'County',
        'SubCounty',
        'ThresholdInferences',
        'CartesianSeries'
    ],
    views: [
        'Idsr.view.malariacalculatethreshold.MalariaCalculateThreshold',
        'Idsr.view.malariathresholdcomputationresults.MalariaThresholdComputationResults',
        'Idsr.view.malariathresholdmap.MalariaThresholdMap',
        'Idsr.view.malariathresholdtracker.MalariaThresholdTracker',
        'Idsr.view.malariavisualbuilder.MalariaVisualBuilder',
        'Idsr.view.weeklyepidemicdataimportresults.WeeklyEpidemicDataImportResults',
        'Idsr.view.malariavisualbuilder.MalariaVisualBuilder',
        'Idsr.view.weeklyepidemichistoricrecords.WeeklyEpidemicHistoricRecords'
    ],
    
    launch: function () {
        // TODO - Launch the application
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
