var express = require('express');
var router = express.Router();

var associateController = require('../src/controllers/associate');

/* GET home page. */
router.get('/dmca', associateController.dmca);
router.get('/privacy', associateController.privacy);
router.get('/terms', associateController.terms);

module.exports = router;
