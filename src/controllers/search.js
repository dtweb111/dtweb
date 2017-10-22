var db = require('../services/db');

var searchController = {};

searchController.index = function(req, res){
    var result = {'searchResult': 'GET index'};

    res.render('search', result);
};

searchController.post = function(req, res){
    var params = req.body;
    console.log('Params: ', params);
    var result = {'searchResult': JSON.stringify(req.body)};

    res.render('search', result);
};

module.exports = searchController;
