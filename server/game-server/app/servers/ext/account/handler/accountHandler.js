module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Account login
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.login = function(msg, session, next) {
	if(!msg || !session) {
		return;
	}

	var username = msg.username,
	    password = msg.password;
   
    console.log("pa:"+password);
	var crypto = require('crypto'),
	    md5 = crypto.createHash('md5');  

	var pass = md5.update(password).digest('hex');   

	//load schema
    var config = this.app.get("pomeloext.config");
	var Account = this.app.mongo.model('Account', this.app.get("pomeloext.schemas").Account);

	Account.findOne(
		{ 
			username : username,
			password : pass
		}, 
		function (err, data) {
            if(err){
				next(null, {
					code: 0,
					message : 'login failed!'
				});
            }else{
            	next(null, {
					code: 1
				});
            }
		}
	);
};

/**
 * Account register
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next stemp callback
 * @return {Void}
 */
handler.register = function(msg, session, next) {
	if(!msg || !session) {
		return;
	}

	var username = msg.username,
	    password = msg.password;

	var crypto = require('crypto'),
	    md5 = crypto.createHash('md5');  

	var pass = md5.update(password).digest('hex');   

	//load schema
    var config = this.app.get("pomeloext.config");
	var Account = this.app.mongo.model('Account', this.app.get("pomeloext.schemas").Account);
	
	Account.findOne(
		{ 
			username : username,
			password : pass
		}, 
		function (err, data) {
            if(err){
				next(null, {
					code: 0,
					message : 'server error!'
				});
            }else{
                if(data != null){
			        next(null, {
						code: 0,
						message : 'account already exist!'
					});
                }else{
                	reg();
                }
            }
		}
	);
    

	function reg(){
	    //model
		var account = new Account();
	    account.username = username;
	    account.password = pass
		account.apps = {};
		account.apps[config.app_name] = {
	        friends : [],
	        messages : []
		};
	    
	    //save
		account.save(function (err) {
		  if(err){
		  	next(null, {
				code: 0,
				message : 'register failed!'
			});
		  }else{
			next(null, {
				code: 1
			});
		  }
		});
	}
};

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	app.rpc.chat.sessionRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};