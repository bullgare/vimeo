// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

/**
 * Main page controller
 */
	Vimeo.Views.AlbumList = Backbone.View.extend( {

		events: {
			"click .js-button-create-album": "create"
		},

	/**
	 *
	 * @param {Vimeo.Collections.AlbumList} albums
	 */
		initialize: function ( albums )
		{
			this.albums = albums;

		// this element is already on page
			this.setElement( $( "#js-albums-wrapper" ) );

		// template for footer - albums stats
			this.templateStats = _.template( $( '#_-template-album-stats' ).html() );
		// template for header - creating an album
			this.templateHeader = _.template( $( '#_-template-header-main' ).html() );

			this.albums.bind( 'add', this.addOne, this );
			this.albums.bind( 'reset', this.addAll, this );
			this.albums.bind( 'all', this.render, this );

			this.$header = $( '#js-header' );
			this.$footer = $( '#js-footer' );
			this.render();

		// fetching all albums from server
			this.albums.fetch( {data: { method: "albums.getAll", params: { user_id: Vimeo.Options.userId } } } );
		},


		render: function ( EventType )
		{
			var totalCount = this.albums.length;

		// inputs for creating new albums are rendered only on add and on system start
			if ( EventType === 'add' || _.isEmpty( $.trim( this.$header.html() ) ) ) {
				this.$header.html( this.templateHeader() );
			}

			if ( this.albums.length )
			{
				this.$footer.show();
				this.$footer.html( this.templateStats( {totalCount: totalCount} ) );
			}
			else {
				this.$footer.hide();
			}
		},

	/**
	 * Add a single album item to the list by creating a view for it, and appending its element to the appropriate DOM element.
	 * @param {Vimeo.Models.Album} album
	 */
		addOne: function ( album )
		{
			var view = new Vimeo.Views.AlbumShort( {model: album} );
			$( "#js-album-list" ).append( view.render().el );
		},

	/**
	 * Add all items in the **Albums** collection at once.
	 */
		addAll: function ()
		{
			this.albums.each( this.addOne );
		},

	/**
	 * Create is just sending the request to the server and appending the model to collection
	 */
		create: function ()
		{
			var me = this;

			var modelParams = {
				title: this.$( ".js-new-album-title" ).val(),
				video_id: this.$( ".js-new-album-video" ).val(),
				description: this.$( ".js-new-album-description" ).val()
			};
		// TODO need validation before sending data to server (this.albums.model.validate( modelParams ); ?)

			$.post(
				Vimeo.Options.mainUrl,
				{
					method: "albums.create",
					params: _.extend( { user_id: Vimeo.Options.userId }, modelParams )
				},
				null,
				'json'
			).
				success( function ( Response ) {
					if ( 'stat' in Response && Response.stat === 'ok' && 'album' in Response ) {
						me.albums.add( _.extend( { id: Response.album[0].id }, modelParams ) );
					}
					else if ( 'err' in Response ) {
						Vimeo.Options.showError( Response );
					}
				} );

		}

	} );

}( Vimeo ));