/**
 * Created by PAVILION 15 on 5/13/2019.
 */
Ext.define('Idsr.view.subcountyconfig.SubCountyConfigController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.subcountyconfig',

    /**
     * Called when the view is created
     */
    init: function() {

    },
    onApplyFilter : function(btn, ev) {
        var filters = {};

        // Reset paging parameters to first page
        filters["start"] = 0;
        filters["limit"] = 25;
        filters["query"] = this.lookupReference('searchfield').getValue();

        this.getStore('subcounties').load({
            params: filters
        });
    },

    onResetFilter : function(btn, ev) {
        this.lookupReference('searchfield').reset();
        this.getStore('subcounties').load();
    }
});