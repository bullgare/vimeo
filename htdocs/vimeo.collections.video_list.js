// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	Vimeo.Collections.VideoList = Backbone.Collection.extend( {

		model: Vimeo.Models.Video,

		url: Vimeo.Options.mainUrl,

		parse: function ( response )
		{
			if ( 'videos' in response && 'video' in response.videos ) {
				return response.videos.video;
			}
			return [];
		}

	} );

}( Vimeo ));