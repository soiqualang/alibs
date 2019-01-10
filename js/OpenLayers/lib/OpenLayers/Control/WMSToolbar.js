/* Copyright (c) 2006-2007 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @requires OpenLayers/Control/Panel.js
 * @requires OpenLayers/Control/Navigation.js
 * @requires OpenLayers/Control/ZoomBox.js
 *
 * Class: OpenLayers.Control.WMSToolbar
 */
OpenLayers.Control.WMSToolbar = OpenLayers.Class(OpenLayers.Control.Panel, {

    /**
     * Constructor: OpenLayers.Control.WMSToolbar 
     * Add our two mousedefaults controls.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be used
     *     to extend the control.
     */
    initialize: function(options) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
        this.addControls([
          new OpenLayers.Control.Navigation(),
          new OpenLayers.Control.ZoomBox(),
          new OpenLayers.Control.WMSQuery({queryTarget: this.queryTarget})
        ]);
    },

    /**
     * Method: draw 
     * calls the default draw, and then activates mouse defaults.
     */
    draw: function() {
        var div = OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
        this.activateControl(this.controls[0]);
        return div;
    },

    CLASS_NAME: "OpenLayers.Control.WMSToolbar"
});
