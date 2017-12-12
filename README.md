# round-logger

[![NPM](https://nodei.co/npm/round-logger.png?downloads=true&downloadRank=true)](https://nodei.co/npm/round-logger/)

A simple rotative logger for Node.js, based on the great packages [winston](https://github.com/winstonjs/winston) and [winston-daily-rotate-file](https://github.com/winstonjs/winston-daily-rotate-file/).

**Ready-to-Go**. These packages are very powerful and rich of potentialities but their configuration takes some time. Therefore, I built a pre-configured rotative logger ready to be used! It offers a lot of possibilities to configure the logging behaviour, however the only required option is the absolute path of the logging files.

**Automatic directories**. By default, the log files are stored in different directories by year-month (named with the pattern "yyyy-mm"). A big problem for winston-daily-rotate-file is that it does not create automatically the directories when they do not exist. My solution provides the automatic creation of the directories which not exists.


## Set the logger in your project
```javascript
const LoggerFactory = require('./index.js');

const Logger = LoggerFactory.create({
    enabled:true,
    directory_logs_abs_path:__dirname+'/my-logs', //absolute path needed
});

// Set your own global Logger object...
global.Logger = Logger;

//...or replace the global console object
global.console = Logger
```

## How it works
* 'my-logs' is the general directory of log files
* every month will be created a new directory named 'yyyy-mm'
* every log file is about one day and it will be named 'yyyy-mm-dd-type.log'
* when the log file exceeds the max_file_size another file is created
```
my-logs
├── 2017-11
│   ├── 2017-11-29-error.log
│   ├── 2017-11-29-log.log
│   ├── 2017-11-30-error.log
│   └── 2017-11-30-log.log
└── 2017-12
    ├── 2017-12-01-error.log
    ├── 2017-12-01-log.log
    ├── 2017-12-01-error.log.1
    ├── 2017-12-01-log.log.1
    ├── 2017-12-01-error.log.2
    ├── 2017-12-01-log.log.2
    ├── 2017-12-02-error.log
    └── 2017-12-02-log.log
```


## Configuration
* **directory_logs_abs_path**: (default: '' / **REQUIRED**) Absolute path of logs directory. The directory where all logs files and directories are stored. Hint: use the global string `__directory`.
* **enabled**: (default: true) Enable logging
* **console_logging**: (default: true) Enable logging on console
* **file_logging**: (default: true) Enable logging on file
* **directory_date_pattern**: (default 'yyyy-MM') Pattern for directory names.
* **file_date_pattern**: (default: 'yyyy-MM-dd-') Pattern for file names.
* **max_file_size**: (default: 1000000) Max file size (Byte).
* **max_files**: (default: 10) Max number of log files per day.
* **file_global_log**: (default: 'log.log') Global log file name; the global log is a file with all log levels.
* **file_error_log**: (default: 'error.log') Error log file name; the error log is a file with error level only.
