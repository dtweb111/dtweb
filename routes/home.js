var express = require('express');
var router = express.Router();

var homeController = require('../src/controllers/home');
var searchController = require('../src/controllers/search');

/* GET home page. */
router.get('/', homeController.index);
router.get('/search',searchController.index);
module.exports = router;
