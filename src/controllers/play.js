var db = require('../services/db');

var playController = {};

playController.index = function(req, res){
    var result = {'playResult': 'GET index'};

    res.render('play', result);
};

playController.post = function(req, res){
    var params = req.body;
    console.log('Params: ', params);
    var result = {'playResult': JSON.stringify(req.body)};

    res.render('play', result);
};

module.exports = playController;
