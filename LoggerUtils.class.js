'use strict'

let _ = require('lodash');
let path = require('path');
let fs = require('fs-extra');

class LoggerUtils{

    constructor(){
    }

    createPath(p, options){
        if(!p || !_.isString(p)) return;
        if(!options) options={};
        if(options.stripFilename===true){
            p=path.dirname(p);
        }
        fs.ensureDir(p); //async
    }

}

module.exports = new LoggerUtils();
