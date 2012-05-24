// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

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

		removeFromAlbum: function ()
		{
			this.trigger( 'remove_from_album', this );
		},

		onAfterRemoveFromAlbum: function ()
		{
			debugger;
			this.trigger( 'removed_from_album', this );
		},

		onChange: function ( model, options )
		{
			if ( model.hasChanged() )
			{
				if ( model.hasChanged( 'is_like' ) ) {
				// TODO: fix like param storing (looks like server problem)
					$.post( this.url, { method: "videos.setLike", params: { user_id: Vimeo.Options.userId, video_id: model.get( 'id' ), is_like: !! parseInt( model.get( 'is_like' ) ) } } );
				}
			}
		}

	} );

}( Vimeo ));