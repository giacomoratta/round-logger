/**
 * Created by Giacomo on 30/01/2017.
 *
 * Logger factory
 */
'use strict'

class LoggerFactory{

    static create(config){
        if(!config) config={};

        let newLogger = null;

        try{

            // Complete logger
            if(config.enabled!==false){
                console.log("LoggerFactory > new logger.");
                newLogger = new (require('./Logger.winston.class.js'))(config);
            }

            // Dummy logger
            else{
                console.log("LoggerFactory > logging disabled: return a dummy logger.");
                newLogger = new (require('./Logger.class.js'))();
            }
        }
        catch(e){
            console.error('LoggerFactory > cannot instantiate the logger: return native console object.');
            console.error('LoggerFactory > error message: '+e.message);
            console.trace(e);
            newLogger = console;
        }

        console.log("LoggerFactory > logger constructor name: "+newLogger.constructor.name);
        console.log("LoggerFactory > end.\n");
        return newLogger;
    }
}

 module.exports = LoggerFactory;
