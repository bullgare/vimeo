// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

/**
 * Album page controller
 */
	Vimeo.Views.Album = Backbone.View.extend( {

	/**
	 * Creating an album model and
	 * preparing Vimeo.Views.VideoList view to do the rest
	 *
	 * @param {int} ModelId
	 */
		initialize: function ( ModelId )
		{
			this.$header = $( '#js-header' );
			this.$header.html( _.template( $( '#_-template-header-album' ).html() )( { id: ModelId } ) );

			this.setElement( '#js-main' );
			this.model = new Vimeo.Models.Album( { id: ModelId } );
			var collectionVideos = new Vimeo.Collections.VideoList;

//			collectionVideos.on( 'reset add', this.render, this );
			collectionVideos.on( 'remove_from_album', this.removeVideo, this );
			collectionVideos.on( 'error404', this.clearPage, this );

			this.viewVideoList = new Vimeo.Views.VideoList( collectionVideos, ModelId );
			this.render();
		},

		render: function ()
		{
			this.$el.html( this.viewVideoList.render().$el );
		},

	/**
	 * Clearing page on not existing album
	 */
		clearPage: function ()
		{
			this.$el.html( '' ).hide();
		},

	/**
	 * Invoked from model's "remove_from_album" event
	 * @param {Vimeo.Models.Video} Model model that needs to be removed
	 */
		removeVideo: function ( Model )
		{
			var me = this;
			$.post(
				Vimeo.Options.mainUrl,
				{
					method: "albums.removeVideo",
					params:
					{
						user_id: Vimeo.Options.userId,
						album_id: me.model.get( 'id' ),
						video_id: Model.get( 'id' )
					}
				}
			).
				success( function () {
					Model.onAfterRemoveFromAlbum();
				} );
		}

	} );

}( Vimeo ));