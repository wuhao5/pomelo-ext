var pomelo = window.pomelo;

var pomeloext = {
  config:{
    connected : false,
    host : "127.0.0.1",
    port : "3110"
  },
  account:{}
}

//handle disconect message, occours when the client is disconnect with servers
pomelo.on('disconnect', function(reason) {
  connected = false;
});

pomeloext.connect = function(){
  pomelo.init(
      {
        host: this.config.host,
        port: this.config.port,
        log: true
      }, 
      function(){
        alert("connected!");
      }
  );
}

pomeloext.account.register = function() {
  pomelo.request(
    "ext/account.accountHandler.register", 
    {
      username: "zzy",
      password: "default",
      room:'123'
    },
    function(data) {
      alert(data.message);
    }
  );
}

pomeloext.account.login = function() {
  pomelo.request(
    "ext/account.accountHandler.login", 
    {
      username: "zzy",
      password: "default",
      room:'123'
    },
    function(data) {
      alert(data.users.length);
    }
  );
}