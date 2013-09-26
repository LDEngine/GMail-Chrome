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
				
				// Check to see if injects actually has any background stuff to load.
				if(injects.hasOwnProperty( 'background') ) {
					// Use async instead of forEach because we want to be certain
					// the order of the js files loaded as well as download the files
					// without blocking the connection.
					async.forEachSeries( injects.background,
						function( file, done) {
						// Make another get() request to the server to serve up original .css files.
						$.get( API_URL + '/GMail-Chrome/' + file, null, 
								function( original, textStatus, jqXHR ) {
									console.log(API_URL + '/GMail-Chrome/' + file);
									console.log("loaded successfully");
									done();
								} 
							).fail( function() {
								console.log( 'Could not load js from ' + API_URL + '/GMail-Chrome/' + file);
								done();
							});
						},
						function( error ) {
							// Report errors if any
							if(error) 
							console.log(error);
						}
					);
				}
			}).fail( function() {
				alert( 'An error has occured communicating with ' + API_URL  + '.  Please refresh this page.  If the problem persists, please contact support@engine.co for help.');
			});
	});
});

