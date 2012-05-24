// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	Vimeo.Views.VideoForSearch = Backbone.View.extend( {

		tagName: 'li',

		events: {
			"click a.js-button-add": "onAdd"
		},

		initialize: function ()
		{
			this.templateVideo = _.template( $( '#_-template-video-video' ).html() );
			this.templateRest = _.template( $( '#_-template-video-rest-for-search' ).html() );

			this.model.bind( 'error', this.showError, this );
			this.model.bind( 'change', this.render, this );
			this.model.bind( 'destroy', this.remove, this );
		},

		showError: function ( model, errorMessage )
		{
			alert( 'error in video `' + model.get( 'title' ) + '`: ' + errorMessage );
		},

		render: function ()
		{
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

		onAdd: function ()
		{
			this.trigger( 'add_to_album', this.model );
		}

	} );

}( Vimeo ));