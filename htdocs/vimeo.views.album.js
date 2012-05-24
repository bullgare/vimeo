// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	Vimeo.Views.Album = Backbone.View.extend( {

		initialize: function ( ModelObj, ModelId )
		{
			this.setElement( '#js-main' );
			this.model = new ModelObj( { id: ModelId } );
//			this.model.fetch( {data: { method: "albums.getAll", params: { user_id: Vimeo.Options.userId } } } );
			var collectionVideos = new Vimeo.Collections.VideoList;

			collectionVideos.bind( 'all', this.render, this );

			this.viewVideoList = new Vimeo.Views.VideoList( collectionVideos, ModelId );
		},

		render: function ()
		{
			this.$el.html( this.viewVideoList.render().$el );
		}

	} );

}( Vimeo ));