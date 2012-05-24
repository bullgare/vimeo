// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

/**
 * Video Collection
 */
	Vimeo.Collections.VideoList = Backbone.Collection.extend( {

		model: Vimeo.Models.Video,

		url: Vimeo.Options.mainUrl,

	/**
	 * Parsing vimeo's response to filter out crappy fields
	 * @param Response
	 * @return {*}
	 */
		parse: function ( Response )
		{
			if ( 'videos' in Response && 'video' in Response.videos ) {
				return Response.videos.video;
			}
			else if ( 'err' in Response )
			{
				this.trigger( 'error404' );
				Vimeo.Options.showError( Response );
			}
			return [];
		}

	} );

}( Vimeo ));