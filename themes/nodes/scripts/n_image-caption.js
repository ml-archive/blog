'use strict';

var htmlTag = require('hexo-util').htmlTag;
var url_for = hexo.extend.helper.get('url_for');

var rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/;
var rMeta = /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/;

function imageCaptionTagHelper(args, content) {
	var classes = [];
	var meta = '';
	var width;
	var height;
	var title;
	var alt;
	var src;
	var item = '';
	var i = 0;
	var len = args.length;
	
	// Find image URL and class name
	for (; i < len; i++) {
		item = args[i];
		
		if (rUrl.test(item)) {
			src = item;
			break;
		} else {
			if (item[0] === '/') {
				src = url_for(item);
				break;
			} else {
				classes.push(item);
			}
		}
	}
	
	// Delete image URL and class name from arguments
	args = args.slice(i + 1);
	
	// Find image width and height
	if (args.length) {
		if (!/\D+/.test(args[0])) {
			width = args.shift();
			
			if (args.length && !/\D+/.test(args[0])) {
				height = args.shift();
			}
		}
		
		meta = args.join(' ');
	}
	
	// Find image title and alt
	if (meta && rMeta.test(meta)) {
		var match = meta.match(rMeta);
		title = match[1];
		alt = match[2];
	}
	
	var attrs = {
		src: src,
		class: classes.join(' '),
		width: width,
		height: height,
		title: title,
		alt: alt
	};
	
	var markup = [];
	markup.push('<figure>');
	
	markup.push(htmlTag('img', attrs));
	
	markup.push('<figcaption>' + attrs.title + '</figcaption>');
	
	markup.push('</figure>');
	
	return markup.join('');

}

hexo.extend.tag.register('n_imagecaption', imageCaptionTagHelper);