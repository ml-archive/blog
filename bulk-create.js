var cp = require('child_process');
var faker = require('faker');

for(var i = 0, l = 30; i < l; i++) {
	cp.exec('hexo new frontend "' + faker.hacker.phrase() + '"');
}