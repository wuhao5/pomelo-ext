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
	var self = this;
	var rid = msg.rid;
	var uid = msg.username + '*' + rid
	var sessionService = self.app.get('sessionService');

	//duplicate log in
	if( !! sessionService.getByUid(uid)) {
		next(null, {
			code: 500,
			error: true
		});
		return;
	}

	session.bind(uid);
	session.set('rid', rid);
	session.push('rid', function(err) {
		if(err) {
			console.error('set rid for session service failed! error is : %j', err.stack);
		}
	});
	session.on('closed', onUserLeave.bind(null, self.app));

	//put user into channel
	self.app.rpc['ext/account'].accountRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
		next(null, {
			users:users
		});
	});
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
	
    //model
	var account = new Account();
    account.username = username;
    account.username = pass
	account.apps = {};
	account.apps[config.app_name] = {
        friends : [],
        messages : []
	};
    
    //save
	account.save(function (err) {
	  if(err){
	  	next(null, {
			code: 500,
			message:'failed!'
		});
	  }else{
		next(null, {
			code: 200,
			message:'success!'
		});
	  }
	});
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