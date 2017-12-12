
let _ = require('lodash');
let path = require('path');
let fs = require('fs-extra');

class LoggerUtils{

    constructor(){
    }


    /**
     * Create a path if not exists.
     * @param {string} entire_path - absolute entire path
     * @param {string} start_path - absolute starting path
     * @param {array} _epath_pieces - [private] pieces of the entire_path
     * @param {array} _spath_pieces - [private] pieces of the start_path
     * @param {integer} _index - [private] index of the entire_path
     * @return {Promise}
     */
    createPath(entire_path, start_path, _epath_pieces, _spath_pieces, _index){
        if(!entire_path || !start_path) return;
        if(_epath_pieces && _spath_pieces){

          //console.log('IF',entire_path,start_path,_epath_pieces,_spath_pieces,_index);
          _index++;
          let _spath_string = _spath_pieces.join(path.sep);
          if(_index>=_epath_pieces.length) return; //stop condition
          _spath_pieces.push(_epath_pieces[_index]);

          return this.ensureDir(_spath_string).then((d)=>{
              //console.log('ensureDir',path);
              if(d!==true) return;
              return this.createPath(entire_path, start_path, _epath_pieces, _spath_pieces, _index);
          });

        }else{
            let ep = path.normalize(entire_path);
            let sp = path.normalize(start_path);
            if(!ep.startsWith(sp)) return;
            let _epath_pieces = ep.split(path.sep);
            let _spath_pieces = sp.split(path.sep);
            //console.log('ELSE',ep,sp,_epath_pieces,_spath_pieces);
            if(_epath_pieces.length < _spath_pieces.length) return;
            _index = _spath_pieces.length-1;

            return this.createPath(entire_path, start_path, _epath_pieces, _spath_pieces, _index);
        }
    }


    /**
     * Create a directory if not exists.
     * @param {string} dirpath - directory path
     * @return {Promise}
     */
    ensureDir(dirpath){
        return new Promise((resolve,reject)=>{
            fs.ensureDir(dirpath, function(err){
                //console.log("Check or create '"+dirpath+"'.");
                if(!err){
                    resolve(true);
                    return;
                }
                //console.log(err);
                //console.log("Error while checking and creating directory "+dirpath+" ...");
                reject(err);
            });
        });
    };

}

module.exports = new LoggerUtils();
