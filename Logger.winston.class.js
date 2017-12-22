/**
 * Created by Giacomo on 30/01/2017.
 *
 * Wrap winston logger into a console-like object.
 */

const _ = require('lodash');

// Winston Packages - https://www.npmjs.com/package/winston
const winston = require('winston');
const winston_DailyRotateFile = require('winston-daily-rotate-file');

const LoggerUtils = require('./LoggerUtils.class.js');
const LoggerAbstract = require('./Logger.abstract.class.js');

class LoggerWinston extends LoggerAbstract{

    constructor(config){
        if(!config) config={};

        // winston has different names for log levels
        config.log_levels = {
            log: 'silly',
            info: 'info',
            warning: 'warn',
            error: 'error'
        };

        super( null /*logger object*/ , config );

        this._init();
    }


    /**
     * Error Handler for transports method on('error')
     */
    _transport_error_handler(ehd){
        if(!ehd || !ehd.e || !ehd.e.code) return;
        switch(ehd.e.code){
            case 'ENOENT':
                LoggerUtils.createPath(ehd.e.path, ehd.directory_logs_abs_path);
                // path will be created but it will not contains the new log files
                break;
        }
    }


    _init(){

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

        // New Logger object configuration
        const logcfg = {
            transports: [ ]
        };

        // Error Handler Data (for callback)
        const _ehd = {
            e:null,
            directory_logs_abs_path:this._config.directory_logs_abs_path
        };

        /* CONSOLE */
        if(this._config.console_logging===true){
            let consolelog_cfg = _.merge(_.merge({},_common_config),{
                level: this._config.console_log_level,
                colorize: true,
            });

            let console_transport = new winston.transports.Console(consolelog_cfg);
            console_transport.on('error',(e)=>{ _ehd.e=e; this._transport_error_handler(_ehd); });
            logcfg.transports.push(console_transport);
        }


        /* FILE > global log (daily rotation) */
        if(this._config.file_logging===true && !_.isNil(this._config.file_global_log_path)){
            console.log('LoggerWinston > add standard logging on '+this._config.file_global_log_path);
            let globalog_cfg = _.merge(_.merge({},_common_config),{
                name: 'global_log',
                filename: this._config.file_global_log_path,
                level: this._config.file_log_level,
            });
            let global_file_transport = new winston.transports.DailyRotateFile(globalog_cfg);
            global_file_transport.on('error',(e)=>{ _ehd.e=e; this._transport_error_handler(_ehd); });
            logcfg.transports.push(global_file_transport);
        }


        /* FILE > error log */
        if(this._config.file_logging===true && !_.isNil(this._config.file_error_log_path)){
            console.log('LoggerWinston > add error logging on '+this._config.file_error_log_path);
            let errorlog_cfg = _.merge(_.merge({},_common_config),{
                name: 'error_log',
                filename: this._config.file_error_log_path,
                level: this._config.log_levels.error,
                maxsize:_common_config.maxsize*5, //bigger file for error logs
            });
            let error_file_transport = new winston.transports.DailyRotateFile(errorlog_cfg);
            error_file_transport.on('error',(e)=>{ _ehd.e=e; this._transport_error_handler(_ehd); });
            logcfg.transports.push(error_file_transport);
        }


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


        this._logger = new winston.Logger(logcfg);
    }


    log(){
        this._logger.silly.apply(null,Object.values(arguments)); // TODO: remove Object.values?
    };

    info(){
        this._logger.info.apply(null,Object.values(arguments));
    };

    error(){
        this._logger.error.apply(null,Object.values(arguments));
    };

    warn(){
        this._logger.warn.apply(null,Object.values(arguments));
    };
};


module.exports = LoggerWinston;
