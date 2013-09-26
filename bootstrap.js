// Bootstrap
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
				
				//	{ injects } is the object holding our data, { injects.css } are the css
				//	files specified in Injects.json.
				injects.css.forEach( function( item ) {
					
					// Make another get() request to the server to serve up original .css files.
					$.get( API_URL + '/GMail-Chrome/' + item, null, 
							function( original, textStatus, jqXHR ) {
								
								//  Replaces some of the image references in the .css with downloadable
								//  images from our server.
								var data = original.replace( /@@API_URL/g, API_URL + '/GMail-Chrome' );
							
								//	Create DOM element that we will attach our .css to.
								var style = document.createElement("style");
								style.type = "text/css";
								style.innerHTML = data;
								document.getElementsByTagName("head")[0].appendChild( style );

								console.log( 'CSS Loaded from: ' + item );
							} 
						).fail( function() {
							alert( 'Could not load CSS from ' + API_URL + '/GMail-Chrome/' + item  + '.  Please refresh this page.  If the problem persists, please contact support@engine.co for help.' );
						});

				});
				
				//  Using the declaration of .js in Injects.json above, we execute a forEachSeries
				//  for each of the js files in Injects.json.
				async.forEachSeries( injects.js,
					function( item, done ) {
						
						//Get request for each item in injects.js
						$.get( API_URL + '/GMail-Chrome/' + item, null, 

							// eval() is executed for each .js file automatically
							// due to the nature of the get() request (jQuery)
							function( data, textStatus, jqXHR ) {
								
								console.log( 'Loaded ' + item );
								
								// Call done() to end the request callback.
								done();
							} 
						).fail( function() {
							alert( 'Could not load Engine extension code from ' + API_URL + '/GMail-Chrome/' + item  + '.  Please refresh this page.  If the problem persists, please contact support@engine.co for help.' );
							done();
						});
					},
					//  After all the async calls run, bootstrap() is executed to launch the 
					//  extension.
					function( error ) {
						bootstrap();
					}
				);
		
			}).fail( function() {
				alert( 'An error has occured communicating with ' + API_URL  + '.  Please refresh this page.  If the problem persists, please contact support@engine.co for help.');
			});
	});
});

