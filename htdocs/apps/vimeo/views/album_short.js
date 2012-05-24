// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	// Album Item View
	// --------------

	// The DOM element for a album item...
	Vimeo.Views.AlbumShort = Backbone.View.extend( {

		//... is a list tag.
		tagName: "li",

		// The DOM events specific to an item.
		events: {
			"dblclick .js-view": "edit",
			"click a.js-button-edit": "edit",
			"click a.js-button-delete": "clear",
//			"keypress .js-edit": "updateOnEnter",
			"click .js-button-save": "onSave",
			"click .js-button-cancel": "onCancel"
		},

		initialize: function ()
		{
			// Cache the template function for a single item.
			this.template = _.template( $( '#_-template-album-short' ).html() );

			this.model.bind( 'error', this.showError, this );
			this.model.bind( 'change', this.render, this );
			this.model.bind( 'destroy', this.remove, this );
		},

		showError: function ( model, errorMessage )
		{
			if ( ! errorMessage && typeof model === 'string' )
			{
				errorMessage = model;
				model = null;
			}

			if ( model ) {
				errorMessage = 'error in album `' + model.get( 'title' ) + '`: ' + errorMessage;
			}
			alert( errorMessage );
		},

		// Re-render the titles of the album item.
		render: function ()
		{
			this.$el.html( this.template( this.model.toJSON() ) );
			this.$title = this.$( '.js-title' );
			return this;
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function ()
		{
			this.$el.addClass( "editing" );
			this.$title.focus();
		},

		// Close the `"editing"` mode, saving changes to the album.
		onSave: function ()
		{
			this.model.set( {title: this.$title.val(), description: this.$( '.js-description' ).val()} );
//			this.model.save( {title: this.$title.val(), description: $( '.js-description' ).val()} );
			this.$el.removeClass( "editing" );
		},

		onCancel: function ()
		{
		// to reset changes in inputs
			this.render();
			this.$el.removeClass( "editing" );
		},

		// If you hit `enter`, we're through editing the item.
//		updateOnEnter: function ( e )
//		{
//			if ( e.keyCode == 13 ) {
//				this.close();
//			}
//		},

		// Remove the item, destroy the model.
		clear: function ()
		{
			var me = this;

			$.post( Vimeo.Options.mainUrl,
				{
					method: "albums.delete",
					params: { user_id: Vimeo.Options.userId, album_id: me.model.get( 'id' ) }
				}
			).
				success( function ( Response ) {
					if ( typeof Response !== 'object' ) {
						Response = JSON.parse( Response );
					}
					if ( 'stat' in Response && Response.stat === 'ok' ) {
						me.model.clear();
					}
					else if ( 'err' in Response ) {
						me.showError( Response.err.msg + ( 'expl' in Response.err ? ( ': ' + Response.err.expl ) : '' ) );
					}
				} );
		}

	} );

}( Vimeo ));