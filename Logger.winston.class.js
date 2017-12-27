/**
 * Created by Giacomo on 30/01/2017.
 *
 * Wrap winston logger into a console-like object.
 */
 'use strict'

const _ = require('lodash');

// Winston Packages - https://www.npmjs.com/package/winston
const winston = require('winston');
const winston_DailyRotateFile = require('winston-daily-rotate-file');

const LoggerUtils = require('./LoggerUtils.class.js');
const LoggerAbstract = require('./Logger.abstract.class.js');

class LoggerWinston extends LoggerAbstract{

    constructor(config){
        if(!config) config={};

        // check mandatory configurations
        if(!_.isString(config.directory_logs_abs_path) || config.directory_logs_abs_path.length<1)
            throw new TypeError('LoggerWinston > absolute path of logs directory missing! [config.directory_logs_abs_path=__dirname+...]');

        // winston has different names for log levels
        config.log_levels = {
            log: 'silly',
            info: 'info',
            warning: 'warn',
            error: 'error'
        };

        super( null /*logger object*/ , config );

        this.current_config = {
            console_tx:null,
            global_tx:null,
            error_tx:null
        };

        this._init_config();
        this._init_logger();
    }


    /**
     * Error Handler for transports method on('error')
     */
    _transport_error_handler(e){
        if(!e || !e.code) return;
        //console.log('LoggerWinston > Error Handler');
        switch(e.code){
            case 'ENOENT':
                LoggerUtils.createPath(e.path,{stripFilename:true});
                /* After creating the path, the logger has to be re-initialized
                   because its transports have wrong descriptors; so, the new
                   transports will have good descriptors pointing existant paths. */
                this._init_logger();
                break;
        }
    }


    _init_logger(){

        console.log('LoggerWinston > _init_logger');

        // New Logger object configuration
        const logcfg = {
            transports: [ ]
        };


        /* CONSOLE */
        if(this._config.console_logging===true){
            let console_transport = new winston.transports.Console(this.current_config.console_tx);
            console_transport.on('error',(e)=>{ this._transport_error_handler(e); });
            logcfg.transports.push(console_transport);
        }


        /* FILE > global log (daily rotation) */
        if(this._config.file_logging===true && !_.isNil(this._config.file_global_log_path)){
            console.log('LoggerWinston > add standard logging on '+this._config.file_global_log_path);
            let global_file_transport = new winston.transports.DailyRotateFile(this.current_config.global_tx);
            global_file_transport.on('error',(e)=>{
                this._transport_error_handler(e);
            });
            logcfg.transports.push(global_file_transport);
        }


        /* FILE > error log */
        if(this._config.file_logging===true && !_.isNil(this._config.file_error_log_path)){
            console.log('LoggerWinston > add error logging on '+this._config.file_error_log_path);
            let error_file_transport = new winston.transports.DailyRotateFile(this.current_config.error_tx);
            error_file_transport.on('error',(e)=>{ this._transport_error_handler(e); });
            logcfg.transports.push(error_file_transport);
        }

        this._logger = new winston.Logger(logcfg);

        return;

        /* FILE > unhandled exceptions log */ // redundant...exceptions covered by 'error_log'
        // if(this._config.file_logging===true && !_.isNil(this._config.file_exceptions_log_path)){
        //     console.log('LoggerWinston > add exceptions logging on '+this._config.file_exceptions_log_path);
        //     let exception_file_transport = new winston.transports.DailyRotateFile(_.merge({
        //         name: 'exceptions_log',
        //         filename: this._config.file_exceptions_log_path,
        //         level: this._config.log_levels.error,
        //         humanReadableUnhandledException: true,
        //         maxsize:_common_config.maxsize*5, //bigger file for exception logs
        //     },_common_config));
        //     exception_file_transport.on('error',(e)=>{ _ehd.e=e; this._transport_error_handler(_ehd); });
        //     logcfg.transports.push(exception_file_transport);
        // }
    }


    _init_config(){

        const _common_config = {
            level: 'silly',
            handleExceptions: true, //print exceptions
            timestamp: true,
            prettyPrint: true,
            json: false,
            maxsize:this._config.max_file_size,
            maxfiles:this._config.max_files,
            datePattern: this._config.directory_date_pattern+"/"+this._config.file_date_pattern,
            prepend: true // prepend datePattern to file name
        };



        this.current_config.console_tx = _.merge(_.merge({},_common_config),{
            level: this._config.console_log_level,
            colorize: true,
        });

        this.current_config.global_tx = _.merge(_.merge({},_common_config),{
            name: 'global_log',
            filename: this._config.file_global_log_path,
            level: this._config.file_log_level,
        });

        this.current_config.error_tx = _.merge(_.merge({},_common_config),{
            name: 'error_log',
            filename: this._config.file_error_log_path,
            level: this._config.log_levels.error,
            maxsize:_common_config.maxsize*5, //bigger file for error logs
        });
    }


    log(){
        this._logger.silly.apply(null,_.values(arguments));
    };

    info(){
        this._logger.info.apply(null,_.values(arguments));
    };

    error(){
        this._logger.error.apply(null,_.values(arguments));
    };

    warn(){
        this._logger.warn.apply(null,_.values(arguments));
    };
};


module.exports = LoggerWinston;
