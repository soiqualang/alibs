/* Copyright (c) 2006-2007 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Box.js
 *
 * Class: OpenLayers.Control.WMSQuery
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.WMSQuery = OpenLayers.Class(OpenLayers.Control, {
    /**
     * Property: type
     * {OpenLayers.Control.TYPE}
     */
    type: OpenLayers.Control.TYPE_TOOL,
	
	/**
     * Property: message
     * {String} the output message for query
     */
    message: '',
	/**
     * Property: requested
     * 
     * {Int} number of appended messages
     */
	requested : 0,
	/**
     * Property: numLayers
     * 
     * {Int} number of layers queryed
     */
	numLayers:0,
    /**
     * Method: draw
     */    
    draw: function() {
        this.handler = new OpenLayers.Handler.Box( this,
                            {done: this.WMSQuery}, {keyMask: this.keyMask} );
    },

    /**
     * Method: WMSQuery
     *
     * Parameters:
     * position - {<OpenLayers.Bounds>} or {<OpenLayers.Pixel>}
     */
    WMSQuery: function (position) {
		if (position instanceof OpenLayers.Bounds) {
          //  alert('query rect');
            var minXY = this.map.getLonLatFromPixel(
                            new OpenLayers.Pixel(position.left, position.bottom));
            var maxXY = this.map.getLonLatFromPixel(
                            new OpenLayers.Pixel(position.right, position.top));
            var bounds = new OpenLayers.Bounds(minXY.lon, minXY.lat,
                                               maxXY.lon, maxXY.lat);
           // this.map.zoomToExtent(bounds);
			position = {
					x:parseInt((position.left+position.right)/2),
					y:parseInt((position.top+position.bottom)/2)
				
			};
        }/* else { // it's a pixel
        
		//Get pixel coords
		   
		   var LatLon = this.map.getLonLatFromPixel(position);
        }*/
		//Check if OWSManager is an active Control
        	var OWSManager=null;
             for(var i=0; i< this.map.controls.length; i++) {
		   		var control = this.map.controls[i];
			   	if(control.CLASS_NAME =='OpenLayers.Control.OWSManager'){
					OWSManager = control;
				}
		   }
		   if(!OWSManager) return alert('no OWSManager available');
		   
		  this.setOutput('querying remote server');
		 // var targetObj = document.createElement('div');
		 this.requested = 0;
		 var numLayers = 0;	
			for(var i=0; i< this.map.layers.length; i++){
				var layer = this.map.layers[i];

				if(layer.visibility && layer.OWSqueryable){
					var queryables = layer.OWSqueryable.split('||||');
					for(var j=0; j< queryables.length; j++) {
		            	var WMSlayer = layer.OWSName.split('||||')[j];
						
						//layer.WMSinfo
						//THIS SHOULD BE WMSlayer[5] == 1
						if(queryables[j]==1){
							//alert(WMSlayer[0]+ ' '+ WMSlayer[5]);
							//var url =  + ;
							numLayers++;
							layer.myTarget = this;
							var url =  layer.getFullRequestString({
	                            REQUEST: "GetFeatureInfo",
	                            EXCEPTIONS: "application/vnd.ogc.se_xml",
	                            BBOX: layer.map.getExtent().toBBOX(),
	                            X: position.x,
	                            Y: position.y,
	                            INFO_FORMAT: 'text/plain',
	                            QUERY_LAYERS: WMSlayer,
	                            WIDTH: layer.map.size.w,
	                            HEIGHT: layer.map.size.h});
	           				//OpenLayers.loadURL(url, '', this, this.printQuery);
							OpenLayers.loadURL(url, '', this, this.printQuery);
							
							 
						}
					}
				}
			
			//if(requested)this.queryTarget.appendChild(targetObj);
			//else this.queryTarget.innerHTML = 'no queryable layers available';
			
        }
		
		if(!numLayers){
			 alert('no queryable layers found');
			 this.requested=1;
			setOutput=('');
		}
    },
	/** 
     * @private 
     *
     * @param {XMLHttpRequest} ajaxRequest
     */
	printQuery: function(ajaxRequest){
		
		var text = ajaxRequest.responseText;
		this.requested++;
//		this.setOutput(text);
		this.setOutput(text);
		
	},
	/** 
     * @private 
     *
     * @param {String} string to print on target
     */
	setOutput: function(text){
		if(this.requested==1)
			this.queryTarget.value = text;
		else
			this.queryTarget.value += text;
	},
	
    CLASS_NAME: "OpenLayers.Control.WMSQuery"
});
