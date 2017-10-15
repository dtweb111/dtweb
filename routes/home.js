var express = require('express');
var router = express.Router();

var homeController = require('../src/controllers/home');
var searchController = require('../src/searchController/home');

/* GET home page. */
router.get('/', homeController.index);
router.get('/search',searchController);
module.exports = router;
