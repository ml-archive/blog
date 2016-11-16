'use strict';

document.querySelector('html').classList.remove('no-js');

var NEB = {};

NEB.ServiceWorkerRegistration = (function() {
	
	let isAlreadyRegistered = false;
	
	const URL = '/service-worker.js';
	const SCOPE = '/';
	
	const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
		// [::1] is the IPv6 localhost address.
		window.location.hostname === '[::1]' ||
		// 127.0.0.1/8 is considered localhost for IPv4.
		window.location.hostname.match(
			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
		)
	);
	
	const register = function() {
		if(!isAlreadyRegistered) {
			
			isAlreadyRegistered = true;
			
			if('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) {
				navigator.serviceWorker.register('/service-worker.js', {scope: '/'}).then(function(registration) {
					
					registration.onupdatefound = function() {
						const installingWorker = registration.installing;
						
						installingWorker.onstatechange = function() {
							switch (installingWorker.state) {
								case 'installed':
									if(!navigator.serviceWorker.controller) {
										var siteCachedToast = new Toast('#swCachedToast', {timeout: 4000});
										siteCachedToast.enter();
									}
									break;
								
								case 'redundant':
									throw Error('The installing service worker became reduntant.');
									break;
							}
						};
					};
					
				}).catch(function(e) {
					console.error('Service worker registration failed:', e);
				});
			}
			
		}
	};
	
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		navigator.serviceWorker.controller.onstatechange = function(event) {
			if(event.target.state === 'redundant') {
				var siteCacheUpdatedToast = new Toast('#swCacheExpiredToast', {
					timeout: -1,
					onClose: () => {
						window.location.reload();
					}
				});
				siteCacheUpdatedToast.enter();
			}
		};
	}
	
	return {
		register
	};
	
})();

$(document).ready(function() {
	
	NEB.ServiceWorkerRegistration.register();
	
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
