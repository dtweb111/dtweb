var express = require('express');
var router = express.Router();

var searchController = require('../src/controllers/search');

/* GET search page. */
router.get('/', searchController.index);

/* POST search page. */
router.post('/', searchController.post);

module.exports = router;
