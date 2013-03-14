// Bootstrap
$(function() {


console.log( 'A' );
	chrome.extension.onConnect.addListener(function(port) {
		console.log( 'I' );
  console.assert(port.name == "knockknock");
  console.log( 'E' );
  port.onMessage.addListener(function(msg) {
  	console.log( 'H' );
  	console.log( msg );
    if (msg.joke == "Knock knock")
      port.postMessage({question: "Who's there?"});
    else if (msg.answer == "Madame")
      port.postMessage({question: "Madame who?"});
    else if (msg.answer == "Madame... Bovary")
      port.postMessage({question: "I don't get it."});
  });
});
	console.log( 'B' );


	/*chrome.extension.onMessage.addListener( 
		function( request, sender, sendResponse ) {
			alert( 'Got request:' + request );
			sendResponse( JSON.stringify( {
				success: true
			} ));
		}
		//chrome.tabs.insertCSS( { file: "http://127.0.0.1:3000/GMail-Chrome/ldengine.css" } );
	);*/

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

