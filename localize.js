// Localize.js 
// ***********************************************************************
// Developed by Infinite Loop Development Ltd (http://www.infiniteloop.ie)
// Copyright 2020 - Infinite Loop Development Ltd
// Need professional translation?, contact us as http://www.resxtranslate.com/
// Requires a local copy of the unicode CLDR
// Downloadable from here; http://cldr.unicode.org/
// ***********************************************************************

var Localize = {
	Path : 'core/common/main/',
	Load : function (languageFile)
	{
		return fetch(Localize.Path + languageFile)
			.then((response) => {			
				return response;
			})
			.then(response => response.text())
			.then(data => {				
				var locale = Localize._parseXml(data);
				return locale.ldml[1];
			});
	},
	_parseXml: function(xml, arrayTags)
	{
		var dom = null;
		if (window.DOMParser)
		{
			dom = (new DOMParser()).parseFromString(xml, "text/xml");
		}
		else if (window.ActiveXObject)
		{
			dom = new ActiveXObject('Microsoft.XMLDOM');
			dom.async = false;
			if (!dom.loadXML(xml))
			{
				throw dom.parseError.reason + " " + dom.parseError.srcText;
			}
		}
		else
		{
			throw "cannot parse xml string!";
		}

		function isArray(o)
		{
			return Object.prototype.toString.apply(o) === '[object Array]';
		}

		function parseNode(xmlNode, result)
		{
			if (xmlNode.nodeName == "#text") {
				var v = xmlNode.nodeValue;
				if (v.trim()) {
				   result['#text'] = v;
				}
				return;
			}

			var jsonNode = {};
			var existing = result[xmlNode.nodeName];
			if(existing)
			{
				if(!isArray(existing))
				{
					result[xmlNode.nodeName] = [existing, jsonNode];
				}
				else
				{
					result[xmlNode.nodeName].push(jsonNode);
				}
			}
			else
			{
				if(arrayTags && arrayTags.indexOf(xmlNode.nodeName) != -1)
				{
					result[xmlNode.nodeName] = [jsonNode];
				}
				else
				{
					result[xmlNode.nodeName] = jsonNode;
				}
			}

			if(xmlNode.attributes)
			{
				var length = xmlNode.attributes.length;
				for(var i = 0; i < length; i++)
				{
					var attribute = xmlNode.attributes[i];
					jsonNode[attribute.nodeName] = attribute.nodeValue;
				}
			}

			var length = xmlNode.childNodes.length;
			for(var i = 0; i < length; i++)
			{
				parseNode(xmlNode.childNodes[i], jsonNode);
			}
		}

		var result = {};
		for (let i = 0; i < dom.childNodes.length; i++)
		{
			parseNode(dom.childNodes[i], result);
		}

		return result;
	}

}