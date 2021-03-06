/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Idsr.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    requires: [
        'Idsr.util.Constants'
    ],

    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'onRouteChange'
            }
        }
    },

    routes: {
        ':node': 'onRouteChange'
    },

    lastView: null,

    setCurrentView: function(hashTag) {
        hashTag = (hashTag || '').toLowerCase();

        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            store = navigationList.getStore(),
            node = store.findNode('routeId', hashTag) ||
                store.findNode('viewType', hashTag),
            view = (node && node.get('viewType')) || 'page404',
            lastView = me.lastView,
            existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
            newView;



        // Kill any previously routed window
        if (lastView && lastView.isWindow) {
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();

        if (!existingItem) {
            newView = Ext.create({
                xtype: view,
                routeId: hashTag,  // for existingItem search later
                hideMode: 'offsets'
            });
        }

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.
            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            }
            else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }

        navigationList.setSelection(node);

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        me.lastView = newView;
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        var to = node && (node.get('routeId') || node.get('viewType'));

        if (to) {
            this.redirectTo(to);
        }
    },

    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationList = refs.navigationTreeList,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 64 : 250;

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();

            refs.senchaLogo.setWidth(new_width);

            navigationList.setWidth(new_width);
            navigationList.setMicro(collapsing);

            Ext.resumeLayouts(); // do not flush the layout here...

            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();  // ... since this will flush them
        }
        else {
            if (!collapsing) {
                // If we are leaving micro mode (expanding), we do that first so that the
                // text of the items in the navlist will be revealed by the animation.
                navigationList.setMicro(false);
            }

            // Start this layout first since it does not require a layout
            refs.senchaLogo.animate({dynamic: true, to: {width: new_width}});

            // Directly adjust the width config and then run the main wrap container layout
            // as the root layout (it and its chidren). This will cause the adjusted size to
            // be flushed to the element and animate to that new size.
            navigationList.width = new_width;
            wrapContainer.updateLayout({isRoot: true});
            navigationList.el.addCls('nav-tree-animating');

            // We need to switch to micro mode on the navlist *after* the animation (this
            // allows the "sweep" to leave the item text in place until it is no longer
            // visible.
            if (collapsing) {
                navigationList.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                        navigationList.el.removeCls('nav-tree-animating');
                    },
                    single: true
                });
            }
        }
    },

    onMainViewRender:function() {
        /*if (!window.location.hash) {
            this.redirectTo("dashboard");
        }*/
    },

    onRouteChange:function(id){

        this.setCurrentView(id);
    },
    logoutClick:function(){
        var me = this;
        var logoutUrl = Idsr.util.Constants.logoutUrl;
        this.getView().mask('Signing out... Please wait...');
        Ext.Ajax.request({
            url: logoutUrl,
            method:"GET",
            success: function(response, opts) {
                me.getView().unmask();
                var rootUrl = Idsr.util.Constants.rootUrl;
                window.location.assign(rootUrl);
            },
            failure: function(response, opts) {
                me.getView().unmask();
                Ext.Msg.alert("Error","Could not Logout");
            }
        });
    },
    onUpdateNavigationStore:function() {
        var me = this;
        var currentUserId = this.getViewModel().get('userDetails').id;
        var menuUrl = Idsr.util.Constants.controllersApiFromIndex+"/users/menus/"+currentUserId;
        me.getView().mask('Loading... Please wait...');
        Ext.Ajax.request({
            url: menuUrl,
            method:"GET",
            success: function(response, opts) {
                me.getView().unmask();
                var responseData = Ext.JSON.decode(response.responseText);
                var status = responseData.status;
                if(status == 1){
                    var menuRoot = responseData.data;
                    var theNavigationMenu = me.lookupReference("navigationTreeList");
                    var adminStore = Ext.create('Idsr.store.NavigationTree');

                    adminStore.setRoot(menuRoot);
                    theNavigationMenu.setConfig('store',adminStore);
                    var initialRoute = menuRoot['children'][0]['routeId'];
                    if (!window.location.hash) {
                        me.redirectTo(initialRoute);
                    }else{

                        var currentView = window.location.hash.substring(1);
                        me.setCurrentView(currentView);
                    }
                }else{

                }

            },

            failure: function(response, opts) {
                me.getView().unmask();

            }
        });

    }
});
