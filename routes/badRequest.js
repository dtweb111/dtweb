var express = require('express');
var router = express.Router();

var badRequestController = require('../src/controllers/badRequest');

/* GET home page. */
router.get('/', badRequestController.index);

module.exports = router;
