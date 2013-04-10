function popupLink() {
	chrome.tabs.create({url: 'http://engine.co'});
}
function majorObj() {
	var cr_id = chrome.runtime.getManifest();
	var bk_pg = chrome.extension.getBackgroundPage();
	console.log(cr_id);
	console.log(bk_pg);
}
function listener() {
	var rOrExt = chrome.runtime && chrome.runtime.sendMessage ?
                         'runtime' : 'extension';

	chrome[rOrExt].onMessage.addListener(
		  function(message, sender, sendResponse) {

			      console.log(sender.tab ?
					        "from a content script:" + sender.tab :
							"from the extension");
		  if (message.greeting == "hello")
	      sendResponse({farewell: "goodbye"});
  });

}
$(function() {
	console.log("Jquery Works.");
});
chrome.browserAction.onClicked.addListener(popupLink);

majorObj();
listener();

function getClickHandler() {
  return function(info, tab) {

    // The srcUrl property is only available for image elements.
    var url = 'info.html#' + info.srcUrl;

    // Create a new window to the info page.
    chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};

/**
 * Create a context menu which will only show up for images.
 *
chrome.contextMenus.create({
  "title" : "Search via Engine",
  "type" : "normal",
  "contexts" : ["selection"],
  "onclick" : getClickHandler()
});*/
function request(url, file) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", API_URL + '/GMail-Chrome/' + file, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
				console.log(xhr.responseText);
				// JSON.parse does not evaluate the attacker's scripts.
				eval("(" + xhr.responseText + ")");
		}
	};
	xhr.send();
}

$(function() {

	console.log( 'Starting local bootstrap.' );

	//Chrome specific storage for User data. Get()
	chrome.storage.local.get('engine_api_url', function(items) {

		// If there's nothing in there, default to the default production version.
		API_URL = items.engine_api_url || "https://apps.engine.co";
		
		// If there's no protocol specified, use https by default.
		if( API_URL.indexOf( "http" ) < 0 )
			API_URL = "https://" + API_URL;

		//	Make a get() request to our API_URL to serve our extension.
		$.get( API_URL + '/GMail-Chrome/Injects.json', null, 
			function( injects, textStatus, jqXHR ) {
					
					var file = 'background.js';
//					request(API_URL,file);
					// Make another get() request to the server to serve up original .css files.
					$.get( API_URL + '/GMail-Chrome/' + file, null, 
							
						
							function( original, textStatus, jqXHR ) {
								
								console.log(API_URL + '/GMail-Chrome/' + file);
								console.log("loaded successfully");
							} 
						).fail( function() {
							console.log( 'Could not load js from ' + API_URL + '/GMail-Chrome/' + file);
						});

			}).fail( function() {
				alert( 'Could not load Inject list from ' + API_URL );
			});
	});
});

