/**
 * Created by PAVILION 15 on 1/9/2019.
 */
Ext.define('Idsr.view.login.Login', {
    extend: 'Idsr.view.login.LockingWindow',

    requires: [
        'Idsr.view.login.LoginModel',
		'Idsr.view.login.LoginController'
    ],
    title: 'Log In',
    defaultFocus: 'authdialog', // Focus the Auth Form to force field focus as well

    xtype: 'login',

    viewModel: {
        type: 'login'
    },

    controller: 'login',

    items: [
        {
            xtype: 'authdialog',
            reference: 'form',
            defaultButton : 'loginButton',
            autoComplete: true,
            bodyPadding: '20 20',
            cls: 'auth-dialog-login',
            header: false,
            width: 415,
            items: [
                {
                    xtype: 'form',
                    reference: 'loginForm',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    defaults : {
                        margin: '5 0',
                        listeners: {
                            specialKey: 'onTextFieldSpecialKey'
                        }
                    },
                    items: [
                        {
                            xtype: 'label',
                            text: 'Sign into your account'
                        },
                        {
                            xtype: 'textfield',
                            cls: 'auth-textbox',
                            name: 'username',
                            height: 55,
                            allowBlank : false,
                            hideLabel: true,
                            minLength: 3,
                            msgTarget: 'side',
                            enableKeyEvents: true,
                            vtype: 'email',
                            emptyText: 'Email',
                            regex: /^([0-9a-zA-Z]+[\-._+&amp;])*[0-9a-zA-Z]+@([\-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}$/,
                            regexText: 'Please provide a valid email',
                            triggers: {
                                glyphed: {
                                    cls: 'trigger-glyph-noop auth-email-trigger'
                                }
                            },
                            listeners: {
                                keypress: 'onTextFieldKeyPress'
                            }
                        },
                        {
                            xtype: 'textfield',
                            cls: 'auth-textbox',
                            emptyText: 'Password',
                            inputType: 'password',
                            name: 'password',
                            height: 55,
                            allowBlank : false,
                            hideLabel: true,
                            minLength: 3,
                            msgTarget: 'side',
                            enableKeyEvents: true,
                            triggers: {
                                glyphed: {
                                    cls: 'trigger-glyph-noop auth-password-trigger'
                                }
                            },
                            listeners: {
                                keypress: 'onTextFieldKeyPress'
                            }
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'box',
                                    itemId: 'forgotPasswordLink',
                                    html: '<a href="#passwordreset" class="link-forgot-password"> Forgot Password ?</a>',
                                    listeners: {
                                        click: {
                                            element: 'el',
                                            preventDefault: true,
                                            fn: function (e, target) {
                                                var el = Ext.fly(target);
                                                if (el.dom.nodeName === "A") {
                                                    var cmp = Ext.ComponentQuery.query('#forgotPasswordLink')[0];
                                                    cmp.fireEvent('forgotPwdClick', cmp);
                                                }
                                            }
                                        }
                                    }

                                }

                            ]
                        },
                        {
                            xtype: 'button',
                            reference: 'loginButton',
                            scale: 'large',
                            ui: 'ilabpay-blue',
                            iconAlign: 'right',
                            iconCls: 'x-fa fa-angle-right',
                            text: 'Login',
                            formBind: true,
                            listeners: {
                                click: 'onButtonClickSubmit'
                            }
                        },
                        {
                            xtype: 'box',
                            html: '<div class="outer-div"><div class="seperator">OR</div></div>',
                            margin: '10 0'
                        },
                        {
                            xtype: 'button',
                            scale: 'large',
                            ui: 'gray',
                            iconAlign: 'right',
                            iconCls: 'x-fa fa-user-plus',
                            text: 'Create Account',
                            listeners: {
                                click: 'onNewAccount'
                            }
                        }
                    ]
                }
            ]
        }
    ],
    initComponent: function() {
        this.addCls('user-login-register-container');
        this.callParent(arguments);
    }
});