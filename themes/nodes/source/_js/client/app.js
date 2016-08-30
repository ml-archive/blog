'use strict';

(function() {
	// Remove the no-js tag from the html node if we do support javascript.
	document.querySelector('html').classList.remove('no-js');
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
