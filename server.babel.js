//  enable runtime transpilation to use ES6/7 in node
var config = require('./package.json').babel;

require('babel-register')(config);
