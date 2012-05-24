(function( $ )
{
	"use strict";

//	Backbone.emulateHTTP = true;
//	Backbone.emulateJSON = true;

	$( document ).ready( function ()
	{
		// TODO clean "tags"

		var appOptions = {
			userId: 9580389
		};





		// Create our global collection of **Albums**.
		var Albums = new AlbumList;





		// Finally, we kick things off by creating the **App**.
		var App = new AppView;

	} );


}( jQuery ));