function popupLink() {
	chrome.tabs.create({url: 'http://engine.co'});
}
chrome.browserAction.onClicked.addListener(popupLink);

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
				alert( 'Could not load Inject list from ' + API_URL  + '/GMail-Chrome/Injects.json');
			});
	});
});

