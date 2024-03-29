// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

/**
 * View for rendering a single video
 */
	Vimeo.Views.Video = Backbone.View.extend( {

		tagName: 'li',
		attributes: {
			class: 'video'
		},

		events: {
			"click a.js-button-delete": "onDelete",
			"click a.js-button-like": "onLike"
		},

		initialize: function ()
		{
			this.templateVideo = _.template( $( '#_-template-video-video' ).html() );
			this.templateRest = _.template( $( '#_-template-video-rest' ).html() );

			this.model.bind( 'error', this.showError, this );
			this.model.bind( 'change', this.render, this );
			this.model.bind( 'removed_from_album', this.remove, this );
		},

		showError: function ( model, errorMessage )
		{
			Vimeo.Options.showError( 'error in video `' + model.get( 'title' ) + '`: ' + errorMessage );
		},

		render: function ()
		{
		// no rerendering after load to prevent video playback reset
			if ( ! this.hasOwnProperty( 'videoRendered' ) )
			{
				this.$el.
					html( this.templateRest( this.model.toJSON() ) ).
					append( this.templateVideo( this.model.toJSON() ) );
				this.videoRendered = true;
			}
			else {
				this.$( '.js-video-rest' ).eq( 0 ).html( this.templateRest( this.model.toJSON() ) );
			}

			return this;
		},

		onLike: function ()
		{
			this.model.set( 'is_like', this.$( '.js-button-like' ).is( '.js-liked' ) ? 0 : 1 );
		},

		/**
		 * Makes collection (Vimeo.Collections.VideoList) to remove this video
		 */
		onDelete: function ()
		{
			this.model.removeFromAlbum();
		}

	} );

}( Vimeo ));