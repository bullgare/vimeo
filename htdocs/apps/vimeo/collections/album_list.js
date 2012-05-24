// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";


/**
 * Album Collection
 */
	Vimeo.Collections.AlbumList = Backbone.Collection.extend( {

		// Reference to this collection's model.
		model: Vimeo.Models.Album,

		url: Vimeo.Options.mainUrl,

	/**
	 * Parsing vimeo's response to filter out crappy fields
	 * @param Response
	 * @return {*}
	 */
		parse: function ( Response )
		{
			if ( 'albums' in Response && 'album' in Response.albums ) {
				return Response.albums.album;
			}
			return [];
		}

	} );

}( Vimeo ));