/**
 * Created by PAVILION 15 on 2/27/2019.
 */
Ext.define('Idsr.store.SurveyQuestionsStore', {
    extend: 'Ext.data.TreeStore',
    storeId: 'SurveyQuestionsStore',

    fields: [
        'id','survey_id','question_narrative','expected_response_type','expected_response_name','notes','condition_id','condition_name','condition_narration','condition_value','is_active'
    ],

    root: {
        expanded: true,
        children: [

        ]
    }

    });