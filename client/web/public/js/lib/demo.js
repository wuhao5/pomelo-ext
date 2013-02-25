var pomelo = window.pomelo;

//global pomeloext object
var pomeloext = {
  connected:false,
  config:{
    host : "127.0.0.1",
    port : "3110"
  },
  account:{}
}

pomelo.on('disconnect', function(data) {
  pomeloext.connected = false;
});

//connect to server
pomeloext.connect = function(func){
  pomelo.init(
      {
        host: this.config.host,
        port: this.config.port,
        log: true
      }, 
      function(){
        pomeloext.connected = true;
        func();
      }
  );
}

//check status of connection
pomeloext.call = function(func){
  if(this.connected){
    func();
  }else{
    this.connect(func);
  }
}

//account register
pomeloext.account.register = function(username, password) {
  pomeloext.call(
    function(){
      pomelo.request(
        "ext/account.accountHandler.register", 
        {
          username : username,
          password : password
        },
        function(data) {
          if(data.code == 1){
            alert("register success!");
          }else{
            alert(data.message);
          }
        }
      );
    }
  );
}

//account login
pomeloext.account.login = function(username, password) {
  pomeloext.call(
    function(){
      pomelo.request(
        "ext/account.accountHandler.login", 
        {
          username : username,
          password : password
        },
        function(data) {
          if(data.code == 1){
            alert("login success!");
          }else{
            alert(data.message);
          }
        }
      );
    }
  );
}