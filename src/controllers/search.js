var async = require('async');

var db = require('../services/db');

var searchController = {};

searchController.index = function(req, res){
    var body = req.query;
    async.parallel({
        year: function(callback){
            var years = ['All'], currentYear = parseInt((new Date()).getFullYear());
            for(var i = 0; i < 10; i++){
                years.push(currentYear - i);
            }
            years.push('other');
            callback(null, years);
        },
        category: function(callback){
            var sql = "SELECT `name` FROM `categories` WHERE `activate` = 1 ORDER BY `name`";
            db.exec(sql, null, (err, data) => {       
                if (err || data.length < 1) {
                    callback(err);
                }else{
                    data.unshift({'name': 'All'});
                    callback(null, data);
                }
            });
        },
        searchData: function(callback){
            callback(null, body);
        }
    }, function(err, results){
        console.log('Results: ', results);
        if (err) {
            return res.redirect('/bad');
        }
        res.render('search', results);
    });
};

searchController.post = function(req, res){
    var body = req.body;
    console.log('Post: ', body);
    async.parallel({
        year: function(callback){
            var years = ['All'], currentYear = parseInt((new Date()).getFullYear());
            for(var i = 0; i < 10; i++){
                years.push(currentYear - i);
            }
            years.push('other');
            callback(null, years);
        },
        category: function(callback){
            var sql = "SELECT `name` FROM `categories` WHERE `activate` = 1 ORDER BY `name`";
            db.exec(sql, null, (err, data) => {       
                if (err || data.length < 1) {
                    callback(err);
                }else{
                    data.unshift({'name': 'All'});
                    callback(null, data);
                }
            });
        },
        searchData: function(callback){
            callback(null, body);
        }
    }, function(err, results){
        console.log('Results: ', results);
        if (err) {
            console.log('Error: ', err);
            return res.redirect('/bad');
        }
        res.render('search', results);
    });
};

searchController.list = function(req, res){
    var body = req.body;
    console.log('Body: ', body);
    if (!body.category || !body.year || !body.sort || !body.offset || !body.limit) {
        console.log('Post params error!');
        res.json({"error":"Search parameters are invalid"});
        console.log('after json()...');
    }
    async.parallel({
        'rowCount': function(callback){
            var sql, params = []
            if (body.keyword) {
                sql = 'SELECT COUNT(`video_id`) AS `total` FROM `search_all_videos` WHERE `video_name` LIKE ?';
                params.push('%' + body.keyword + '%');
            }else{
                if (body.category != 'All' && body.year != 'All'){
                    sql = 'SELECT COUNT(`video_id`) AS `total` FROM `search_combine` WHERE `category` = ? AND release_year = ?'; 
                    params.push(body.category, body.year);
                }else if(body.category != 'All'){
                    sql = 'SELECT COUNT(`video_id`) AS `total` FROM `search_combine` WHERE category = ?';
                    params.push(body.category);
                }else if(body.year != 'All'){
                    sql = 'SELECT COUNT(`video_id`) AS `total` FROM `search_all_videos` WHERE release_year = ?';
                    params.push(body.year);
                }else{
                    sql = 'SELECT COUNT(`video_id`) AS `total` FROM `search_all_videos`';
                }
            }
            console.log('Sql: ', sql);
            db.exec(sql, params, function(err, data){
                if (err || data.length < 1) {
                    callback(err);
                }else{
                    console.log('rowCount:', data);
                    callback(null, data[0]);
                }
            });
        },
        'rows': function(callback){
            var sql, params = []
            if(body.keyword){
                sql = 'SELECT `video_id`, `video_name`, `image_url`,`video_url`, `categories`, `release_date`, `views`, `rate` FROM `search_all_videos` WHERE `video_name` LIKE ?';
                params.push('%' + body.keyword + '%');
            }else{
                if (body.category != 'All' && body.year != 'All'){
                    sql = 'SELECT `video_id`, `video_name`, `image_url`,`video_url`, `categories`, `release_date`, `views`, `rate` FROM `search_combine` WHERE `category` = ? AND release_year = ?'; 
                    params.push(body.category, body.year);
                }else if(body.category != 'All'){
                    sql = 'SELECT `video_id`, `video_name`, `image_url`,`video_url`, `categories`, `release_date`, `views`, `rate` FROM `search_combine` WHERE category = ?';
                    params.push(body.category);
                }else if(body.year != 'All'){
                    sql = 'SELECT `video_id`, `video_name`, `image_url`,`video_url`, `categories`, `release_date`, `views`, `rate` FROM `search_all_videos` WHERE release_year = ?';
                    params.push(body.year);
                }else{
                    sql = 'SELECT `video_id`, `video_name`, `image_url`,`video_url`, `categories`, `release_date`, `views`, `rate` FROM `search_all_videos`';
                }
            }
            sql = sql + ' ORDER BY ?? DESC LIMIT ?, ?';
            params.push(body.sort, parseInt(body.offset), parseInt(body.limit));

            console.log('Sql: ', sql);
            console.log('params: ', params);
            db.exec(sql, params, function(err, data){
                if (err || data.length < 1) {
                    callback(err);
                }else{
                    console.log('Rows:', data);
                    callback(null, data);
                }
            });
        }
    }, function(err, results){
        console.log('Results: ', results);
        if (err) {
            res.json({"error":err});
        }else{
            res.json(results);
        }
    });
};

module.exports = searchController;
