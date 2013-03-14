// Bootstrap
$(function() {

	console.log( 'Starting local bootstrap.' );

	chrome.storage.local.get('engine_api_url', function(items) {

		// If there's nothing in there, default to the default production version.
		API_URL = items.engine_api_url || "https://apps.engine.co";
		
		// If there's no protocol specified, use https by default.
		if( API_URL.indexOf( "http" ) < 0 )
			API_URL = "https://" + API_URL;

		$.get( API_URL + '/GMail-Chrome/Injects.json', null, 
			function( injects, textStatus, jqXHR ) {

				injects.css.forEach( function( item ) {

					$.get( API_URL + '/GMail-Chrome/' + item, null, 
							function( original, textStatus, jqXHR ) {

								var data = original.replace( /@@API_URL/g, API_URL + '/GMail-Chrome' );

								var style = document.createElement("style");
								style.type = "text/css";
								style.innerHTML = data;
								document.getElementsByTagName("head")[0].appendChild( style );

								console.log( 'CSS Loaded from: ' + item );
							} 
						).fail( function() {
							alert( 'Could not load CSS from ' + API_URL + '/GMail-Chrome/' + item );
						});

				});

				async.forEachSeries( injects.js,
					function( item, done ) {
						$.get( API_URL + '/GMail-Chrome/' + item, null, 
							function( data, textStatus, jqXHR ) {
								console.log( 'Loaded ' + item );
								done();
							} 
						).fail( function() {
							alert( 'Could not load Engine extension code from ' + API_URL + '/GMail-Chrome/' + item );
							done();
						});
					},
					function( error ) {
						bootstrap();
					}
				);
		
			}).fail( function() {
				alert( 'Could not load Inject list from ' + API_URL );
			});


	});
});

