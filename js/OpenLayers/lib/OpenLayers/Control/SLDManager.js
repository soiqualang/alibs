/* Copyright (c) 2006-2007 MetaCarta, Inc., published under the BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/release-license.txt 
 * for the full text of the license. */

/** 
 * @class
 *  
 * @author Lorenzo Becchi (ominiverdi.org)
 * @projectDescription ticket #687
 * 
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Format/JSON.js
 */
OpenLayers.Control.SLDManager = OpenLayers.Class.create();
OpenLayers.Control.SLDManager.prototype = 
  OpenLayers.Class.inherit( OpenLayers.Control, {

    /** @type String */
    div: null,
    
	tabs: [],//array for UI

  // DOM Elements
  

	
 
    /**
    * @constructor
    */
    initialize: function(targetObj,options) {
        //OpenLayers.Control.prototype.initialize.apply(this, arguments);
		
        
		OpenLayers.Format.JSON.prototype.initialize.apply(this, [options]);
		this.div = targetObj;
		
    },

    /**
     *  
     */    
    destroy: function() {
        
        OpenLayers.Event.stopObservingElement(this.div);

        
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /**
    * @returns A reference to the DIV DOMElement containing the switcher tabs
    * @type DOMElement
    */  
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this);
		
		
		
        // create layout divs
       // this.loadContents();

        // set mode to minimize
        //this.minimizeControl();
        //this.showControls();
		
        // populate div with current info
        //this.redraw();    
		
		//this.switchPanel();
		//this.maximizeControl();
        return this.div;
    },

    /** 
     * Set the active target for SLD editing
     */
    updateTarget: function(div) {
        this.div = div;
		return this.div;
    },


    /** Goes through and takes the current state of the Map and rebuilds the
     *   control to display that state. Groups base layers into a radio-button
     *   group and lists each data layer with a checkbox.
     * 
     * @returns A reference to the DIV DOMElement containing the control
     * @type DOMElement
     */  
    redraw: function(sldButton) {
		/*
		 * sldButton.map = this.map;
			sldButton.layer = selectedLayer;
			sldButton.SLDManager = SLDManager;
		 */
        //clear out previous layers 
        sldButton.SLDManager.div.innerHTML = "";
        
		var SLDinterface = document.createElement('div');
		SLDinterface.className = 'SLDinterface';
		sldButton.SLDManager.div.appendChild(SLDinterface);
		
		var SLDmessanger = document.createElement('div');
		SLDmessanger.className = 'SLDmessanger';
		SLDmessanger.innerHTML = 'Click on button to retrieve styles';
        sldButton.SLDManager.div.appendChild(SLDmessanger);
		
		var SLDblackboard = document.createElement('div');
		SLDblackboard.className = 'SLDblackboard';
		SLDblackboard.innerHTML = 'SLDblackboard';
        sldButton.SLDManager.div.appendChild(SLDblackboard);
		
		var StyleSeeker = document.createElement('button');
		StyleSeeker.className = 'StyleSeeker';
		StyleSeeker.innerHTML = 'get Styles';
		StyleSeeker.SLDManager = sldButton.SLDManager;
		StyleSeeker.onclick = function(){this.SLDManager.getSldservice()};
        SLDblackboard.appendChild(StyleSeeker);
		
		sldButton.SLDManager.SLDmessanger = SLDmessanger;
		sldButton.SLDManager.SLDblackboard = SLDblackboard;
		sldButton.SLDManager.map = sldButton.map;
		sldButton.SLDManager.layerName = sldButton.layerName;
		sldButton.SLDManager.layer = sldButton.layer;
		sldButton.SLDManager.SLDService = sldButton.SLDService;
		
		this.getSldservice();
        return sldButton.SLDManager.div;
    },




    
	
	 /** 
     * @private
     *
     * @param {Event} evt
     */
    getSldservice: function(evt) {
         this.SLDblackboard.innerHTML ='';
		 /*
		 var select = this;
		 if((select)) var url = select[select.selectedIndex].value;
		 else url ="";
		 
		 if(url.length>0) {
			 this.baseURL = url;
		 } else {
			 alert('no server selected. please select one.');
			 return;
		 } 
	    if (this.baseURL.indexOf('?') == -1)
	    {
	        this.baseURL = this.baseURL + '?';
	    }
	    else
	    {
	        if (this.baseURL.charAt( this.baseURL.length - 1 ) == '&')
	            this.baseURL = this.baseURL.slice( 0, -1 );
	    }
		
	    this.baseURL = this.baseURL+ "&service=WMS";
	    this.baseURL = this.baseURL +  "&version=1.1.1";
	    this.baseURL = this.baseURL + "&request=GetCapabilities";
	    */
		
		this.SLDmessanger.innerHTML = "Looking for Styles list... please wait...";
        //$('SLDManagerOutput').innerHTML = this.baseURL;
		//alert(this.baseURL);
		
		//this.baseURL = 'http://test.ominiverdi.org:8080/geoserverSld/sldservice/'+ this.layerName;
		
		//Supposing all layer in the same server are supported by the same sldServce 
		var SLDService = this.layer.SLDService;

		this.baseURL = SLDService + this.layerName;
		
        OpenLayers.loadURL(this.baseURL, null, this, this.parseSldservice, this.noSLDserver);
    },
	
		 /** 
     * @private
     *
     * @param {Event} evt
     */
    noSLDserver:  function(ajaxRequest) {
		this.SLDmessanger.innerHTML = "no SLD server available for this layer";

		
	},
	
	/** 
     * @private
     *
     * @param {Event} evt
     */
    parseSldservice:  function(ajaxRequest) {
		
		var text = ajaxRequest.responseText;
		
		var data = OpenLayers.Format.JSON.prototype.read(text);

				
		//checking data content
		if(!data) {
			this.noSLDserver();
			return null;
		}
		
		//create styles select
		//Make server select
		this.styleSelect = document.createElement('select');
		this.styleSelect.className = 'styleSelect';
		this.styleSelect.map = this.map;
		this.styleSelect.layer = this.layer;
		this.styleSelect.layerName = this.layerName;
		this.styleSelect.legendSpan = this.legendSpan;
		this.styleSelect.SLDManager = this;
		//this.styleSelect.style.width = "220px";
		this.styleSelect.onchange = function(){
						var select = this;
						var styleName = select[select.selectedIndex].value;
						var olLayerName = this.layerName; 
						var olLayer;
						//TODO DELETE THIS LOOP AND USE this.layer instead
						for( u=0;u < this.map.layers.length;u++){
							var myLayer = this.map.layers[u];
							aLayerName = myLayer.name.split(',');
							var matched = false;
							var layerPos;
							var  wmsStyleList= [];
							var styles = myLayer.params['STYLES'];
							if(styles)var aStyles = styles.split(',');
							else var aStyles = [];
							if(aStyles.length == aLayerName.length){
								for(var zz = 0;zz<aLayerName.length;zz++){
									if(this.layerName==aLayerName[zz]){
										layerPos = zz;
										matched = true;
										aStyles[zz] = styleName;
									}	
								}
							} else {
								aStyles = [];
								for(var zz = 0;zz<aLayerName.length;zz++){
									if(this.layerName==aLayerName[zz]){
										layerPos = zz;
										matched = true;
										aStyles.push(styleName);
									}	else {
										aStyles.push('');
									}
								}
							}
							this.SLDManager.styles = aStyles.join(',');
							//this.SLDManager.style = ;
							
							if(matched) {
								
								// Styles need to be set somewhere
								this.SLDManager.redrawLayer();
								
							} else {

							}
						}
						
					};
		var j = 0;
		var opt = new Option( 'select a style', '', true, true );
		this.styleSelect[j++] = opt;
		
		//form.appendChild(this.styleSelect);
		for(i=0;i<data.length;i++) {
			if(data[i]['default'])this.styleSelect[j++] = new Option(data[i]['name'],data[i]['name'],false,true);
			else this.styleSelect[j++] = new Option(data[i]['name'],data[i]['name'],false,false);
		}

		this.SLDblackboard.innerHTML = '';
		this.SLDmessanger.innerHTML = '';
		
		this.SLDblackboard.appendChild(this.styleSelect);
		
		//add custom style button
		this.customStyleButton = document.createElement('button');
		this.customStyleButton.className = 'customStyle';
		this.customStyleButton.innerHTML = 'customize style';
		this.customStyleButton.SLDManager = this;
		this.customStyleButton.onclick = function(){
														var select = this.SLDManager.styleSelect;
														var styleName = select[select.selectedIndex].value;
														if(styleName == '') return alert('choose a style first');
														this.SLDManager.drawStyleCustomizer(styleName);
														
													};
		
		
		this.SLDblackboard.appendChild(this.customStyleButton);
		
		
		
		
		
        return data;
    },
	
	
	/**
     * APIMethod: updateLayer
     * update OL layer, if style has changed it should be applyed
     *
     * Parameters:
     * 
     *     
     * Returns:
     * {Object} bla bla
     */
	
	redrawLayer: function(){
		//TODO once style:population is no more forced clean this up
		//if(this.styles) var styleName = this.styles;
		//else var styleName = 'population';
		var styleName = this.style;

		if(this.style) var styleName = this.style;
		else if(this.styles) var styleName = this.styles;
		
		//create random number to refresh cached tiles and legend icon
		var rand = Math.random();
		
		var legendImg = this.legendSpan.getElementsByTagName('img')[0];
		if (legendImg){
			var theImg = legendImg.src;
			legendImg.src = ''; 
			legendImg.src = theImg + '&rand=' + rand;
			
		}

		this.layer.params['STYLES'] = styleName;
		this.layer.params['RAND'] = rand;
		this.layer.redraw();
		return this.layer;
		
	},
	
	
	/**
     * APIMethod: drawStyleCustomizer
     * bla bla bla
     *
     * Parameters:
     * 
     *     
     * Returns:
     * {Object} bla bla
     */
	drawStyleCustomizer:  function(styleName) {
        //this.map.div.style.display = 'none';
		this.activeStyle = styleName;
		
		//CREATE StyleCustomizer div
		this.styleDrawer = this.map.div.cloneNode(false);
		this.styleDrawer.id = this.map.div.id + 'StyleEditor';
		this.styleDrawer.style.width = this.map.getSize().w;
		this.styleDrawer.style.height = this.map.getSize().h;
		this.styleDrawer.style.borderColor = 'red';
		this.styleDrawer.style.backgroundColor = 'darkblue';
		this.styleDrawer.style.position = 'absolute';
		this.styleDrawer.style.top = 0;
		this.styleDrawer.style.left = 0;
		this.styleDrawer.style.zIndex = 1100;
		this.map.div.appendChild(this.styleDrawer);
		OpenLayers.Rico.Corner.changeOpacity(this.styleDrawer, 0.85);
		
		//add close StyleCustomizer
		var closeCustomizerButton = document.createElement('div');
		closeCustomizerButton.innerHTML = 'x';
		closeCustomizerButton.className = 'olLegendLayerDrop';
		closeCustomizerButton.style.position = 'absolute';
		closeCustomizerButton.style.right = 5;
		closeCustomizerButton.style.top = 5;
		closeCustomizerButton.styleDrawer = this.styleDrawer;
		closeCustomizerButton.onclick = function(){
			this.styleDrawer.parentNode.removeChild(this.styleDrawer);
		}
		this.styleDrawer.appendChild(closeCustomizerButton);
		
		//add tabs
		this.drawTabs(['unique symbols','unique values','intervals']);
		
		//unique symbols tab
		var uniqueSym = document.createElement('div');
		uniqueSym.innerHTML = 'unique symbol';
		var typeSelectLabel = document.createElement('div');
		typeSelectLabel.innerHTML = 'Type';
		uniqueSym.appendChild(typeSelectLabel);
		var typeSelect = document.createElement('select');
		var j = 0;
		typeSelect[j++] = new Option( 'select a type', '', true, true );
		typeSelect[j++] = new Option( 'point', 'PointSymbolizer', false, false );
		typeSelect[j++] = new Option( 'line', 'LineSymbolizer', false, false );
		typeSelect[j++] = new Option( 'polygon', 'PolygonSymbolizer', false, false );
		typeSelect[j++] = new Option( 'text', 'TextSymbolizer', false, false );
		uniqueSym.appendChild(typeSelect);
		var title1 = document.createElement('div');
		title1.innerHTML = 'stroke';
		uniqueSym.appendChild(title1);
		var stroke = document.createElement('input');
		stroke.type = 'text';
		uniqueSym.appendChild(stroke);
		var strokeI = document.createElement('img');
		strokeI.src = '../theme/OWSManager/images/select_arrow.gif';
		strokeI.target = stroke;
		strokeI.onclick = function () {
							showColorPicker(this,this.target)
						}
		var strokeWidthLabel = document.createElement('div');
		strokeWidthLabel.innerHTML = 'stroke-width';
		var strokeWidth = document.createElement('select');
		var j = 0;
		strokeWidth[j++] = new Option( '1', '1', true, true );
		strokeWidth[j++] = new Option( '2', '2', false, false );
		strokeWidth[j++] = new Option( '3', '3', false, false );
		strokeWidth[j++] = new Option( '4', '4', false, false );
		strokeWidth[j++] = new Option( '5', '5', false, false );
		uniqueSym.appendChild(stroke);
		uniqueSym.appendChild(strokeI);
		uniqueSym.appendChild(strokeWidthLabel);
		uniqueSym.appendChild(strokeWidth);
		var title2 = document.createElement('div');
		title2.innerHTML = 'fill';
		uniqueSym.appendChild(title2);
		var color = document.createElement('input');
		color.type = 'text';
		var strokeC = document.createElement('img');
		strokeC.src = '../theme/OWSManager/images/select_arrow.gif';
		strokeC.target = color;
		strokeC.onclick = function () {
							showColorPicker(this,this.target)
						}
		uniqueSym.appendChild(color);
		uniqueSym.appendChild(strokeC);
		var br = document.createElement('br');
		uniqueSym.appendChild(br);
		var submit = document.createElement('button');
		submit.innerHTML = 'apply';
		submit.typeSelect = typeSelect;
		submit.stroke = stroke;
		submit.strokeWidth = strokeWidth;
		submit.color = color;
		submit.styleName = styleName;
		submit.SLDManager = this;
		submit.targetFunction = this.postedRule;
		submit.onclick = function(){
							var type = this.typeSelect[this.typeSelect.selectedIndex].value;
							var stroke = this.stroke.value;
							var strokeWidth = this.strokeWidth[this.strokeWidth.selectedIndex].value;
							var fill = this.color.value;
							if(!type) return alert('type is a mandatory field');
							var styleName = this.styleName;
							//alert(type +' ' + stroke + ' ' +strokeWidth + ' ' + color + ' ');
							var rule = '<Rule><'+ type + '>';
							if(type=='PointSymbolizer'){
								//THAT'S A POINT!!!!
								rule += '<Graphic>';
								rule += '<Mark>';
								//TODO -> set WellKnownName in the form
								rule += '<WellKnownName>circle</WellKnownName> ';
								if(fill) rule += '<Fill><CssParameter name="fill">' + fill + '</CssParameter></Fill>';
								rule += '<Stroke>';
			   					if(stroke) rule +='<CssParameter name="stroke">'+ stroke + '</CssParameter>';
								if(strokeWidth) rule +='<CssParameter name="stroke-width">'+ strokeWidth + '</CssParameter>';
								rule += '</Stroke>';
								rule += ' </Mark>';
								//TODO -> add Size in the form
								if(strokeWidth) rule +='<Size>'+ strokeWidth + '</Size>';
								rule += '</Graphic>';
								
								
							} else {
								if(fill) rule += '<Fill><CssParameter name="fill">' + fill + '</CssParameter></Fill>';
								rule += '<Stroke>';
			   					if(stroke) rule +='<CssParameter name="stroke">'+ stroke + '</CssParameter>';
								if(strokeWidth) rule +='<CssParameter name="stroke-width">'+ strokeWidth + '</CssParameter>';
								rule += '</Stroke>';
							}
							rule +=		'</'+ type + '></Rule>';
							
							//alert(rule);
							//http://test.ominiverdi.org:8080/geoserverSld/sldservice/topp:states/population/0/rules
							//post
							var postBody = 'rules='+rule;
							//var uri = 'http://test.ominiverdi.org:8080/geoserverSld/sldservice/topp:states/population/0/rules';
							var uri = this.SLDManager.baseURL + '/' +  styleName + '/0/rules';
							//var	uri = 'http://test.ominiverdi.org:8080/geoserverSld/sldservice/'+ this.layer;
							if (OpenLayers.ProxyHost && OpenLayers.String.startsWith(uri, "http")) {
						        uri = OpenLayers.ProxyHost + escape(uri);
						    }
							var caller = this.SLDManager;
							var success = (this.targetFunction) ? OpenLayers.Function.bind(this.targetFunction, caller)
                                : OpenLayers.nullHandler;
							new OpenLayers.Ajax.Request(uri, 
									                     {   
														 	//method: 'post', 
									                         postBody: postBody,
															 //parameters:{rules:rule},
									                         onComplete: success, 
									                         onFailure: null
									                      }
									                     );
							
						}
		uniqueSym.appendChild(submit);
		this.tabs[0].body.appendChild(uniqueSym);
		
		//unique values tab
		var uniqueVal = document.createElement('div');
		uniqueVal.innerHTML = 'uniqueVal';
		this.tabs[1].body.appendChild(uniqueVal);
		
		//fields sel 
		var fieldSel = document.createElement('select');
		fieldSel.SLDManager = this;
		fieldSel.style.display = 'none';
		this.tabs[1].body.appendChild(fieldSel);
		this.uniqueValueDiv = document.createElement('div');
		this.tabs[1].body.appendChild(this.uniqueValueDiv);
		
		//get fields list button
		var getFields = document.createElement('button');
		getFields.innerHTML = 'get Fields List';
		getFields.SLDManager = this;
		getFields.fieldSel = fieldSel;
		getFields.onclick = function(){
			var layer = this.SLDManager.layerName;
			var uri = this.SLDManager.layer.SLDService + 'attributeInfo/' +  layer + '/';
			OpenLayers.loadURL(uri, null, this, this.SLDManager.parseAtributeInfoUnique);
							
		}
		this.tabs[1].body.appendChild(getFields);
		
		
		
		//intervals tab
		var intervals = document.createElement('div');
		intervals.innerHTML = 'intervals';
		this.tabs[2].body.appendChild(intervals);
		//fields sel 
		var fieldSel2 = document.createElement('select');
		fieldSel2.SLDManager = this;
		fieldSel2.style.display = 'none';
		this.tabs[2].body.appendChild(fieldSel2);
		this.intervalsDiv = document.createElement('div');
		this.tabs[2].body.appendChild(this.intervalsDiv);
		
		//get fields list button
		var getFields2 = document.createElement('button');
		getFields2.innerHTML = 'get Numeric Fields List';
		getFields2.SLDManager = this;
		getFields2.fieldSel = fieldSel2;
		getFields2.onclick = function(){
			var layer = this.SLDManager.layerName;
			var uri = this.SLDManager.layer.SLDService + 'attributeInfo/' +  layer + '/';
			OpenLayers.loadURL(uri, null, this, this.SLDManager.parseAtributeInfoIntervals);
							
		}
		this.tabs[2].body.appendChild(getFields2);
		
		return this.styleDrawer;
    },
	
	/**
     * APIMethod: asdasdasda
     * sddsfsdfdssdfsds
     *
     */
	parseAtributeInfoUnique: function (ajaxRequest){

		var sel = this.fieldSel;
		var text = ajaxRequest.responseText;
		
		var data = OpenLayers.Format.JSON.prototype.read(text);

				
		//checking data content
		if(!data) {
			alert('no data in attributeInfo');
			return null;
		}
		
		//hide button
		this.style.visibility = 'hidden';
		this.fieldSel.style.display = 'block';
		
		//color ramp select
		var colorRamp = document.createElement('div');
		colorRamp.innerHTML = 'Colors';
		this.SLDManager.uniqueValueDiv.appendChild(colorRamp);
		var colorRampSel = document.createElement('select');
		this.SLDManager.uniqueValueDiv.appendChild(colorRampSel);
		var j = 0;
		colorRampSel[j++] = new Option( 'Gray', 'gray', true, true );
		colorRampSel[j++] = new Option( 'Red', 'red', false, false );
		colorRampSel[j++] = new Option( 'Blue', 'blue', false, false );
		colorRampSel[j++] = new Option( 'Random', 'random', false, false );
		colorRampSel[j++] = new Option( 'Custom', 'custom', false, false );
		
		
		
		
		//set colors interface
		var colors = document.createElement('div');
		var startColorL = document.createElement('div');
		var startColorL = document.createElement('div');
		startColorL.innerHTML = 'Mid Colour';
		var startColor = document.createElement('input');
		startColor.type = 'text';
		var startColorI = document.createElement('img');
		startColorI.src = '../theme/OWSManager/images/select_arrow.gif';
		startColorI.target = startColor;
		startColorI.onclick = function () {
							showColorPicker(this,this.target)
						}
		var midColorL = document.createElement('div');
		midColorL.innerHTML = 'Mid Colour';
		var midColor = document.createElement('input');
		midColor.type = 'text';
		var midColorI = document.createElement('img');
		midColorI.src = '../theme/OWSManager/images/select_arrow.gif';
		midColorI.target = midColor;
		midColorI.onclick = function () {
							showColorPicker(this,this.target)
						}
		var endColorL = document.createElement('div');
		endColorL.innerHTML = 'Mid Colour';
		var endColor = document.createElement('input');
		endColor.type = 'text';
		var endColorI = document.createElement('img');
		endColorI.src = '../theme/OWSManager/images/select_arrow.gif';
		endColorI.target = endColor;
		endColorI.onclick = function () {
							showColorPicker(this,this.target)
						} 
		colors.appendChild(startColorL);
		colors.appendChild(startColor);
		colors.appendChild(startColorI);
		colors.appendChild(midColorL);
		colors.appendChild(midColor);
		colors.appendChild(midColorI);
		colors.appendChild(endColorL);
		colors.appendChild(endColor);
		colors.appendChild(endColorI);
		this.SLDManager.uniqueValueDiv.appendChild(colors);
		
		
		//activate colors switcher
		colors.style.display = 'none';
		colorRampSel.colors = colors;
		colorRampSel.onchange = function(){
			if(this[this.selectedIndex].value=='custom') {
				this.colors.style.display ='block';
			} else {
				this.colors.style.display ='none';
			}
		};
		
		//Populate the fields select
		var j = 0;
		var opt = new Option( 'select a field', '', true, true );
		sel[j++] = opt;
		for(i=0;i<data.length;i++) {
			sel[j++] = new Option(data[i]['name'],data[i]['name'],false,false);
		}
		
		
		//add onchange to select
		sel.targetFunction = this.SLDManager.classifyFeature;
		sel.startColor = startColor;
		sel.midColor = midColor;
		sel.endColor = endColor;
		//add refresh button
		var refresh = document.createElement('button');
		refresh.style.display = 'block';
		refresh.style.marginTop = 10;
		refresh.innerHTML = 'refresh map';
		refresh.SLDManager = this.SLDManager;
		refresh.targetFunction = this.SLDManager.classifyFeature;
		refresh.startColor = startColor;
		refresh.midColor = midColor;
		refresh.endColor = endColor;
		refresh.select = sel;
		refresh.colorRamp = colorRampSel;
		refresh.onclick =  function(){
			var property = this.select[this.select.selectedIndex].value;
			var colorRamp = this.colorRamp[this.colorRamp.selectedIndex].value;
			if(!property)return alert('please select a field');
			//var rule = '';
			//classMethod (unique,equalInterval,quantile), property ( nomedel campo su cui vuoi classificare )
			//, classNum (se non lo metti ottieni 4 classi), startColor endColor e midColor
			
			//postBody
			//var postBody = 'rules='+rule;
			
			var layer = this.SLDManager.layerName;
			var styleName = this.SLDManager.activeStyle;
			//http://localhost:8080/geoserver/sldservice/classify/topp:states/population
			var uri = this.SLDManager.layer.SLDService + 'classify/' +   layer + '/' + styleName;
			var postBody = 	'classMethod=unique&property=' + property ;
			if(this.colorRamp) postBody += '&colorRamp=' + colorRamp;
			if(this.startColor.value) postBody += '&startColor=' + startColor.value;
			if(this.midColor.value) postBody += '&midColor=' + midColor.value;
			if(this.endColor.value) postBody += '&endColor=' + endColor.value;

			
			if (OpenLayers.ProxyHost && OpenLayers.String.startsWith(uri, "http")) {
		        uri = OpenLayers.ProxyHost + escape(uri);
		    }
			var caller = this.SLDManager;
			var success = (this.targetFunction) ? OpenLayers.Function.bind(this.targetFunction, caller)
	            : OpenLayers.nullHandler;
			new OpenLayers.Ajax.Request(uri, 
					                     {   
										 	//method: 'post', 
					                         postBody: postBody,
											 //parameters:{classMethod:'unique',property: 'asasd'},
					                         onComplete: success, 
					                         onFailure: null
					                      }
					                     );
			
		}
		this.SLDManager.uniqueValueDiv.appendChild(refresh);
		
		
		
		
	},
	
	/**
     * APIMethod: asdasdasda
     * sddsfsdfdssdfsds
     *
     */
	parseAtributeInfoIntervals: function (ajaxRequest){

		var sel = this.fieldSel;
		var text = ajaxRequest.responseText;
		
		var data = OpenLayers.Format.JSON.prototype.read(text);

				
		//checking data content
		if(!data) {
			alert('no data in attributeInfo');
			return null;
		}
		
		//hide button
		this.style.visibility = 'hidden';
		this.fieldSel.style.display = 'block';
		
		//Interval type 
		var intType = document.createElement('div');
		intType.innerHTML = 'Interval Type';
		this.SLDManager.intervalsDiv.appendChild(intType);
		var intTypeSel = document.createElement('select');
		this.SLDManager.intervalsDiv.appendChild(intTypeSel);
		var j = 0;
		intTypeSel[j++] = new Option( 'Equal Interval', 'equalInterval', true, true );
		intTypeSel[j++] = new Option( 'Quantile Interval', 'quantile', false, false );
		
		
		//Class num  
		var classNum = document.createElement('div');
		classNum.innerHTML = 'Number of Intervals';
		this.SLDManager.intervalsDiv.appendChild(classNum);
		var classNumSel = document.createElement('select');
		this.SLDManager.intervalsDiv.appendChild(classNumSel);
		for(i=0;i<10;i++) {
			classNumSel[i] = new Option(4+i,4+i,false,false);
		}
		
		
		//color ramp select
		var colorRamp = document.createElement('div');
		colorRamp.innerHTML = 'Colors';
		this.SLDManager.intervalsDiv.appendChild(colorRamp);
		var colorRampSel = document.createElement('select');
		this.SLDManager.intervalsDiv.appendChild(colorRampSel);
		var j = 0;
		colorRampSel[j++] = new Option( 'Gray', 'gray', true, true );
		colorRampSel[j++] = new Option( 'Red', 'red', false, false );
		colorRampSel[j++] = new Option( 'Blue', 'blue', false, false );
		colorRampSel[j++] = new Option( 'Random', 'random', false, false );
		colorRampSel[j++] = new Option( 'Custom', 'custom', false, false );
	
		
		
		//set colors interface
		var colors = document.createElement('div');
		var startColorL = document.createElement('div');
		startColorL.innerHTML = 'Mid Colour';
		var startColor = document.createElement('input');
		startColor.type = 'text';
		var startColorI = document.createElement('img');
		startColorI.src = '../theme/OWSManager/images/select_arrow.gif';
		startColorI.target = startColor;
		startColorI.onclick = function () {
							showColorPicker(this,this.target)
						}
		var midColorL = document.createElement('div');
		midColorL.innerHTML = 'Mid Colour';
		var midColor = document.createElement('input');
		midColor.type = 'text';
		var midColorI = document.createElement('img');
		midColorI.src = '../theme/OWSManager/images/select_arrow.gif';
		midColorI.target = midColor;
		midColorI.onclick = function () {
							showColorPicker(this,this.target)
						}
		var endColorL = document.createElement('div');
		endColorL.innerHTML = 'Mid Colour';
		var endColor = document.createElement('input');
		endColor.type = 'text';
		var endColorI = document.createElement('img');
		endColorI.src = '../theme/OWSManager/images/select_arrow.gif';
		endColorI.target = endColor;
		endColorI.onclick = function () {
							showColorPicker(this,this.target)
						} 
		colors.appendChild(startColorL);
		colors.appendChild(startColor);
		colors.appendChild(startColorI);
		colors.appendChild(midColorL);
		colors.appendChild(midColor);
		colors.appendChild(midColorI);
		colors.appendChild(endColorL);
		colors.appendChild(endColor);
		colors.appendChild(endColorI);
		this.SLDManager.intervalsDiv.appendChild(colors);
		
		//activate colors switcher
		colors.style.display = 'none';
		colorRampSel.colors = colors;
		colorRampSel.onchange = function(){
			if(this[this.selectedIndex].value=='custom') {
				this.colors.style.display ='block';
			} else {
				this.colors.style.display ='none';
			}
		};
		 
		
		//this.SLDManager.intervalsDiv.appendChild(endColorI);
		
		
		//Populate the fields select
		var j = 0;
		var opt = new Option( 'select a numeric field', '', true, true );
		sel[j++] = opt;
		for(i=0;i<data.length;i++) {
			if(data[i]['type']=='double' || data[i]['type']=='int')sel[j++] = new Option(data[i]['name'],data[i]['name'],false,false);
		}
		
		//
		
		//add onchange to select
		sel.targetFunction = this.SLDManager.classifyFeature;
		sel.startColor = startColor;
		sel.midColor = midColor;
		sel.endColor = endColor;
		/*sel.onchange = function(){
			
		};*/
		//add refresh button
		var refresh = document.createElement('button');
		refresh.style.display = 'block';
		refresh.style.marginTop = 10;
		refresh.innerHTML = 'refresh map';
		refresh.SLDManager = this.SLDManager;
		refresh.targetFunction = this.SLDManager.classifyFeature;
		refresh.startColor = startColor;
		refresh.midColor = midColor;
		refresh.endColor = endColor;
		refresh.select = sel;
		refresh.classNum = classNumSel;
		refresh.intType = intTypeSel;
		refresh.colorRamp = colorRampSel;
		refresh.onclick =  function(){
			var property = this.select[this.select.selectedIndex].value;
			var classNum = this.classNum[this.classNum.selectedIndex].value;
			var classMethod = this.intType[this.intType.selectedIndex].value;
			var colorRamp = this.colorRamp[this.colorRamp.selectedIndex].value;
			
			//classMethod (unique,equalInterval,quantile), property ( nomedel campo su cui vuoi classificare )
			//, classNum (se non lo metti ottieni 4 classi), startColor endColor e midColor
			
			//postBody
			//var postBody = 'rules='+rule;
			
			var layer = this.SLDManager.layerName;
			var styleName = this.SLDManager.activeStyle;
			//http://localhost:8080/geoserver/sldservice/classify/topp:states/population
			var uri = this.SLDManager.layer.SLDService + 'classify/' +   layer + '/' + styleName;
			var postBody = 	'classMethod=' + classMethod + '&property=' + property ;
			if(this.classNum) postBody += '&classNum=' + classNum;
			if(this.colorRamp) postBody += '&colorRamp=' + colorRamp;
			if(this.startColor.value) postBody += '&startColor=' + startColor.value;
			if(this.midColor.value) postBody += '&midColor=' + midColor.value;
			if(this.endColor.value) postBody += '&endColor=' + endColor.value;

			
			if (OpenLayers.ProxyHost && OpenLayers.String.startsWith(uri, "http")) {
		        uri = OpenLayers.ProxyHost + escape(uri);
		    }
			var caller = this.SLDManager;
			var success = (this.targetFunction) ? OpenLayers.Function.bind(this.targetFunction, caller)
	            : OpenLayers.nullHandler;
			new OpenLayers.Ajax.Request(uri, 
					                     {   
										 	//method: 'post', 
					                         postBody: postBody,
											 //parameters:{classMethod:'unique',property: 'asasd'},
					                         onComplete: success, 
					                         onFailure: null
					                      }
					                     );
			
		}
		this.SLDManager.intervalsDiv.appendChild(refresh);
		
		
		
		
	},

	
	/**
     * APIMethod: classifyFeature
     * sdfdsfsdf
     *
     */

	classifyFeature: function (ajaxRequest){
		var text = ajaxRequest.responseText;
		//TODO use a check on HTTP code to determinate success 

		this.console.innerHTML = text;
		this.redrawLayer();
		
	},
		
	/**
     * APIMethod: postedRule
     * sdfdsfsdf
     *
     */

	postedRule: function (ajaxRequest){
		var text = ajaxRequest.responseText;
		//TODO ADD exception parsing
		this.redrawLayer();
		
		
	},
	
	 /**
     * APIMethod: read
     * Deserialize an OpenLayers JSON string.
     *
     * Parameters:
     * str - {String} An OLON string
     * filter - {Function} A function which will be called for every key and
     *     value at every level of the final result. Each value will be
     *     replaced by the result of the filter function. This can be used to
     *     reform generic objects into instances of classes, or to transform
     *     date strings into Date objects.
     *     
     * Returns:
     * {Object} An object, array, string, or number.
     */
    readJSON: function(str, filter) {
        var data = OpenLayers.Format.JSON.prototype.read(str, filter);
        var instance = OpenLayers.Class.deserialize(data);
        return instance;
    },
	
	
	drawTabs: function(aTabs){
		
		this.tabs = [];
		//this.tabs.head = [];
		//this.tabs.body = [];
		
		var header = document.createElement("div");
		header.className = 'olTabHeader';
		
		var body = document.createElement("div");
		//body.className = 'olTabBody';
		
		for(i=0;i<aTabs.length;i++){
			var tabObj = {};
			var tabName = aTabs[i];
			tabObj.name = tabName;
			// add Legend tab
			var tabH = document.createElement("a");
			tabH.href="#";
			if(i==0) tabH.className = 'active';
			tabH.panel = tabName;
			tabH.SLDManager = this;
			tabH.onclick = this.switchPanel;
			var spanL = document.createElement("span");
			spanL.innerHTML = tabName;
			tabH.appendChild(spanL);
			header.appendChild(tabH);
			tabObj.head = tabH;
			
			//add tab body
			var tabB = document.createElement('div');
			tabB.className = 'olTabBody';
			tabB.panel = tabName;
			if(i>0)tabB.style.display = 'none';
			tabObj.body = tabB;
			
			this.tabs.push(tabObj);
			body.appendChild(tabB);
		}
		this.styleDrawer.appendChild(header);
		this.styleDrawer.appendChild(body);
		
		this.console = document.createElement('div');
		this.console.className = 'console';
		this.console.style.border = '1px solid red';
		this.console.style.margin = 10;
		this.console.style.padding = 10;
		this.console.style.backgroundColor = 'white';
		this.styleDrawer.appendChild(this.console);
		
		return this.tabs;
	},
	
	switchPanel: function(){

		var sldMan = this.SLDManager;
		
		if(!sldMan.tabs) {

			return null;
		}
		for(i=0;i<sldMan.tabs.length;i++){
			var tabBody = sldMan.tabs[i].body;
			var tabHead = sldMan.tabs[i].head;
			var tabName = sldMan.tabs[i].name;

			
			if(this.panel == tabName){
				tabBody.style.display = '';
				tabHead.className = 'active';
			} else {
				tabBody.style.display = 'none';
				tabHead.className = '';
			}
		}
		sldMan.activePanel = this.panel;
		return sldMan;
		
		
	},
	

    /** @final @type String */
    CLASS_NAME: "OpenLayers.Control.SLDManager"
});


 /** Sarissa derived getText
     *  
     * @private
     *
     * @param {Node} XML node
     * @param {int} deep recursion  
     */
	OpenLayers.Ajax.getText = function(oNode, deep){
	    var s = "";
	    var nodes = oNode.childNodes;
	    for(var i=0; i < nodes.length; i++){
	        var node = nodes[i];
	        var nodeType = node.nodeType;
	        if(nodeType == Node.TEXT_NODE || nodeType == Node.CDATA_SECTION_NODE){
	            s += node.data;
	        } else if(deep == true
	                    && (nodeType == Node.ELEMENT_NODE
	                        || nodeType == Node.DOCUMENT_NODE
	                        || nodeType == Node.DOCUMENT_FRAGMENT_NODE)){
	            s += OpenLayers.Ajax.getText.getText(node, true);
	        };
	    };
	    return s;
	};
	
	/** Sarissa derived getParseErrorText
     *  
     * @private
     *
     * @param {Document} oDoc The target DOM document
     * @returns The parsing error description of the target Document in
     *          human readable form (preformated text)
     */
	OpenLayers.Ajax.PARSED_OK = "Document contains no parsing errors";
	OpenLayers.Ajax.PARSED_EMPTY = "Document is empty";
	OpenLayers.Ajax.PARSED_UNKNOWN_ERROR = "Not well-formed or other error";
	
	OpenLayers.Ajax.getParseErrorText = function(oDoc){
		//this is only the IE version from Sarissa	
	   var parseErrorText = OpenLayers.Ajax.PARSED_OK;
        if(oDoc && oDoc.parseError && oDoc.parseError.errorCode && oDoc.parseError.errorCode != 0){
            parseErrorText = "XML Parsing Error: " + oDoc.parseError.reason + 
                "\nLocation: " + oDoc.parseError.url + 
                "\nLine Number " + oDoc.parseError.line + ", Column " + 
                oDoc.parseError.linepos + 
                ":\n" + oDoc.parseError.srcText +
                "\n";
            for(var i = 0;  i < oDoc.parseError.linepos;i++){
                parseErrorText += "-";
            };
            parseErrorText +=  "^\n";
        }
        else if(oDoc.documentElement == null){
            parseErrorText = OpenLayers.Ajax.PARSED_EMPTY;
        };
        return parseErrorText;
	};
	
	/** 
	 * Sarissa derived Escape
	 * Escape the given string chacters that correspond to the five predefined XML entities
	 * @param sXml the string to escape
	 */
	OpenLayers.Ajax.escape = function(sXml){
	    return sXml.replace(/&/g, "&amp;")
	        .replace(/</g, "&lt;")
	        .replace(/>/g, "&gt;")
	        .replace(/"/g, "&quot;")
	        .replace(/'/g, "&apos;");
	};
	/** 
	 * Sarissa derived Unescape
	 * Unescape the given string. This turns the occurences of the predefined XML 
	 * entities to become the characters they represent correspond to the five predefined XML entities
	 * @param sXml the string to unescape
	 */
	OpenLayers.Ajax.unescape = function(sXml){
	    return sXml.replace(/&apos;/g,"'")
	        .replace(/&quot;/g,"\"")
	        .replace(/&gt;/g,">")
	        .replace(/&lt;/g,"<")
	        .replace(/&amp;/g,"&");
	};
	
	/** 
	 * Sarissa node values definition
	 * 
	 */
	if(!window.Node || !Node.ELEMENT_NODE){
	    Node = {ELEMENT_NODE: 1, ATTRIBUTE_NODE: 2, TEXT_NODE: 3, CDATA_SECTION_NODE: 4, ENTITY_REFERENCE_NODE: 5,  ENTITY_NODE: 6, PROCESSING_INSTRUCTION_NODE: 7, COMMENT_NODE: 8, DOCUMENT_NODE: 9, DOCUMENT_TYPE_NODE: 10, DOCUMENT_FRAGMENT_NODE: 11, NOTATION_NODE: 12};
	};
