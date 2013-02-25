/**
 * Configurations for pomelo-ext
 */

var config = module.exports;

config.app_name = "pomelo-ext";

/**
 * Configurations for Mongoose
 */
config.mongodb = {
    host: "127.0.0.1",
    port: 27017,
    database: "pomelo-ext",
    options : { 
        user: '', 
        pass: '',
        server: { 
            auto_reconnect: false,
            poolSize:10,
            socketOptions:{
                timeout:0,
                noDelay:true,
                keepAlive:0,
                encoding:null
            }
        }, 
        db: {
            native_parser:false,
            strict:true,
            forceServerObjectId:false,
            retryMiliSeconds:1000, 
            numberOfRetries:5,
            reaper:false,
            reaperInterval:10000,
            reaperTimeout:30000,
            raw:false
        }
    }
}