var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'pomelo-ext');

// app configure
app.configure('production|development', function() {
	
    //load pomelo-ext configurations and components
    app.set("pomeloext.config", require('./app/servers/ext/config/config.js'));
    app.set("pomeloext.schemas", require('./app/servers/ext/config/schemas.js'));
	var mongo = require('./app/servers/ext/components/mongodb');
    app.load(mongo, app);

});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
