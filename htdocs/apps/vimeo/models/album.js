// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

/**
 * Album Model
 */
	Vimeo.Models.Album = Backbone.Model.extend( {

		url: Vimeo.Options.mainUrl,

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

	/**
	 * Empty title and video id is not allowed
	 * @param {Object} attrs new model attributes
	 * @return {String}
	 */
		validate: function ( attrs )
		{
			if ( ! $.trim( attrs.title ).length ) {
				return 'Empty title is not allowed';
			}
			if ( ! parseInt( attrs.video_id ) > 0 ) {
				return 'Please provide a valid video id';
			}
		},

	/**
	 * This is used to replace sync for actual sending requests
	 *
	 * @param Backbone.Model Model
	 * @param {Object} Options
	 */
		onChange: function ( Model, Options )
		{
			if ( Model.hasChanged() )
			{
				if ( Model.hasChanged( 'title' ) ) {
					$.post( this.url, { method: "albums.setTitle", params: { user_id: Vimeo.Options.userId, album_id: Model.get( 'id' ), title: Options.escape( 'title' ) } } );
				}
				if ( Model.hasChanged( 'description' ) ) {
					$.post( this.url, { method: "albums.setDescription", params: { user_id: Vimeo.Options.userId, album_id: Model.get( 'id' ), description: Options.escape( 'description' ) } } );
				}
			}
		},

	/**
	 * Overriden to prevent simple save requests
	 * @param {string} Method
	 * @param Backbone.Model Model
	 * @param {Object} Options
	 */
		sync: function ( Method, Model, Options )
		{
			if ( ! Model.get( 'id' ) ) {
				Backbone.sync( Method, Model, Options );
			}
			else
			{
			// see onChange method - no sync for update and delete
				this.trigger( Method );
			}
		},

	/**
	 * Remove this Album and delete its view
	 */
		clear: function ()
		{
			this.destroy();
		}

	} );

}( Vimeo ));