// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	Vimeo.Views.VideoList = Backbone.View.extend( {

		tagName: 'div',

		events: {
			'click .js-add': 'findVideos'
		},

		initialize: function ( Videos, AlbumId )
		{
			this.collection = Videos;
			this.albumId = AlbumId;

			this.collection.bind( 'add', this.addOne, this );
			this.collection.bind( 'reset', this.addAll, this );
//			this.collection.bind( 'all', this.render, this );

			this.template = _.template( $( '#_-template-video-list' ).html() );
			this.render();

			this.collection.fetch( { data: { method: "albums.getVideos", params: { user_id: Vimeo.Options.userId, album_id: this.albumId } } } );

//			this.model = new ModelObj( { id: ModelId } );
//			this.model.fetch( {data: { method: "albums.getAll", params: { user_id: Vimeo.Options.userId } } } );

		},

		render: function ()
		{
			if ( ! this.hasOwnProperty( 'alreadyRendered' ) )
			{
				this.$el.html( this.template() );
				this.alreadyRendered = true;
			}
			return this;
		},

		addOne: function ( video )
		{
			var view = new Vimeo.Views.Video( { model: video } );
			this.$( '.js-videos' ).append( view.render().$el );
		},

		// Add all items in the **Albums** collection at once.
		addAll: function ()
		{
			this.collection.each( this.addOne, this );
		},

		findVideos: function ()
		{
			var me = this,
				tagText = $.trim( this.$( '.js-search-tag' ).val() );
			if ( ! tagText.length ) {
				this.showError( 'Please enter tag text' );
			}
			else
			{
				$.post( Vimeo.Options.mainUrl, { method: "videos.getByTag", params: { user_id: Vimeo.Options.userId, tag: tagText }, dataType: 'json' } ).
					success( function ( Response ) {
						var $buttonHide = me.$( '.js-search-cancel' ),
							Response = JSON.parse( Response );
						if ( 'videos' in Response && 'video' in Response.videos )
						{
							var videoList = new Vimeo.Collections.VideoList;
							videoList.reset( Response.videos.video );
							$buttonHide.show();
						}
					} ).
					error( function () {
						me.showError( 'error occured, please try again' );
					} );
			}
		},

		showError: function ( Message )
		{
			alert( Message );
		}

	} );

}( Vimeo ));