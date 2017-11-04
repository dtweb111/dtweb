var fs = require('fs');
var os = require('os');
var datetime = require('node-datetime');

var config = require('../../config/config');

var io = {};

/**
 * Utils for Log
 */
io.logFile = function(logType, message, consoleFlag){
    var filePath = '';
    console.log('Config:', config);
    for (var p in config.log) {
        if (p == logType) {
            filePath = config.log[p];
        }
    }
    if (!filePath) {
        console.log('Log type {', logType, '} is defined correctly in config file');
        return;
    }
    message = datetime.create().format('Y-m-d H:M:S') + ' ' + message + os.EOL;
    fs.appendFile(filePath, message, (err) => {
        if (err) {
            console.error('Failed to open log file for log type {', logType, '}');
            return;
        }
    });
    if (consoleFlag) {
        console.log(message);
    }
};

/**
 * Utils for redirection
 */
io.redirect2BadRequest = function(req, res, next){
    return res.redirect('/bad');
};

module.exports = io;
