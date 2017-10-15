var db = require('../services/db');

var searchController = {};

searchController.index = function(req, res){
    var result = {};
    var sql = 'SELECT * FROM `search_top_n_released`';
    db.exec(sql, null, (err, data) => {
        result.resultTopNRelease = data;
        var sql = 'SELECT * FROM `search_top_n_views`';
        db.exec(sql, null, (err, data) => {
            result.resultTopNViews = data;
            res.render('search', result);
        });
    });
};

module.exports = searchController;
