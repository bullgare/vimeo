// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

/**
 * Video collection view
 */
	Vimeo.Views.VideoList = Backbone.View.extend( {

		tagName: 'div',

		events: {
			'click .js-search-button-find': 'findVideos',
			'click .js-search-cancel': 'closeSearchResults'
		},

	/**
	 *
	 * @param {Vimeo.Collections.VideoList} Videos
	 * @param {int} AlbumId
	 */
		initialize: function ( Videos, AlbumId )
		{
			this.collection = Videos;
			this.albumId = AlbumId;

			this.collection.bind( 'add', this.addOne, this );
			this.collection.bind( 'reset', this.addAll, this );

			this.template = _.template( $( '#_-template-video-list' ).html() );
			this.render();

			this.collection.fetch( { data: { method: "albums.getVideos", params: { user_id: Vimeo.Options.userId, album_id: this.albumId } } } );

			this.collectionSearchVideos = new Vimeo.Collections.VideoList;
		},

		render: function ()
		{
		// no rerendering after start (to prevent video playback reset)
			if ( ! this.hasOwnProperty( 'alreadyRendered' ) )
			{
				this.$el.html( this.template() );
				this.alreadyRendered = true;
			}

			this.$buttonHide = this.$( '.js-search-cancel' );
			return this;
		},

	/**
	 * Adding video to collection
	 * @param {Vimeo.Models.Video} Video
	 */
		addOne: function ( Video )
		{
			var view = new Vimeo.Views.Video( { model: Video } );
			this.$( '.js-videos' ).append( view.render().$el );
		},

		addAll: function ()
		{
			this.collection.each( this.addOne, this );
		},

	/**
	 * Searching for videos by tags
	 */
		findVideos: function ()
		{
			var me = this,
				tagText = $.trim( this.$( '.js-search-tag' ).val() );
			if ( ! tagText.length ) {
				Vimeo.Options.showError( 'Please enter tag text' );
			}
			else
			{
				$.post(
					Vimeo.Options.mainUrl,
					{
						method: "videos.getByTag",
						params: { user_id: Vimeo.Options.userId, tag: tagText, per_page: 10 }
					},
					null,
					'json'
				).
					success( function ( Response ) {
						if ( 'videos' in Response && 'video' in Response.videos )
						{
							var videosData = Response.videos.video;

							if ( videosData.length )
							{
								videosData = _.map( videosData, function ( Video ) {
									return _.extend( Video, { smallSize: true } );
								} );

								me.collectionSearchVideos.reset( videosData );
								me.showSearchResults( me.collectionSearchVideos );
								me.$buttonHide.show();
							}
							else
							{
								me.$( '.js-search-results' ).text( 'Nothing found' );
								me.$buttonHide.hide();
							}
						}
						else if ( 'err' in Response ) {
							Vimeo.Options.showError( Response );
						}
					} ).
					error( function () {
						Vimeo.Options.showError( 'error occured, please try again' );
					} );
			}
		},
	/**
	 * Rendering search results
	 * @param {Vimeo.Collections.VideoList} VideoList
	 */
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
							success( function ()
							{
							// adding video to album after server 'ok'
								var modelToAdd = _.clone( model );
								modelToAdd.set( { smallSize: false } );
								me.collection.add( modelToAdd.toJSON() );
							} );
					} );
				this.$( '.js-search-results' ).append( view.render().$el );
			}, this );
		},

	/**
	 * Hiding search results
	 */
		closeSearchResults: function ()
		{
			this.collectionSearchVideos.remove( this.collection.models );
			this.$( '.js-search-results' ).empty();
			this.$buttonHide.hide();
		}

	} );

}( Vimeo ));