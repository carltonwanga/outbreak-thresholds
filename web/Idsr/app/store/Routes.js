Ext.define('Idsr.store.Routes', {
    extend: 'Ext.data.Store',

    alias: 'store.routeStore',
    fields:[
        {
            type: 'string',
            name: 'route'
        }
    ],

    data: [
        {route: 'login'},
        {route: 'register'},
        {route: 'passwordreset'},
        {route: 'lockscreen'},
        {route: 'errorpage'}
    ]

});