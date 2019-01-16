Ext.define('Idsr.view.login.Link', {
    extend : 'Ext.Component',
    xtype  : 'link',

    autoEl : {
        tag : 'a'
    },

    config : {
        href   : null,
        target : '_blank'
    },

    listeners : {
        element   : 'el',
        //stopEvent : true, //if you want to stop all clicks
        click     : 'onLinkClick'
    },

    updateHref : function(href) {
        if (href) {
            var el = this.getEl();

            if (el) {
                el.set({
                    href : href
                });
            }
        }
    },

    updateTarget : function(target) {
        if (target) {
            var el = this.getEl();

            if (el) {
                el.set({
                    target : target
                });
            }
        }
    },

    onRender : function(container, index) {
        var me = this;

        me.callParent([container, index]);

        me.updateHref(me.getHref());
        me.updateTarget(me.getTarget());
    },

    onLinkClick : function(e) {
        if (true) {
            //if you only want to stop based on some condition
            e.stopEvent();
        }

        Ext.Msg.alert('Click', 'You clicked on the link!');
    }
});