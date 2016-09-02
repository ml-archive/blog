'use strict';

(function() {
	// Remove the no-js tag from the html node if we do support javascript.
	document.querySelector('html').classList.remove('no-js');
	
	// Check to make sure service workers are supported in the current browser,
	// and that the current page is accessed from a secure origin. Using a
	// service worker from an insecure origin will trigger JS console errors. See
	// http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
	var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
		// [::1] is the IPv6 localhost address.
		window.location.hostname === '[::1]' ||
		// 127.0.0.1/8 is considered localhost for IPv4.
		window.location.hostname.match(
			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
		)
	);
	
	if ('serviceWorker' in navigator &&
		(window.location.protocol === 'https:' || isLocalhost)) {
		navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
			.then(function(registration) {
				// updatefound is fired if service-worker.js changes.
				registration.onupdatefound = function() {
					// updatefound is also fired the very first time the SW is installed,
					// and there's no need to prompt for a reload at that point.
					// So check here to see if the page is already controlled,
					// i.e. whether there's an existing service worker.
					if (navigator.serviceWorker.controller) {
						// The updatefound event implies that registration.installing is set:
						// https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
						var installingWorker = registration.installing;
						
						installingWorker.onstatechange = function() {
							switch (installingWorker.state) {
								case 'installed':
									// At this point, the old content will have been purged and the
									// fresh content will have been added to the cache.
									// It's the perfect time to display a "New content is
									// available; please refresh." message in the page's interface.
									break;
								
								case 'redundant':
									throw new Error('The installing ' +
										'service worker became redundant.');
								
								default:
								// Ignore
							}
						};
					}
				};
			}).catch(function(e) {
			console.error('Error during service worker registration:', e);
		});
	}
})();

$(document).ready(function() {
	
	var $articleBackButton = $('.article-header__back-button');
	if($articleBackButton.length > 0) {
		$articleBackButton.on('click', _browserHistoryBack);
	}
	
	var $mobileNavigationToggle = $('.page-header__mobile-toggle button');
	if($mobileNavigationToggle.length > 0) {
		$mobileNavigationToggle.on('click', _toggleMobileNavigation);
	}
	
	/**
	 * Go back 1 time in browser history, if supported
	 * @private
	 */
	function _browserHistoryBack(e) {
		if(!'history' in window) {
			return;
		}
		
		e.preventDefault();
		
		window.history.back();
	}
	
	function _toggleMobileNavigation() {
		var navWrapper = document.querySelector('.page-header__navigation');
		var nav = document.querySelector('.navigation');
		var coords = _getComputedStyle(nav);
		
		this.classList.toggle('page-header__mobile-toggle--open');
		this.classList.toggle('is-active');
		
		var isOpen = this.classList.contains('page-header__mobile-toggle--open');
		
		navWrapper.style.height = (isOpen) ? coords.height : 0;
		
	}
	
	function _getComputedStyle(el) {
		return window.getComputedStyle(el);
	}
	
});
