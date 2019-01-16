/**
 * Created by PROBOOK 450 on 9/18/2016.
 */
Ext.define('Idsr.view.login.CapsLockTooltip', {
    extend: 'Ext.tip.QuickTip',
    xtype: 'capslocktooltip',
    target: 'password',
    anchor: 'top',
    anchorOffset: 0,
    width: 300,
    dismissDelay: 0,
    autoHide: false,
    title: '<div class="fa fa-exclamation-triangle">'+ 'CapsLock' + '</div>',
    html: '<div>'+ 'CapsLock' +
    ' On' + '</div><br/>' +
    '<div>'+'The CapsLock key has been turned on' + '</div>'

});