/**
 * Created by PAVILION 15 on 2/20/2019.
 */
Ext.define('Idsr.view.surveyconfiguration.SurveyConfigurationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.surveyconfiguration',

    /**
     * Called when the view is created
     */
    init: function() {

        this.lookupReference("editSurveyBtn").hide();
        this.lookupReference("changeSurveyStatusBtn").hide();
        this.lookupReference("configureQuestionsBtn").hide();
    },
    showView: function(view) {
        var layout = this.getReferences().display.getLayout();
        layout.setActiveItem(this.lookupReference(view));
    },

    select: function(rowmodel, record, index, eOpts) {
        var theController = this;
        // Set selected record
        this.getViewModel().set('record', record);
        // Show details
        this.showView('details');


    },
    save: function(button, e, eOpts) {
        var me = this;
        var form = this.getReferences().form.getForm(),
            record = form.getRecord(),
            store = this.getStore('surveys');

        // Valid
        if (form.isValid()) {

            // Ask user to confirm this action
            Ext.Msg.confirm('Confirm Saving', 'Are you sure you want to save?', function(result) {

                // User confirmed yes
                if (result == 'yes') {

                    // Update associated record with values
                    form.updateRecord();
                    var requestMethod = '';
                    var requestUrl = '';

                    // Add to store if new record
                    if (record.phantom) {
                        requestMethod = 'POST';
                        requestUrl = Idsr.util.Constants.controllersApiFromIndex+"/surveyconfig/";
                        form.submit({
                            url:requestUrl,
                            waitMsg:'Saving...',
                            method:requestMethod,
                            success: function (form, action) {
                                Ext.Msg.alert('Success', action.result.message);
                                store.reload();
                                //me.createDialog(record);
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                            }
                        });
                    }else{
                        requestMethod = 'POST';
                        requestUrl = Idsr.util.Constants.controllersApiFromIndex+"/surveyconfig/"+record.get("id");
                        form.submit({
                            url:requestUrl,
                            waitMsg:'Saving...',
                            method:requestMethod,
                            success: function (form, action) {
                                Ext.Msg.alert('Success', action.result.message);
                            },
                            failure: function (form, action) {
                                Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                            }
                        });

                    }
                }
            });

            // Display record
            this.select(this, record);

        }
    },
    cancelEdit: function(button, e, eOpts) {
        // Show details
        this.showView('details');
    },
    add: function(button, e, eOpts) {
        var formPanel = this.getReferences().form,
            form = formPanel.getForm(),
            newRecord = Ext.create('model.surveyconfig');

        // Clear form
        form.reset();

        // Set record
        form.loadRecord(newRecord);

        // Set title
        formPanel.setTitle('Add Survey');

        // Show form
        this.showView('form');
    },
    onChangeSurveyStatus:function(){
        var me = this;
        var currentStatusAction = this.getViewModel().get('record').get('is_active')?"Deactivate":"Activate";
        var newStatus = this.getViewModel().get('record').get('is_active')?false:true;
        var currentSurveyId = me.getViewModel().get('record').get("id");
        var surveyRecord  = me.getViewModel().get('record');
        var surveyName = surveyRecord.get("title");

        Ext.Msg.confirm('Confirm', 'Are you sure you want to '+currentStatusAction+" Survey ?", function(result) {
            if (result == 'yes') {
                me.getView().mask('Loading... Please wait...');
                Ext.Ajax.request({
                    url: Idsr.util.Constants.controllersApiFromIndex+"/surveyconfig/changestatus",
                    params:{
                        surveyId:currentSurveyId,
                        status:newStatus
                    },
                    method:"POST",
                    success: function(response, opts) {
                        me.getView().unmask();
                        var responseData = Ext.JSON.decode(response.responseText);
                        var status = responseData.status;
                        if(status == 1){
                            Ext.Msg.alert("Success","The survey has successfully been "+currentStatusAction+"d");
                            surveyRecord.set('is_active',newStatus);
                            var newSurveyRecord = Ext.create('Idsr.model.SurveyConfig',surveyRecord.data);
                            me.getViewModel().set('record', newSurveyRecord);

                        }else{
                            Ext.Msg.alert("Error","Could not "+currentStatusAction+" survey");
                        }

                    },

                    failure: function(response, opts) {
                        me.getView().unmask();
                        Ext.Msg.alert("Error","Could not change survey status");
                    }
                });

            }

        });

    },
    edit: function(button, e, eOpts) {
        var formPanel = this.getReferences().form,
            form = formPanel.getForm(),
            record = this.getViewModel().get('record');

        // Load record model into form
        form.loadRecord(record);

        // Set title
        formPanel.setTitle('Edit Survey');

        // Show form
        this.showView('form');
    },

    configureQuestions:function(){
        var me = this;
        this.showView('questionsConfigPanel');

        var recordId = this.getViewModel().get('record').id;
        var menuUrl = Idsr.util.Constants.controllersApiFromIndex+"/surveyconfig/questions/"+recordId;
        me.getView().mask('Loading... Please wait...');
        Ext.Ajax.request({
            url: menuUrl,
            method:"GET",
            success: function(response, opts) {
                me.getView().unmask();
                var responseData = Ext.JSON.decode(response.responseText);
                console.log(responseData);
                var status = responseData.status;
                if(status == 1){
                    var menuRoot = responseData.data;
                    var theNavigationMenu = me.lookupReference("questionsConfigPanel");
                    var adminStore = Ext.create('Idsr.store.SurveyQuestionsStore');

                    adminStore.setRoot(menuRoot);
                    theNavigationMenu.setConfig('store',adminStore);

                }else{

                }

            },

            failure: function(response, opts) {
                me.getView().unmask();

            }
        });

    },
    addQuestion:function(){
        var theViewController = this;
        Ext.create('Ext.window.Window',{
            width: 400,
            layout: {
                type: 'fit'
            },
            iconCls: 'fa fa-pencil fa-lg',
            title:'New Survey Question',
            items: [
                {
                    xtype: 'form',
                    reference: 'form',
                    bodyPadding: 3,
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Question',
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'survey_id',
                                    hidden: 'true',
                                    fieldLabel: 'Survey Id'
                                },
                                {
                                    name: 'question_narrative',
                                    xtype: 'textarea',
                                    anchor: '100%',
                                    allowBlank: false,
                                    minLength: 3,
                                    fieldLabel: 'Narrative'
                                },
                                {
                                    name: 'notes',
                                    xtype: 'textarea',
                                    anchor: '100%',
                                    allowBlank: false,
                                    minLength: 3,
                                    fieldLabel: 'Notes'

                                },
                                {
                                    xtype: "combobox",
                                    fieldLabel: 'Response Type',
                                    anchor: '100%',
                                    pickerId:'sccQuestionResCombo',
                                    valueField: 'id',
                                    store: Ext.create('Ext.data.Store', {
                                        fields:['id','name'],
                                        autoLoad: true,
                                        proxy: {
                                            type: 'rest',
                                            reader: {
                                                type: 'json',
                                                rootProperty: 'data'
                                            },
                                            url: Idsr.util.Constants.controllersApiFromIndex+"/surveyconfig/responsetypes"
                                        }
                                    }),
                                    reference:'responseTypesCombo',
                                    displayField: 'name',
                                    name:'expected_response_type',
                                    listConfig: {
                                        loadingText: 'Searching...',
                                        emptyText: 'No records found'
                                    },
                                    flex:1,
                                    allowBlank: false,
                                    pageSize: 20,
                                    listeners: {
                                        select: this.onResponseTypeSelect
                                    }

                                }

                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Condition',
                            items:[
                                {
                                    xtype: "combobox",
                                    fieldLabel: 'Condition',
                                    anchor: '100%',
                                    pickerId:'sccQuestionConditionCombo',
                                    valueField: 'id',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['id', 'condition_narration'],
                                        autoLoad: false
                                    }),
                                    reference:'sccConditionsCombo',
                                    itemId:'sccConditionsCombo',
                                    displayField: 'condition_narration',
                                    name:'condition_id',
                                    listConfig: {
                                        loadingText: 'Searching...',
                                        emptyText: 'No records found'
                                    },
                                    flex:1,
                                    allowBlank: false,
                                    pageSize: 20,
                                    listeners: {
                                        select: this.onResponseTypeSelect
                                    }

                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    fieldLabel: 'Value',
                                    name:'condition_value'
                                }

                            ]

                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'bottom',
                            items: [
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'fa fa-times fa-lg',
                                    text: 'Cancel',
                                    handler: function(button, e, eOpts) {
                                        var theForm = button.up('form');
                                        theForm.getForm().reset();
                                        button.up('window').close();

                                    }

                                },
                                {
                                    xtype: 'button',
                                    itemId: 'submit',
                                    formBind: true,
                                    iconCls: 'fa fa-sign-in fa-lg',
                                    text: 'Submit',
                                    handler: function (button, e, eOpts) {
                                        var theForm = button.up('form');
                                        theForm.mask('Saving..', 'Please Wait');
                                        theForm.submit({
                                            url: Tarms.util.Constants.apiFromIndex+'/surveyconfig/questions',
                                            success: function (form, action) {
                                                theForm.unmask();
                                                var responseData = Ext.JSON.decode(action.response.responseText);
                                                if (responseData.status == 1) {
                                                    Ext.Msg.alert('Success', "Record saved");
                                                    theForm.up('window').close();
                                                } else {
                                                    Ext.Msg.alert('Error', "Could not Save Record");
                                                }
                                            },
                                            failure: function (form, action) {
                                                theForm.unmask();
                                                switch (action.failureType) {
                                                    case Ext.form.action.Action.CLIENT_INVALID:
                                                        Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                                                        break;
                                                    case Ext.form.action.Action.CONNECT_FAILURE:
                                                        Ext.Msg.alert('Failure', 'Network communication failed');
                                                        break;
                                                    case Ext.form.action.Action.SERVER_INVALID:
                                                        Ext.Msg.alert('Failure', action.result.msg);
                                                }
                                            }

                                        });

                                    }
                                }
                            ]
                        }
                    ]
                }
            ]

        }).show();

    },
    onResponseTypeSelect:function (combo) {
        var selectedResponseType = combo.getValue();
        var conditionsCombo = combo.up('window').down("#sccConditionsCombo");
        console.log(selectedResponseType);
        var conditionsUrl = Idsr.util.Constants.controllersApiFromIndex+'/surveyconfig/conditions/'+selectedResponseType;
        var conditionsStore = conditionsCombo.store;
        conditionsStore.setConfig('proxy',{
            type: 'rest',
                reader: {
                type: 'json',
                    rootProperty: 'data'
            },
            url: conditionsUrl
        });
        conditionsStore.reload();


    }
});