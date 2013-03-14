$(function() {
	chrome.storage.local.get('engine_api_url',function(items){
		var API_URL = items.engine_api_url || "https://apps.engine.co";
		if( API_URL.indexOf( "http" ) < 0 )
			API_URL = "https://" + API_URL;

		chrome.storage.local.get( 'ldengine_log_level', function( items ) {
			var LOG_LEVEL = items.ldengine_log_level || "off";
	
			$('#api_url').val(API_URL);
			$('#logLevel').val( LOG_LEVEL );
			$('#save').click(function(){
	
			chrome.storage.local.set({engine_api_url:$('#api_url').val()});
			chrome.storage.local.set({ldengine_log_level:$('#logLevel').val()});
			window.close();
		});

		});
	});      
});
