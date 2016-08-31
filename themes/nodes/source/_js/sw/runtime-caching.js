// global.toolbox is defined in a different script, sw-toolbox.js, which is part of the
// https://github.com/GoogleChrome/sw-toolbox project.
// That sw-toolbox.js script must be executed first, so it needs to be listed before this in the
// importScripts() call that the parent service worker makes.
console.log('FOR REALS');
(function(global) {
	'use strict';
	console.log('Hi')
	// See https://github.com/GoogleChrome/sw-toolbox/blob/6e8242dc328d1f1cfba624269653724b26fa94f1/README.md#toolboxroutergeturlpattern-handler-options
	// and https://github.com/GoogleChrome/sw-toolbox/blob/6e8242dc328d1f1cfba624269653724b26fa94f1/README.md#toolboxfastest
	// for more details on how this handler is defined and what the toolbox.fastest strategy does.
	global.toolbox.router.get('/(.*)', function(request, values, options) {
		return global.toolbox.networkFirst(request, values, options)
			.catch(function(error) {
				console.warn('SW ERROR: ', error);
				if (request.method === 'GET' && request.headers.get('accept').includes('text/html')) {
					return global.toolbox.cacheOnly(new Request('/Offline'), values, options);
				}
				throw error;
			});
	});
})(self);
