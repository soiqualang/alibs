/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @class
 * 
 * @requires OpenLayers/Control.js
 */
OpenLayers.Control.WMSExporter = OpenLayers.Class.create();
OpenLayers.Control.WMSExporter.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {

    /** @type DOMElement */
    element: null,
    
    /** @type String */
    base: '',

    /**
     * @constructor
     * 
     * @param {DOMElement} element
     * @param {String} base
     */
    initialize: function(element, base) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.element = OpenLayers.Util.getElement(element);        
        if (base) {
            this.base = base;
        }
    },

    /**
     * 
     */
    destroy: function()  {
        if (this.element.parentNode == this.div) {
            this.div.removeChild(this.element);
        }
        this.element = null;

        this.map.events.unregister('moveend', this, this.updateLink);

        OpenLayers.Control.prototype.destroy.apply(this, arguments); 
    },

    /** Set the map property for the control. 
     * 
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);

        //make sure we have an arg parser attached
        for(var i=0; i< this.map.controls.length; i++) {
            var control = this.map.controls[i];
            if (control.CLASS_NAME == "OpenLayers.Control.ArgParser") {
                break;
            }
        }
        if (i == this.map.controls.length) {
            this.map.addControl(new OpenLayers.Control.ArgParser());       
        }

    },

    /**
     * @type DOMElement
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
          
        if (!this.element) {
            this.div.className = this.displayClass;
            this.element = document.createElement("a");
            this.element.style.fontSize="smaller";
            this.element.innerHTML = "OL Exporter";
            this.element.href="";
			this.element.onclick = function() {
									//alert(this.outstring);
									var newwindow;
									//Encode the xml inside the error message
									encodedHtml = this.outstring;
							    	encodedHtml = encodedHtml.replace(/</g,"&lt;");
							    	encodedHtml = encodedHtml.replace(/>/g,"&gt;"); 
									//popup a message windows to let the use copy the error
									newwindow=window.open('','','menubar=1,scrollbars=1,width=700,height=400,resizable=1') ;
									//menubar=1,location=1,status=1,
									newwindow.document.writeln('<html> <head> <title>Error Parsing GetCapabilties<\/title> <\/head> <body><pre><code>');
									newwindow.document.writeln(encodedHtml);
									newwindow.document.writeln('<\/code><\/pre> <\/body> <\/html>');
									newwindow.document.close();
									return false;
								};
            this.div.appendChild(this.element);
        }
        this.map.events.register('moveend', this, this.updateLink);
        return this.div;
    },
   
    /**
     * 
     */
    updateLink: function() {
        var center = this.map.getCenter();
        var zoom = "zoom=" + this.map.getZoom(); 
        var lat = "lat=" + Math.round(center.lat*100000)/100000;
        var lon = "lon=" + Math.round(center.lon*100000)/100000;

        var layers = "layers=";
        /*for(var i=0; i< this.map.layers.length; i++) {
            var layer = this.map.layers[i];

            if (layer.isBaseLayer) {
                layers += (layer == this.map.baseLayer) ? "B" : "0";
            } else {
                layers += (layer.getVisibility()) ? "T" : "F";           
            }
        }*/
		
		//OpenLayers last build: http://www.openlayers.org/api/OpenLayers.js
		//WMSManager nightly build: http://www.ominiverdi.org/openlayers/nightly/openlayers/build/OpenLayers.js
		var header = '<html xmlns="http:\/\/www.w3.org/1999/xhtml">\n';
  		header +=		'<head>\n<style type="text/css">\n';
		header += '\t#map {\n\t\t width: 800px;\n\t\t height: 475px;\n\t\t border: 1px solid black;\n\t}\n</style>\n';
		header +=					'<script src="http:&#47;&#47;www.openlayers.org/api/OpenLayers.js"></script>\n';
		//header +=				//'<script src="http:&#47;&#47;www.ominiverdi.org/openlayers/nightly/openlayers/build/WMSManager.js"></script>\n';
		header +=				'<script type="text/javascript">\n<!-- \n\t var map;';  
		header +=		'\n\t function init(){\n\t\t map = new OpenLayers.Map( $(\'map\') ); ';
		var layers = '\n';
		
		for(var i=0; i< this.map.layers.length; i++) {
            var layer = this.map.layers[i];
			layers += '\n\t\t layer' + i + ' = new OpenLayers.Layer.WMS( "' +
						layer.WMSinfo[0] + '", "';
			layers += 	layer.WMSinfo[1];
			layers += 		'",{';
			var aParams = layer.WMSinfo[2].split('!!'); 	
			for(y=0;y<aParams.length;y++){
				var keyVal = aParams[y].split('!');
				if(keyVal[0]){
					if(keyVal[0]=='TRANSPARENT') {
						if(keyVal[1]=='TRUE')layers +=  'TRANSPARENT : true';
						else layers +=  'TRANSPARENT : false';
					}
					else layers +=  keyVal[0] + ': \'' + keyVal[1] + '\'';
					if(y<aParams.length-1) layers += ',';
				}
			}
			layers +='} );';
			
			layers += '\n\t\t map.addLayer(layer' + i + ');';	
			if (layer.isBaseLayer) {
				layers += '\n\t\t map.setBaseLayer(layer' + i + ');';	
			} else {
				layers += '\n\t\t layer' + i + '.setVisibility('+layer.getVisibility() +' );';
			}
			
        }
       
		var footer = '';
		footer += '\n\t\t map.setCenter(new OpenLayers.LonLat('+ lon + ','+ lat +'),' +zoom+');';
		footer += '\n\t\t map.addControl( new OpenLayers.Control.LayerSwitcher() );';
		footer +=				'\n\t\} \n &#47;&#47; --&gt; \n</script> \n</head>';
		footer +=				'\n<body onload="init()"> \n\t  <div id="map"></div>';
		footer +=				'\n</body>\n</html>';
		this.element.outstring = header + layers + footer;
		
    }, 

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.WMSExporter"
});
