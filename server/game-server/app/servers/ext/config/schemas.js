var Schema = require('mongoose').Schema;

var schemas = module.exports;

schemas.Account = new Schema({
    username : { type: String, default: '' },
    password : { type: String, default: '' },
	profile : {
        
	},
	apps : {

	}
});

