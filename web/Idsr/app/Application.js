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
        'SurveyQuestionsStore',
        'County',
        'SubCounty',
        'ThresholdInferences',
        'CartesianSeries',
        'IdentificationType',
        'Disease',
        'Routes'
    ],
    views: [
        'Idsr.view.malariacalculatethreshold.MalariaCalculateThreshold',
        'Idsr.view.malariathresholdcomputationresults.MalariaThresholdComputationResults',
        'Idsr.view.malariathresholdmap.MalariaThresholdMap',
        'Idsr.view.malariathresholdtracker.MalariaThresholdTracker',
        'Idsr.view.malariavisualbuilder.MalariaVisualBuilder',
        'Idsr.view.weeklyepidemicdataimportresults.WeeklyEpidemicDataImportResults',
        'Idsr.view.malariavisualbuilder.MalariaVisualBuilder',
        'Idsr.view.weeklyepidemichistoricrecords.WeeklyEpidemicHistoricRecords',
        'Idsr.view.emailtemplate.EmailTemplate',
        'Idsr.view.login.Login',
        'Idsr.view.users.Users',
        'Idsr.view.roles.Roles',
        'Idsr.view.usereventlogs.UserEventLogs',
        'Idsr.view.userloginlogs.UserLoginLogs',
        'Idsr.view.meningitisthresholdcomputationresults.MeningitisThresholdComputationResults',
        'Idsr.view.meningitisthresholdtracker.MeningitisThresholdTracker',
        'Idsr.view.meningitisthresholdcomputationresults.MeningitisThresholdComputationResults',
        'Idsr.view.surveyconfiguration.SurveyConfiguration',
        'Idsr.view.surveyoptionsconfig.SurveyOptionsConfig',
        'Idsr.view.subcountyconfig.SubCountyConfig'



    ],
    
    launch: function () {
        Ext.Ajax.request({
            url:Idsr.util.Constants.controllersApiFromIndex+'/auth/isloggedin',
            method:"GET",
            success: function(response, opts) {
                var responseData = Ext.JSON.decode(response.responseText);
                if(responseData.status == 1){
                    var theUser = responseData.data;
                    var theMainView = Ext.create('Idsr.view.main.Main');
                    theMainView.getViewModel().set('userDetails',theUser);
                    theMainView.getController().onUpdateNavigationStore();
                }else{
                    Ext.widget('login');
                }
            },
            failure: function(response, opts) {
                Ext.widget('login');
            }
        });


        Ext.Ajax.on({
            requestexception: function(dataconn, response, options) {

                if (response.status === 401) {

                    Ext.Msg.alert('Error', 'Authentication Error, Please Log in again');
                    var task = new Ext.util.DelayedTask(function() {
                        var rootUrl = Idsr.util.Constants.rootUrl;

                        var requestUrl = response.request.url;
                        if(requestUrl != Idsr.util.Constants.signInUrl){
                            window.location.assign(rootUrl);
                        }
                    });
                    task.delay(500);

                }else if (response.status === 403) {
                    //me.redirectTo('/admin');
                    Ext.Msg.alert('Error', 'The current user does not have permission to execute the operation');
                    var task = new Ext.util.DelayedTask(function() {
                        var rootUrl = Idsr.util.Constants.rootUrl;
                        //window.location.assign(rootUrl);
                    });
                    task.delay(500);

                }
            }
        });
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
