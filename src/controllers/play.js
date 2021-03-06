var db = require('../services/db');
var utils = require('../services/utils');

var playController = {};

playController.index = function(req, res){
    res.render('play-bk');
};

playController.post = function(req, res, next){
    var result, body = req.body;
    if (!body.id){
        return res.redirect('/bad');
    }
    var sql = "SELECT `video_url`, `video_name`, `categories`, `directors`, `actors`, `release_date`, `run_time`, `views`, `rate`, `description`, `storyline` FROM `search_all_videos` WHERE `video_id` = ?";
    db.exec(sql, [body.id], (err, data) => {
        if (err || data.length < 1) {
            return res.redirect('/bad');
        }
        result = data[0];
        result.number2kview = utils.number2kview;
        result.run_time = result.run_time ? result.run_time : 'N.A.';
        res.render('play', result);
    });
};

module.exports = playController;
