var express = require('express');
var router = express.Router();

var androidApi = require('../src/api/android');

router.post('/movie-info', androidApi.movieInfo);

router.post('/season-info', androidApi.seasonInfo);

router.post('/episode-info', androidApi.episodeInfo);

router.post('/video-url', androidApi.videoUrl);

module.exports = router;
