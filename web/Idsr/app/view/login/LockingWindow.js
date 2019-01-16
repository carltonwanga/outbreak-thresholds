/**
 * Created by Micah on 22/03/2018.
 */
Ext.define('Idsr.view.login.LockingWindow', {
    extend: 'Ext.window.Window',
    xtype: 'lockingwindow',

    requires: [
        'Ext.layout.container.VBox',
        'Idsr.view.login.LoginController'
    ],

    cls: 'auth-locked-window',
    closable: false,
    resizable: false,
    autoShow: true,
    titleAlign: 'center',
    maximized: true,
    modal: true,
    scrollable: true,
    bodyPadding: '80 0',
    reference: 'locking-window',
    onEsc: Ext.emptyFn,

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    controller: 'login'
});