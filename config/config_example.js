var path = require('path');

var config = {};

config.db = {
    'host': 'example',
    'port': 'example',
    'database': 'example',
    'username': 'example',
    'password': 'example'
};

config.www = {
    'port': 'example'
};

config.log = {
    'express': path.join(__dirname, 'example')
};

config.env = 'dev';

module.exports = config;