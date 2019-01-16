Ext.define('Idsr.store.NavigationTree', {
    extend: 'Ext.data.TreeStore',

    storeId: 'NavigationTree',

    fields: [
        {name: 'text'}
    ],

    root: {
        expanded: true,
        children: [
            {
                text: 'Dashboard',
                iconCls: 'x-fa fa-desktop',
                viewType: 'admindashboard',
                routeId: 'dashboard',
                leaf: 'true'
            },
            {
                text: 'User Setup',
                iconCls: 'x-fa fa-users',
                expanded: true,
                selectable: false,
                children: [
                    {
                        text: 'User Setup',
                        iconCls: 'x-fa fa-user',
                        viewType: 'users',
                        routeId: 'users',
                        leaf: true
                    },
                    {
                        text: 'Roles & Permissions',
                        iconCls: 'x-fa fa-key',
                        viewType: 'roles',
                        routeId: 'roles',
                        leaf: true
                    }
                ]
            },
            {
                text: 'Template Configuration',
                iconCls: 'x-fa fa-key',
                viewType: 'notificationtemplates',
                routeId: 'emailtemplate',
                leaf: true
            },
            {
                text: 'Weekly Epidemic Data',
                iconCls: 'x-fa fa-list',
                expanded: true,
                selectable: false,
                children:[
                    {
                        text: 'Records',
                        iconCls: 'x-fa fa-database',
                        viewType: 'weeklyepidemichistoricrecords',
                        routeId: 'records',
                        leaf: true
                    },
                    {
                        text: 'Import Results',
                        iconCls: 'x-fa fa-download',
                        viewType: 'weeklyepidemicdataimportresults',
                        routeId: 'importresults',
                        leaf: true
                    }
                ]
            },
            {
                text: 'Threshold Results',
                iconCls: 'x-fa fa-search',
                viewType: 'malariathresholdcomputationresults',
                routeId: 'malariaresults',
                leaf: true
            },
            {
                text: 'Calculate Thresholds',
                iconCls: 'x-fa fa-calculator',
                viewType: 'malariacalculatethreshold',
                routeId: 'malariacalculatethreshold',
                leaf: true
            },
            {
                text: 'Threshold Map',
                iconCls: 'x-fa fa-map',
                viewType: 'malariathresholdmap',
                routeId: 'malariathresholdmap',
                leaf: true
            },
            {
                text: 'Thresholds Tracking',
                iconCls: 'x-fa fa-line-chart',
                viewType: 'malariathresholdtracker',
                routeId: 'malariathresholdtracker',
                leaf: true
            },
            {
                text: 'Chart Builder',
                iconCls: 'x-fa fa-bar-chart',
                viewType: 'malariavisualbuilder',
                routeId: 'malariavisualbuilder',
                leaf: true
            },
            {
                text: 'Logs',
                iconCls: 'x-fa fa-clock-o',
                expanded: true,
                selectable: false,
                children: [
                    {
                        text: 'Event Log',
                        iconCls: 'x-fa fa-calendar',
                        viewType: 'usereventlogs',
                        routeId: 'usereventlogs',
                        leaf: true
                    },
                    {
                        text: 'Login Logs',
                        iconCls: 'x-fa fa-unlock',
                        viewType: 'userloginlogs',
                        routeId: 'userloginlogs',
                        leaf: true
                    }
                ]
            },
            {
                text: 'Profile',
                iconCls: 'x-fa fa-key',
                viewType: 'profile',
                routeId: 'profile',
                leaf: true
            }
        ]
    }
});