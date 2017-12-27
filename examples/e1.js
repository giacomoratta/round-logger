'use strict'

const LoggerFactory = require('../index.js');

const Logger = LoggerFactory.create({
    enabled:true,
    directory_logs_abs_path:__dirname+'/logs',
    max_file_size:100000
});

// Logger shoud be added to global objects or should replace the console object
// global.Logger = Logger
// global.console = Logger



for(let i=0; i<2; i++){
  Logger.log(__dirname);
  Logger.info(__dirname);
  Logger.error(__dirname);
  Logger.warn(__dirname);
}
