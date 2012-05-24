// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

/**
 * Album Item View
 */
	Vimeo.Views.AlbumShort = Backbone.View.extend( {

		tagName: "li",

		// The DOM events specific to an item.
		events: {
			"dblclick .js-view": "edit",
			"click a.js-button-edit": "edit",
			"click a.js-button-delete": "clear",
			"click .js-button-save": "onSave",
			"click .js-button-cancel": "onCancel"
		},

		initialize: function ()
		{
			this.template = _.template( $( '#_-template-album-short' ).html() );

			this.model.bind( 'error', this.showError, this );
			this.model.bind( 'change', this.render, this );
			this.model.bind( 'destroy', this.remove, this );
		},

	/**
	 * Show model-specific error for album
	 * @param {Vimeo.Models.Album} model
	 * @param {string} errorMessage
	 */
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
			Vimeo.Options.showError( errorMessage );
		},

		render: function ()
		{
			this.$el.html( this.template( this.model.toJSON() ) );
			this.$title = this.$( '.js-title' );
			return this;
		},

	/**
	 * Switch this view into `"editing"` mode, displaying the input fields
	 */
		edit: function ()
		{
			this.$el.addClass( "editing" );
			this.$title.focus();
		},

	/**
	 * Toggling from the `"editing"` mode, saving changes to the album
	 */
		onSave: function ()
		{
			this.model.set( {title: this.$title.val(), description: this.$( '.js-description' ).val()} );
			this.$el.removeClass( "editing" );
		},

	/**
	 * Toggling from the `"editing"` mode, reseting changes in inputs
	 */
		onCancel: function ()
		{
			this.render();
			this.$el.removeClass( "editing" );
		},

	/**
	 * Remove the item, destroy the model
	 */
		clear: function ()
		{
			var me = this;

			$.post(
				Vimeo.Options.mainUrl,
				{
					method: "albums.delete",
					params: { user_id: Vimeo.Options.userId, album_id: me.model.get( 'id' ) }
				},
				null,
				'json'
			).
				success( function ( Response ) {
					if ( 'stat' in Response && Response.stat === 'ok' ) {
						me.model.clear();
					}
					else if ( 'err' in Response ) {
						Vimeo.Options.showError( Response );
					}
				} );
		}

	} );

}( Vimeo ));