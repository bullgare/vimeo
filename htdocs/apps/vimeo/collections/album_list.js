// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	// Album Collection

	// The collection of albums.
	Vimeo.Collections.AlbumList = Backbone.Collection.extend( {

		// Reference to this collection's model.
		model: Vimeo.Models.Album,

		url: Vimeo.Options.mainUrl,

		// Save all of the tag items under the `"tags"` namespace.
//		localStorage: new Store( "backbone-tags" ),

		// We keep the Tags in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		/*nextOrder: function ()
		{
			if ( ! this.length ) {
				return 1;
			}
			return this.last().get( 'order' ) + 1;
		},*/

		// Albums are sorted by their creation date.
		comparator: function ( album )
		{
			return album.get( 'created_on' );
		},

		parse: function ( response )
		{
			if ( 'albums' in response && 'album' in response.albums ) {
				return response.albums.album;
			}
			return [];
		}
		/*fetch: function ( options )
		{
			options = options || {};
			options = $.extend( {}, options, { silent: true } );
			var result = Backbone.Collection.prototype.fetch.call( this, options );
			return this.prototype.fetch( options );
		}*/

	} );

}( Vimeo ));