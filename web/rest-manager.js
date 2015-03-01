/* Make something awesome! */
//var tokenId = 'd2e728687af92f01207f0b24c61640e9a678944a';  //added 20120131 SM. (srvrrest)
//var tokenId = '9fd352acd703691f67d63cf6ef1e60c7442a6389';  //added 20130225 SM TokenOnly
var tokenId = "abaf6e6ee1c01a0ba4aff6a175de7e3dbdb2cd93";
//var JSESSIONID = '';
pHostName = "bluesky-safe-software.fmecloud.com";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////////////////      APP           //////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var fmeMobileForm = {

  /*
	 Create the XMLHttpRequest object
	 */
	xhReq : '',

	/*
	 Commonly available on the web, this function was taken from:
	 http://ajaxpatterns.org/XMLHttpRequest_Call
	 */
	createXMLHttpRequest : function() {
		try {
			return new XMLHttpRequest();
		} catch (e) {
		}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
		}
		alert("XMLHttpRequest not supported");
		return null;
	},
  /*-----------------------------------------*/
	
  /*parseJSESSIONID : function(inResult) {
    var jsonDoc = JSON.parse(inResult);
		//Get all parameter objects within the JSON. The parameter objects will
		//be used to populate the combo box.
		JSESSIONID = jsonDoc.serviceResponse.session;
    console.log(JSESSIONID);
    
  },*/
  
    /*
	 Display the result when complete
	 */
	/*onResponseJSESSIONID : function() {
		// 4 indicates a result is ready
		if(this.readyState != 4)
			return;
		// Get the response and cretae a form item
console.log(this.responseText);
    restManager.parseJSESSIONID(this.responseText);
    
    restManager.displayForm();
		return;
	},*/
	
	
	/**
	 * Called when the page first loads. Calls FME Server REST API and retrieves the XML.
	 */
/*	applyJSESSIONID : function() {

		this.xhReq = this.createXMLHttpRequest();

    // Request Variables
		pHostName = "fmeserver.com";
		pUrlBase = "http://" + pHostName + "/fmedataupload/" + pRepository + "/" + pWorkspace;
		pHttpMethod = "GET";
		pRestCall = pUrlBase + "?token=" + tokenId;

		// Send request
		this.xhReq.open(pHttpMethod, pRestCall, true);
		this.xhReq.onreadystatechange = this.onResponseJSESSIONID;
		this.xhReq.send(null);
	},
*/  
  /////////////////////////////////////////////////////
  
	/*
	 Display the result when complete
	 */
	onResponse : function() {
		// 4 indicates a result is ready
		if(this.readyState != 4)
			return;
		// Get the response and cretae a form item
		fmeMobileForm.parseJSONResponse(this.responseText);
		return;
	},
	
	
	/**
	 * Called when the page first loads. Calls FME Server REST API and retrieves the XML.
	 */
	triggerRequest : function() {
    console.log('a');
		this.xhReq = this.createXMLHttpRequest();
    pRepository = getURLParameter("category");
    pWorkspace = getURLParameter("app");
    console.log('b');
    //this.applyJSESSIONID();
    this.displayForm();
	},
	
  displayForm : function() {
    // Set title and breadcrumb
    this.activeCrumb = document.getElementById('activeCrumb');
    this.activeCrumb.innerHTML = pWorkspace;
    document.title = pWorkspace + ' | FME Mobile';

    // Set category link
    this.categoryLink = document.getElementById('categoryLink');
    this.categoryLink.innerHTML = pRepository;
    this.categoryLink.href = "apps.html?category=" + pRepository;
    
  	// Request Variables
		//pHostName = "fmeserver.com";
		pUrlBase = "https://" + pHostName + "/fmerest/repositories/" + pRepository + "/" + pWorkspace + "/parameters/.json";
		pHttpMethod = "GET";
		pRestCall = pUrlBase + "?token=" + tokenId;

		// Send request
		this.xhReq.open(pHttpMethod, pRestCall, true);
		this.xhReq.onreadystatechange = this.onResponse;
		this.xhReq.send(null);
  },

	/**
	 *
	 */
	parseJSONResponse : function(inResult) {

		var jsonDoc = JSON.parse(inResult);
		//Get the form, we will append the combo-box to this form.
		this.fmeForm =  document.forms['fmeForm'];

    // Get form URL
    pRepository = getURLParameter("category");
    pWorkspace = getURLParameter("app");
    fmeForm.action = "http://" + pHostName + "/fmeserver/invoke/fmejobsubmitter/" + pRepository + "/" + pWorkspace + "?token=" + tokenId;

		//Get all parameter objects within the JSON. The parameter objects will
		//be used to populate the combo box.
		var parameters = jsonDoc.serviceResponse.parameters.parameter;
		for( i = (parameters.length-1); i >= 0; i--) {
      
			// We only want to use the parameter if it is of type LOOKUP_CHOICE.
			if(parameters[i].type === "LOOKUP_CHOICE") {
				this.createComboBox(parameters);
			}
			else if(parameters[i].type === "LISTBOX_ENCODED") {
				this.createCheckboxGroup(parameters);
			}
      else if(parameters[i].type === "TEXT") {
       
            if(parameters[i].name == "camera") {
              this.createCameraInput(parameters);
            }
            else if(parameters[i].name == "location") {
              this.createLocationInput(parameters); 
            }
            else {
        			this.createTextBox(parameters);
            }
			}
      else if(parameters[i].type === "TEXT_EDIT") {
  			this.createTextArea(parameters);
			}     
		}
	},
	
/* ---------------------------------------------------------------- */
  
	/**
	 * Dynamically creates a combo box based upon the response from 
	 * the FME Server REST call.
	 */
	createComboBox : function(inParameters) {

  	//Append the select elements to the form
		var _div = document.createElement('div');
    
    // Create label
    var _label = document.createElement('label');
    _label.appendChild(document.createTextNode(inParameters[i].description));
    _div.appendChild(_label);

    //Create an empty select element. We will append the option
		// elements to this element
    var _select = document.createElement('select');
		_select.name = inParameters[i].name;
    
    // Added for FME mobile
    _select.className = "form-control";

		//Obtain the options object
		var options = inParameters[i].options.option;
		for( j = 0; j < options.length; j++) {
			//Create an option element
			var _option = document.createElement('option');
			//Set the text node to the display alias in the options object.
			var displayNameNode = options[j].displayAlias;
			var _text = document.createTextNode(displayNameNode);
			//Set the value attribute to the parameter value. This is the value FME
			//uses when it runs the translation.
			_option.value = options[j].value;
			_option.name = options[j].name;
			//Append the text to the option and the option to the select tag. We now have something that looks like this
			//<select>
			//    <option value="fme_vlaue">Choice with alias value</option>
			//    ...
			//</select>
			_option.appendChild(_text);
			_select.appendChild(_option);
		}

		_div.appendChild(_select);

    this.fmeForm.insertBefore(_div, this.fmeForm.firstChild);
	},
	
	
	/**
	 * Dynamically creates a check box group based upon the response from 
	 * the FME Server REST call.
	 */
	createCheckboxGroup : function(inParameters) {

		//Append the select elements to the form
		var _div = document.createElement('div');
    
    // Create label
    var _label = document.createElement('label');
    _label.appendChild(document.createTextNode(inParameters[i].description));
    _div.appendChild(_label);
    
    // Obtain the options object
		var options = inParameters[i].options.option;
		var paramName = inParameters[i].name;
    
		for( j = 0; j < options.length; j++) {
			var _input = document.createElement('input');
			_input.type = 'checkbox';
			_input.value = options[j].value;
			_input.name = paramName;
			_div.appendChild(_input);
			var _text = document.createTextNode(options[j].value);
			var p = document.createElement("element");
			p.appendChild(_text);
			var br = document.createElement("br");
			p.appendChild(br);
			_div.appendChild(p);
		}
		this.fmeForm.insertBefore(_div, this.fmeForm.firstChild);
	},
  
  /**
	 * Dynamically creates a text box  based upon the response from 
	 * the FME Server REST call.
	 */
	createTextBox : function(inParameters) {

		// Create container
		var _div = document.createElement('div');
    
    // Create label
    var _label = document.createElement('label');
    _label.appendChild(document.createTextNode(inParameters[i].description));
    _div.appendChild(_label);

		// Create input element
		var paramName = inParameters[i].name;
		var _input = document.createElement('input');
		_input.name = paramName;
    _input.type = 'text';
    _input.className = "form-control";
    _div.appendChild(_input);

    // Add input to form
    this.fmeForm.insertBefore(_div, this.fmeForm.firstChild);
    
	},
  
  /**
   * Dynamically creates a text area  based upon the response from 
	 * the FME Server REST call.
	 */
	createTextArea : function(inParameters) {

		// Create container
		var _div = document.createElement('div');
    
    // Create label
    var _label = document.createElement('label');
    _label.appendChild(document.createTextNode(inParameters[i].description));
    _div.appendChild(_label);

		// Create input element
		var paramName = inParameters[i].name;
		var _input = document.createElement('textarea');
		_input.name = paramName;
    _input.className = "form-control";
    _div.appendChild(_input);

    // Add input to form
    this.fmeForm.insertBefore(_div, this.fmeForm.firstChild);
	},

  /**
   * Dynamically creates a camera input 
   * the FME Server REST call.
   */
	createCameraInput : function(inParameters) {

    // Iframe for upload target
    /*var _uploadTarget = document.createElement('iframe');
    _uploadTarget.id = "upload_target";
    _uploadTarget.name = "upload_target";
    this.fmeForm.insertBefore(_uploadTarget, this.fmeForm.firstChild);
*/

  	// Create container
		var _div = document.createElement('div');
    
    // Create label
    var _label = document.createElement('label');
    _label.appendChild(document.createTextNode(inParameters[i].description));
    _div.appendChild(_label);

		// Create input element
		var paramName = inParameters[i].name;
		var _input = document.createElement('input');
		_input.name = paramName;
    _input.type = 'file';
    _input.accept="image/*";
    _input.capture="camera";
    _input.className = "form-control";
    _div.appendChild(_input);
    
    this.fmeForm.insertBefore(_div, this.fmeForm.firstChild);
/*
		// Create input element
		var paramName = inParameters[i].name;
		var _input2 = document.createElement('input');
		_input2.name = paramName;
    _input2.value = "KML_Samples.kml";
    _input2.id = "upload_parameter";
    _input2.type = 'hidden';
    this.fmeForm.insertBefore(_input2, this.fmeForm.firstChild);
*/
/*    // Add input to form
  	var _form = document.createElement('form');
    _form.name = 'upload_files';
    _form.id = 'upload_files';
    _form.method = 'post';
    _form.enctype= 'multipart/form-data';
console.log('JSESSIONID: ' + JSESSIONID);


// ABANDON fmedataupload service and JSESSIONID - they are impossible.
// use /fmeserver/invoke/fmejobsubmitter/../.. (direct upload and run)
//    _form.action = 'http://fmeserver.com/fmedataupload/Samples/easyTranslator.fmw;JSESSIONID=' + JSESSIONID;
/*    _form.action = '/fmeserver/invoke/fmejobsubmitter/Samples/easyTranslator.fmw';
    _form.target = 'upload_target';  
    _form.appendChild(_div);
    
    //submit button - test
    var _submit = document.createElement('input');
    _submit.type = 'submit';
    _form.appendChild(_submit);


    // Add upload picture form
    this.fmeForm.insertBefore(_form, this.fmeForm.firstChild);
    
    // Hidden camera file path input  
    var _input2 = document.createElement('input');
    _input2.type = 'hidden';
    _input2.name = 'camera';
    _input2.id = 'camera';
    this.fmeForm.insertBefore(_input2, this.fmeForm.firstChild);
*/

  },

  /**
   * Dynamically creates a location input 
   * the FME Server REST call.
   */
	createLocationInput : function(inParameters) {

  	// Create container
		var _div = document.createElement('div');
    
    // Create label
    var _label = document.createElement('label');
    _label.appendChild(document.createTextNode(inParameters[i].description));
    _div.appendChild(_label);
 
    // switch
		// Create input element 
    var _input = document.createElement('input');
    var paramName = inParameters[i].name;
		_input.name = paramName;
    _input.id = 'location_switch'
    _input.type = 'checkbox';
    _input.checked = 'checked';   
    //_input.className = "form-control";
    var _div2 = document.createElement('div');
    _div2.appendChild(_input);
    _div.appendChild(_div2);
    
    // Add actual map
    var _div3 = document.createElement('div');
    _div3.id = "mapholder"
    _div.appendChild(_div3);
    
    // Add input to form
    this.fmeForm.insertBefore(_div, this.fmeForm.firstChild);
    
    $('#location_switch').wrap('<div class="make-switch" />').parent().bootstrapSwitch();
    
    getLocation();
    
	}
  
}




























////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////        CATEGORIES      ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var fmeMobileCategories = {

  /*
   Create the XMLHttpRequest object
	 */
	xhReq : '',

	/*
	 Commonly available on the web, this function was taken from:
	 http://ajaxpatterns.org/XMLHttpRequest_Call
	 */
	createXMLHttpRequest : function() {
		try {
			return new XMLHttpRequest();
		} catch (e) {
		}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
		}
		alert("XMLHttpRequest not supported");
		return null;
	},
	
	
	/*
	 Display the result when complete
	 */
	onResponse : function() {
		// 4 indicates a result is ready
		if(this.readyState != 4)
			return;
		// Get the response and cretae a form item
		fmeMobileCategories.parseJSONResponse(this.responseText);
		return;
	},
	
	
	/**
	 * Called when the page first loads. Calls FME Server REST API and retrieves the XML.
	 */
	triggerRequest : function() {

		this.xhReq = this.createXMLHttpRequest();



		// Request Variables
		//pHostName = "fmeserver.com";
		pUrlBase = "https://" + pHostName + "/fmerest/repositories.json";
		pHttpMethod = "GET";
		pRestCall = pUrlBase + "?token=" + tokenId;

		// Send request
		this.xhReq.open(pHttpMethod, pRestCall, true);
		this.xhReq.onreadystatechange = this.onResponse;
		this.xhReq.send(null);
	},
	
	
	/**
	 *
	 */
	parseJSONResponse : function(inResult) {

		var jsonDoc = JSON.parse(inResult);

//Get all parameter objects within the JSON. The parameter objects will
		//be used to populate the combo box.
		//var parameters = jsonDoc.serviceResponse.parameters.parameter;
    var repositories = jsonDoc.serviceResponse.repositories.repository;

  /*
    {"serviceResponse": {
   "requestURI": "/fmerest/repositories",
   "repositories": {"repository": [
      {
         "uri": "/fmerest/repositories/ChampTest",
         "description": "",
         "name": "ChampTest"
      },
    */
    for( i=0; repositories.length > i; i++) {
          this.createRepository(repositories[i].name,repositories[i].description);
		}
	},
  
  createRepository : function(name, description) {
    
    //Append the select elements to the form
	  var _dt = document.createElement('dt');
    var _dta = document.createElement('a');
    _dta.href = 'apps.html?category=' + name;
    _dta.appendChild(document.createTextNode(name));
    _dt.appendChild(_dta);
    
    // DESCRIPTION
    var _dd = document.createElement('dd');
    _dd.innerHTML = description;

    //Get the form, we will append the combo-box to this form.
    this.categoriesContainer =  document.getElementById('categoriesContainer');
    this.categoriesContainer.insertBefore(_dt,null);
    this.categoriesContainer.insertBefore(_dd,null);
    
 
    // href = 'forms.html?=repository=' + 
    /*
         <dt><a href="forms.html?workspace=Inspection Form">Item 1</a></dt>
        <dd>Description 1</dd>
    */
  }


}


























////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////        GENERAL         ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/*
 Commonly available on the web, this function was taken from:
 http://ajaxpatterns.org/XMLHttpRequest_Call
 */
function createXMLHttpRequest() {
	try {
		return new XMLHttpRequest();
	} catch (e) {
	}
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
	}
	alert("XMLHttpRequest not supported");
	return null;
}

// http://stackoverflow.com/questions/1403888/get-url-parameter-with-javascript-or-jquery
// Assumes jQuery is present
function getURLParameter(name) {
  return decodeURI(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );

}





















////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////        FORMS           ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var fmeMobileForms  = {

  /*
   Create the XMLHttpRequest object
   */
	xhReq : '',
	
	/*
	 Display the result when complete
	 */
	onResponse : function() {
		// 4 indicates a result is ready
		if(this.readyState != 4)
			return;
		// Get the response and cretae a form item
		fmeMobileForms.parseJSONResponse(this.responseText);
		return;
	},
	
	
	/**
	 * Called when the page first loads. Calls FME Server REST API and retrieves the XML.
	 */
	triggerRequest : function() {

    pRepository = getURLParameter("category");

    // Set title and breadcrumb
    this.activeCrumb = document.getElementById('activeCrumb');
    this.activeCrumb.innerHTML = pRepository;
    document.title = pRepository + ' | FME Mobile';

		// Request Variables
		//pHostName = "fmeserver.com";    
		pUrlBase = "http://" + pHostName + "/fmerest/repositories/" + pRepository + ".json";
		pHttpMethod = "GET";
		pRestCall = pUrlBase + "?token=" + tokenId;

		// Send request
		this.xhReq = createXMLHttpRequest();
    this.xhReq.open(pHttpMethod, pRestCall, true);
		this.xhReq.onreadystatechange = this.onResponse;
		this.xhReq.send(null);
    
	},
	
	/**
	 *
	 */
	parseJSONResponse : function(inResult) {

		var jsonDoc = JSON.parse(inResult);

    //Get all parameter objects within the JSON. The parameter objects will
		//be used to populate the combo box.
		//var parameters = jsonDoc.serviceResponse.parameters.parameter;
    var workspaces = jsonDoc.serviceResponse.repository.workspaces.workspace;
    var repName = jsonDoc.serviceResponse.repository.name;
    var repDescription = jsonDoc.serviceResponse.repository.description;

/*
{"serviceResponse": {
   "requestURI": "/fmerest/repositories/Samples",
   "repository": {
      "name": "Samples",
      "description": "FME Server Samples Repository",
      "workspaces": {"workspace": [
         {
            "uri": "/fmerest/repositories/Samples/austinApartments",
            "description": "",
            "name": "austinApartments.fmw",
            "title": "City of Austin: Apartments and other (ACAD 2 KML)",
            "isEnabled": "true"
         },
    */
    
    //this.createRepository(repName, repDescription);
    if(workspaces.length) {
      for(i=0; workspaces.length > i; i++) {
        this.createWorkspace(workspaces[i].name, workspaces[i].title, workspaces[i].description);
  		}
    }
    else if(workspaces.name) {
        this.createWorkspace(workspaces.name, workspaces.title, workspaces.description);      
    }
	},
  
  createWorkspace : function(name, title, description) {
    
    pRepository = getURLParameter("category");
    
    // TITLE/NAME
	  var _dt = document.createElement('dt');
    var _dta = document.createElement('a');
    _dta.href = 'app.html?app=' + name + '&category=' + pRepository;    
    if(title.length > 0) {
      _dta.appendChild(document.createTextNode(title));
    }
    else {
      _dta.appendChild(document.createTextNode(name.replace(".fmw","")));
    }
    _dt.appendChild(_dta);
    
    // DESCRIPTION
    var _dd = document.createElement('dd');
    _dd.innerHTML = description;
    //_dd.appendChild(document.createTextNode(description));
    
    // Add to container
    this.formsContainer =  document.getElementById('formsContainer');
  	this.formsContainer.insertBefore(_dt,null);
    this.formsContainer.insertBefore(_dd,null);
  }

}
