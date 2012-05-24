// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	Vimeo.Views.VideoList = Backbone.View.extend( {

		tagName: 'div',

		events: {
			'click .js-search-button-find': 'findVideos'
		},

	// TODO album not found
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
				Vimeo.Options.showError( 'Please enter tag text' );
			}
			else
			{
				$.post( Vimeo.Options.mainUrl, { method: "videos.getByTag", params: { user_id: Vimeo.Options.userId, tag: tagText, per_page: 10 }, dataType: 'json' } ).
					success( function ( Response ) {
						var $buttonHide = me.$( '.js-search-cancel' );
						if ( typeof Response !== 'object' ) {
							Response = JSON.parse( Response );
						}

						if ( 'videos' in Response && 'video' in Response.videos )
						{
							var videosData = Response.videos.video;

							if ( videosData.length )
							{
								videosData = _.map( videosData, function ( Video ) {
									return _.extend( Video, { smallSize: true } );
								} );

								var videoList = new Vimeo.Collections.VideoList;
								videoList.reset( videosData );
								me.showSearchResults( videoList );
								$buttonHide.show();
							}
							else
							{
								me.$( '.js-search-results' ).text( 'Nothing found' );
								$buttonHide.hide();
							}
						}
					} ).
					error( function () {
						Vimeo.Options.showError( 'error occured, please try again' );
					} );
			}
		},

		showSearchResults: function ( VideoList )
		{
			var me = this;
			VideoList.each( function ( Video ) {
				var view = new Vimeo.Views.VideoForSearch( { model: Video } );
				view.
					on( 'add_to_album', function ( model ) {
						$.post( Vimeo.Options.mainUrl,
							{
								method: "albums.addVideo",
								params:
								{
									user_id: Vimeo.Options.userId,
									album_id: me.albumId,
									video_id: model.get( 'id' )
								}
							}
						).
							success( function () {
								me.addOne( model );
							} );
					} );
				this.$( '.js-search-results' ).append( view.render().$el );
			}, this );
		}

	} );

}( Vimeo ));