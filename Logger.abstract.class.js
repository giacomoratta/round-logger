/**
 * Created by Giacomo on 30/01/2017.
 *
 * Abstract class for a Logger object.
 *
 */

let _ = require('lodash');
let path = require('path');



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                        DEFAULT CONFIGURATION
 */
let _default_config = {}


/**
 * Standard log levels
 */
_default_config.log_levels = {
    log: 'log',
    info: 'info',
    warn: 'warn',
    error: 'error'
};


/**
 * Flags for activate/deactivate internal functionalities
 */
_default_config.console_logging = true;
_default_config.file_logging = true;


/**
 * Minimum log level for console and file logging
 */
_default_config.console_log_level = 'log';
_default_config.file_log_level = 'log';


/**
 * Pattern for directory names.
 * Every time that date changes another directory is created.
 */
_default_config.directory_date_pattern = 'yyyy-MM';


/**
 * Pattern for file names.
 * Every time that date changes another log file is created.
 */
_default_config.file_date_pattern = 'yyyy-MM-dd-';


/**
 * Max file size (Byte).
 * When the log file exceeds this size, another log file is created.
 */
_default_config.max_file_size = 1000000; // 1 MByte


/**
 * Max number of log file per day.
 * When this number exceeds, another log file is created and the older log file is removed.
 */
_default_config.max_files = 10;


/**
 * Absolute path of logs directory.
 * The directory where all logs files and directories are stored.
 * Hint: use the global string __directory.
 */
_default_config.directory_logs_abs_path = '';


/**
 * Global log file name.
 * The global log is a file with all log strings.
 * The path should be set automatically.
 */
_default_config.file_global_log = 'log.log';
_default_config.file_global_log_path = '';


/**
 * Error log file name.
 * The error log is a file with error log strings only.
 * The path should be set automatically.
 */
_default_config.file_error_log = 'error.log';
_default_config.file_error_log_path = '';


/**
 * Exceptions log file name.
 * The exception log is a file with error log strings only.
 * The path should be set automatically.
 */
_default_config.file_exceptions_log = 'exceptions.log';
_default_config.file_exceptions_log_path = '';



const Logger = require('./Logger.class.js');

class LoggerAbstract extends Logger{

    constructor(logger,config){
        if (new.target === LoggerAbstract) {
            throw new TypeError("Cannot construct LoggerAbstract instances directly");
        }
        super();

        // Logger
        this._logger = logger;

        // ENUMS
        this._enums = {
            log_type: {
                log: 1,
                error: 2
            }
        };

        // CONFIG
        this._config = _.merge({},_default_config);
        this.config(config);
    }


    config(config){
        _.merge(this._config,config);

        // translate standard log levels into specific-logger log levels
        if(config.console_log_level) this._config.console_log_level = this._config.log_levels[config.console_log_level];
        this._config.console_log_level = this._config.log_levels[this._config.console_log_level];
        if(!this._config.console_log_level) this._config.console_log_level = this._config.log_levels.log;

        // translate standard log levels into specific-logger log levels
        if(config.file_log_level) this._config.file_log_level = this._config.log_levels[config.file_log_level];
        this._config.file_log_level = this._config.log_levels[this._config.file_log_level];
        if(!this._config.file_log_level) this._config.file_log_level = this._config.log_levels.log;

        // set paths
        this._config.file_global_log_path = path.join(this._config.directory_logs_abs_path,this._config.file_global_log);
        this._config.file_error_log_path = path.join(this._config.directory_logs_abs_path,this._config.file_error_log);
        this._config.file_exceptions_log_path = path.join(this._config.directory_logs_abs_path,this._config.file_exceptions_log);
        this._config.directory_logs_abs_path=path.join(this._config.directory_logs_abs_path,'');//force to set a well formatted path
        if(!this._config.directory_logs_abs_path || !this._config.directory_logs_abs_path.length || this._config.directory_logs_abs_path.length<=1) this._config.file_logging=false;

        this.status();
    }


    status(){
        console.log("Logger Status > \n"+JSON.stringify(this._config, null, 3));
    }

};

module.exports = LoggerAbstract;
