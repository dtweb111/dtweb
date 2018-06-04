var db = require('../services/db');

var androidApi = {};
var errorJson = {
    'status': 500,
    'message': ''
};

androidApi.movieInfo = function(req, res){
    var body = req.body;
    
    if (!body.changedDateId) {
        errorJson.message = 'Parameter {changedDateId} is missing.';
        res.json(errorJson);
    }

    var sql = "SELECT video_id, image_url,video_name, 1 AS video_type_id,definition,categories,run_time,country,release_date,release_year,storyline AS description,changed_date_id FROM `search_all_videos` WHERE changed_date_id >= ?";
    
    db.exec(sql, [body.changedDateId], (err, data) => {
        if (err) {
            errorJson.error = err;
            res.json(errorJson);
        } else {
            res.json(data);
        }
    });
};

androidApi.seasonInfo = function(req, res){
    var body = req.body;
    
    if (!body.changedDateId) {
        errorJson.message = 'Parameter {changedDateId} is missing.';
        res.json(errorJson);
    }

    var sql = "SELECT tvseries_id AS video_id, image_url,tv_name AS video_name, 2 AS video_type_id,tv_station,categories,release_year,country,latest_episode,total_seasons,description,changed_date_id FROM `search_all_tvs` WHERE changed_date_id >= ?";
    
    db.exec(sql, [body.changedDateId], (err, data) => {
        if (err) {
            errorJson.error = err;
            res.json(errorJson);
        } else {
            res.json(data);
        }
    });
};

androidApi.episodeInfo = function(req, res){
    var body = req.body;
    
    if (!body.changedDateId) {
        errorJson.message = 'Parameter {changedDateId} is missing.';
        res.json(errorJson);
    }

    var sql = "select id AS video_id,tvseries_id,season,episode,changed_date_id from videos where video_type_id = 2 and changed_date_id >= ?";
    
    db.exec(sql, [body.changedDateId], (err, data) => {
        if (err) {
            errorJson.error = err;
            res.json(errorJson);
        } else {
            res.json(data);
        }
    });
};

androidApi.videoUrl = function(req, res){
    var body = req.body;
    
    if (!body.videoId) {
        errorJson.message = 'Parameter {videoId} is missing.';
        res.json(errorJson);
    }

    var sql = "select url AS video_url from urls where video_id = ?";
    
    db.exec(sql, [body.videoId], (err, data) => {
        if (err) {
            errorJson.error = err;
            res.json(errorJson);
        } else {
            res.json(data);
        }
    });
};

module.exports = androidApi;
