// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

/**
 * Video Model
 */
	Vimeo.Models.Video = Backbone.Model.extend( {

		url: Vimeo.Options.mainUrl,

		defaults:
		{
			title: '',
			is_like: null,
			showButtons: true,
			smallSize: false
		},

		initialize: function ()
		{
			this.bind( 'change', this.onChange );
		},

	/**
	 * Overriden to prevent simple save requests
	 * @param {string} Method
	 * @param {Vimeo.Models.Video} Model
	 * @param {Object} Options
	 */
		sync: function ( Method, Model, Options )
		{
			this.trigger( Method );
		},

	/**
	 * Remove video from album (used for proper traversing model to album)
	 */
		removeFromAlbum: function ()
		{
			this.trigger( 'remove_from_album', this );
		},

	/**
	 * Invoked after removing video from it's album collection to remove it from DOM
	 */
		onAfterRemoveFromAlbum: function ()
		{
			this.destroy();
			this.trigger( 'removed_from_album', this );
		},
		/**
		 * Used to set like on video
		 * TODO: fix like param storing (looks like server problem)
		 * @param Backbone.Model Model
		 * @param {Object} Options
		 */
		onChange: function ( Model, Options )
		{
			if ( Model.hasChanged() )
			{
				if ( Model.hasChanged( 'is_like' ) ) {
					$.post( this.url, { method: "videos.setLike", params: { user_id: Vimeo.Options.userId, video_id: Model.get( 'id' ), is_like: !! parseInt( Model.get( 'is_like' ) ) } } );
				}
			}
		}

	} );

}( Vimeo ));