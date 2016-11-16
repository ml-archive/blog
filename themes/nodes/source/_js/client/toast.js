'use strict';
var Toast = function(selector, options) {
	const defaults = {
		timeout: 10000,
		duration: 0.2
	};
	
	const $el = $(selector);
	const opts = defaults;
	$.extend(opts, (options || {}));
	
	if($el.find('[data-close-toast]').length) {
		const $closeBtn = $el.find('[data-close-toast]');
		$closeBtn.bind('click', _leave);
	}
	
	this.enter = _enter;
	
	this.leave = _leave;
	
	function _enter() {
		TweenLite.set($el, {
			display: 'block'
		});
		
		TweenLite.to($el, opts.duration, {
			y: 0,
			alpha: 1,
			ease: Power4.easeInOut
		});
		
		if(opts.timeout > 0) {
			setTimeout(() => {
				_leave();
			}, opts.timeout);
		}
	}
	
	function _leave() {
		TweenLite.to($el, opts.duration, {
			y: 50,
			alpha: 0,
			ease: Power4.easeInOut,
			display: 'none',
			onComplete: () => {
				if(opts.onClose) {
					opts.onClose();
				}
			}
		});
	}
	
};

window.Toast = Toast;
