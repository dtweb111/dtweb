var db = require('../services/db');

var homeController = {};

homeController.index = function(req, res){
    var result = {};
    var sql = 'SELECT * FROM `search_top_n_released`';
    db.exec(sql, null, (err, data) => {
        result.resultTopNReleased = data;
        var sql = 'SELECT * FROM `search_top_n_views`';
        db.exec(sql, null, (err, data) => {
            result.resultTopNViews = data;
            res.render('home', result);
        });
    });
};

module.exports = homeController;
