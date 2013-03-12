// Bootstrap
$(function() {

	chrome.storage.local.get('engine_api_url', function(items) {

		// If there's nothing in there, default to the default production version.
		API_URL = items.engine_api_url || "https://apps.engine.co";
		console.log( 'Starting Bootstrap Function' );

		// If there's no protocol specified, use https by default.
		if( API_URL.indexOf( "http" ) < 0 )
			API_URL = "https://" + API_URL;

		$.get( API_URL + '/GMail-Chrome/ldengine.js', null, 
			function( data, textStatus, jqXHR ) {
				bootstrap();
			} 
		).fail( function() {
			alert( 'Could not load Engine extension code from ' + API_URL );
		});

	});
});

