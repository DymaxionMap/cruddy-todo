const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const promissifiedReadCounter = () => {
  return (new Promise((resolve, reject) => {
    fs.readFile(exports.counterFile, (err, fileData) => {
      if (err) {
        return reject(err);
      }
      resolve(Number(fileData));
    });
  }));
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

const promissifiedWriteCounter = (count) => {
  return new Promise((resolve, reject) => {
    var counterString = zeroPaddedNumber(count);
    fs.writeFile(exports.counterFile, counterString, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(counterString);
    });
  });
};


// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {

  // OLD CALLBACK VERSION
  // // read the current counter file
  // readCounter((err, count) => {
  // // increment the counter
  //   count = count + 1;
  //   // write the new counter to file
  //   writeCounter(count, (err, counterString) => {
  //   // pass the new counter to the callback
  //     callback(err, counterString);
  //   });
  // });

  // PROMISE VERSION
  promissifiedReadCounter()
    .then(count => {
      count += 1;
      return count;
    })
    .then(incrementedCount => promissifiedWriteCounter(incrementedCount))
    .then(counterString => callback(null, counterString));
};

exports.promiseGetNextId = () => {
  return new Promise((resolve, reject) => {
    promissifiedReadCounter()
      .then(count => {
        count += 1;
        return count;
      })
      .then(incrementedCount => promissifiedWriteCounter(incrementedCount))
      .then(counterString => resolve(counterString));
  });
};


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
