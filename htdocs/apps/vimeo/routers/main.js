// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

/**
 * Router
 */
	Vimeo.Routers.Main = Backbone.Router.extend({

		// Hash maps for routes
		routes: {
			'': 'albumList',
			'albums/:id': 'album',
			'*error': 'error'
		},

	/**
	 * Main page
	 */
		albumList: function ()
		{
		// Create our global collection of **Albums**.
			var albums = new Vimeo.Collections.AlbumList;

		// Finally, we kick things off by creating the **App**.
			new Vimeo.Views.AlbumList( albums );
		},

	/**
	 * Album page
	 * @param {int} id album id
	 */
		album: function ( id )
		{
			new Vimeo.Views.Album( id );
		},

	/**
	 * All other pages are leading to errors
	 * @param {string} error uri
	 */
		error: function ( error )
		{
			alert( 'Page not found' );
		}
	});

}( Vimeo ));