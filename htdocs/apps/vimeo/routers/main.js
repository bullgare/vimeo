// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	Vimeo.Routers.Main = Backbone.Router.extend({

		// Hash maps for routes
		routes: {
			'': 'albumList',
			'albums/:id': 'album',
			'*error': 'error'
		},

		albumList: function ()
		{
			// Create our global collection of **Albums**.
			var albums = new Vimeo.Collections.AlbumList;

			// Finally, we kick things off by creating the **App**.
			/*var App = */new Vimeo.Views.AlbumList( albums );
		},

		album: function ( id )
		{
			/*var view = */new Vimeo.Views.Album( id );
		},

		error: function ( error )
		{
			alert( 'Page not found' );
		}
	});

}( Vimeo ));