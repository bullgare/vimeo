// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	Vimeo.Views.Album = Backbone.View.extend( {

		initialize: function ( ModelId )
		{
			this.setElement( '#js-main' );
			this.model = new Vimeo.Models.Album( { id: ModelId } );
//			this.model.fetch( {data: { method: "albums.getAll", params: { user_id: Vimeo.Options.userId } } } );
			var collectionVideos = new Vimeo.Collections.VideoList;

			collectionVideos.bind( 'reset add', this.render, this );
			collectionVideos.bind( 'remove_from_album', this.removeVideo, this );

			this.viewVideoList = new Vimeo.Views.VideoList( collectionVideos, ModelId );
		},

		render: function ()
		{
			this.$el.html( this.viewVideoList.render().$el );
		},

		removeVideo: function ( Model )
		{
			var me = this;
			$.post( Vimeo.Options.mainUrl,
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