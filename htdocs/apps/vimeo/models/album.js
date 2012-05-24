// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	// Album Model

	// Our basic **Album** model has `title`, and `order` attributes.
	Vimeo.Models.Album = Backbone.Model.extend( {

		url: Vimeo.Options.mainUrl,
//			url: '/',

		// Default attributes for the album item.
		defaults: function ()
		{
			return {
				title: "",
				description: "",
				url: "",
				created_on: function() {
				// TODO use a plugin
					var dt = new Date(),
						month = dt.getMonth() + 1;
					if ( month < 10 ) {
						month = '0' + month;
					}
					return dt.getFullYear() + '-' + month + '-' + dt.getDay() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
				}
			};
		},

		initialize: function ()
		{
			this.bind( 'change', this.onChange );
		},

	// Empty title is not allowed
		validate: function ( attrs )
		{
			if ( ! $.trim( attrs.title ).length ) {
				return 'Empty title is not allowed';
			}
		},

		onChange: function ( model, options )
		{
			if ( model.hasChanged() )
			{
				if ( model.hasChanged( 'title' ) ) {
					$.post( this.url, { method: "albums.setTitle", params: { user_id: Vimeo.Options.userId, album_id: model.get( 'id' ), title: model.escape( 'title' ) } } );
				}
				if ( model.hasChanged( 'description' ) ) {
					$.post( this.url, { method: "albums.setDescription", params: { user_id: Vimeo.Options.userId, album_id: model.get( 'id' ), description: model.escape( 'description' ) } } );
				}
			}
		},

		sync: function ( method, model, options )
		{
			if ( ! model.get( 'id' ) ) {
				Backbone.sync( method, model, options );
			}
			else
			{
			// see onChange method - no sync for update and delete
				this.trigger( method );
			}
		},

		// Remove this Album and delete its view.
		clear: function ()
		{
			this.destroy();
		}

	} );

}( Vimeo ));