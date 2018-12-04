const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  // call getNextUniqueId 
  counter.getNextUniqueId((err, id) => {
    // pass in a function which creates the filepath
    var filePath = path.join(exports.dataDir, (id + '.txt'));
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error writing toDo');
      } else {
        // pass { id, text } to the callback
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  var data = [];
  // iterate over file directory
  fs.readdir(exports.dataDir, (err, files) => {
  // check for possible errors
    if (err) {
      throw ('error retrieving files');
    } else {
      files.forEach(file => {
        var id = path.basename(file, '.txt');
        // create object for each file
        // push object to data
        data.push({ id, text: id });
      });
      // execute callback with data
      callback(null, data);
    }
  });

};

exports.readOne = (id, callback) => {
  //convert id to pathname
  var filePath = path.join(exports.dataDir, (id + '.txt'));
  //calling readfile with pathname
  // retrieve text contents
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(err, null);
    } else {
    // call callback with {id, text}
      callback(null, {id, text: fileData.toString('utf8')});
    }
  });

};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, (id + '.txt'));
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw ('unable to write over' + id + '.txt');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });

};

exports.delete = (id, callback) => {
  // get filePath from id
  var filePath = path.join(exports.dataDir, (id + '.txt'));
  // call fs.unlink with filePath
  fs.unlink(filePath, (err) => {
    if (err) {
      // call the callback with error if file doesn't exist
      callback(err);
    } else {
      // call the callback with no arguments
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
