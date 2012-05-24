// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	// album list main view

	// Our overall **AppView** is the top-level piece of UI.
	Vimeo.Views.AlbumList = Backbone.View.extend( {

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			"click .js-button-create-album": "create"
		},

		// At initialization we bind to the relevant events on the `Albums`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting tags that might be saved in *localStorage*.
		initialize: function ( albums )
		{
			this.albums = albums;

			// Instead of generating a new element, bind to the existing skeleton of
			// the App already present in the HTML.
			this.setElement( $( "#js-albums-wrapper" ) );

			this.templateStats = _.template( $( '#_-template-album-stats' ).html() );
			this.templateCreate = _.template( $( '#_-template-album-create' ).html() );

			this.albums.bind( 'add', this.addOne, this );
			this.albums.bind( 'reset', this.addAll, this );
			this.albums.bind( 'all', this.render, this );

			this.$header = $( '#js-header' );
			this.$header.html( _.template( $( '#_-template-header-main' ).html() )() );
			this.$footer = $( '#js-footer' );
			this.$create = $( '#js-create-new-album' );
			this.render();
//			this.main = $( '#js-main' );

//			this.albums.fetch( $.param( { contentType: 'text/plain', method: "albums.getAll", params: {user_id: appOptions.userId }} ) );
//			this.albums.fetch( {contentType: 'application/json', data: $.param( { "method": "albums.getAll", "params": {"user_id": appOptions.userId}} )} );
			this.albums.fetch( {data: { method: "albums.getAll", params: { user_id: Vimeo.Options.userId } } } );
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function ( EventType )
		{
			var totalCount = this.albums.length;

			if ( EventType === 'add' || _.isEmpty( this.$create.html() ) ) {
				this.$create.html( this.templateCreate() );
			}

			this.$inputTitle = $( "#js-new-album-title" );
			this.$inputVideo = $( "#js-new-album-video" );
			this.$inputDescription = $( "#js-new-album-description" );

			if ( this.albums.length )
			{
				this.$footer.show();
				this.$footer.html( this.templateStats( {totalCount: totalCount} ) );
			}
			else {
				this.$footer.hide();
			}
		},

		// Add a single album item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function ( album )
		{
			var view = new Vimeo.Views.AlbumShort( {model: album} );
			$( "#js-album-list" ).append( view.render().el );
		},

		// Add all items in the **Albums** collection at once.
		addAll: function ()
		{
			this.albums.each( this.addOne );
		},

		create: function ( e )
		{
			var me = this;

			var modelParams = {
				title: this.$inputTitle.val(),
				video_id: this.$inputVideo.val(),
				description: this.$inputDescription.val()
			};

			$.post( Vimeo.Options.mainUrl,
				{
					method: "albums.create",
					params: _.extend( { user_id: Vimeo.Options.userId }, modelParams )
				}
			).
				success( function ( Response ) {
					if ( typeof Response !== 'object' ) {
						Response = JSON.parse( Response );
					}
					if ( 'stat' in Response && Response.stat === 'ok' && 'album' in Response ) {
						me.albums.add( _.extend( { id: Response.album[0].id }, modelParams ) );
					}
					else if ( 'err' in Response ) {
						me.showError( Response.err.msg + ( 'expl' in Response.err ? ( ': ' + Response.err.expl ) : '' ) );
					}
				} );

		},

		showError: function ( errorMessage )
		{
			alert( errorMessage );
		}

	} );

}( Vimeo ));