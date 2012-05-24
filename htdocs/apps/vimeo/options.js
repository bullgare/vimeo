// ns
	window.Vimeo || ( Vimeo = { Models: {}, Collections: {}, Views: {}, Routers: {}, Options: {} } );

(function( Vimeo )
{
	"use strict";

	Vimeo.Options = {
		userId: 9580389,
		mainUrl: 'http://new.undev.ru/vimeo/api.json',
		showError: function ( ErrorMessage )
		{
			if ( typeof ErrorMessage === 'object' && 'err' in ErrorMessage ) {
				ErrorMessage = ErrorMessage.err.msg + ( 'expl' in ErrorMessage.err ? ( ': ' + ErrorMessage.err.expl ) : '' );
			}
			alert( ErrorMessage );
		}
	};

}( Vimeo ));