'use strict';

function nListCategoriesHelper(categories, options) {

	if (!options && (!categories || !categories.hasOwnProperty('length'))) {
		options = categories;
		categories = this.site.categories;
	}
	
	if (!categories || !categories.length) return '';
	options = options || {};

	var align = options.align || 'align-left';
	var direction = options.direction || '';
	var expanded = options.expanded ? 'expanded' : '';
	var className = options.class || '';
	var depth = options.depth ? parseInt(options.depth, 10) : 0;
	var orderby = options.orderby || 'name';
	var order = options.order || 1;
	var transform = options.transform;
	var showCurrent = options.show_current || false;
	var result = '';
	var self = this;
	
	function prepareQuery(parent) {
		var query = {};
		
		if (parent) {
			query.parent = parent;
		} else {
			query.parent = {$exists: false};
		}
		
		return categories.find(query).sort(orderby, order).filter(function(cat) {
			return cat.length;
		});
	}
	
	function hierarchicalList(level, parent) {
		var result = '';
		
		prepareQuery(parent).forEach(function(cat, i) {
			var child;
			if (!depth || level + 1 < depth) {
				child = hierarchicalList(level + 1, cat._id);
			}
			
			var isCurrent = false;
			if (showCurrent && self.page) {
				for (var j = 0; j < cat.length; j++) {
					var post = cat.posts.data[j];
					if (post && post._id === self.page._id) {
						isCurrent = true;
						break;
					}
				}
				
				// special case: category page
				if (!isCurrent && self.page.base) {
					if (self.page.base.indexOf(cat.path) === 0) {
						isCurrent = true;
					}
				}
			}
			
			result += '<li class="' + (isCurrent ? 'active' : '') + '">';
			
			result += '<a href="' + self.url_for(cat.path) + '">';
			result += transform ? transform(cat.name) : cat.name;
			result += '</a>';
			
			if (child) {
				result += '<ul class="menu ' + className + ' ' + align + ' ' + direction + ' ' + expanded + ' nested">' + child + '</ul>';
			}
			
			result += '</li>';
		});
		
		return result;
	}
	
	function flatList(level, parent) {
		var result = '';
		
		prepareQuery(parent).forEach(function(cat, i) {
			
			result += '<a href="' + self.url_for(cat.path) + '">';
			result += transform ? transform(cat.name) : cat.name;
			
			result += '</a>';
			
			if (!depth || level + 1 < depth) {
				result += flatList(level + 1, cat._id);
			}
		});
		
		return result;
	}
	
	result += '<ul class="menu ' + className + ' ' + align + ' ' + direction + ' ' + expanded + '">' + hierarchicalList(0) + '</ul>';
	
	return result;
}

hexo.extend.helper.register('n_listcategories', nListCategoriesHelper);
