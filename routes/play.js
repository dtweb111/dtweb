var express = require('express');
var router = express.Router();
var playController = require('../src/controllers/play');

/* GET play page */
router.get('/', playController.index);

/* POST play page */
router.post('/', playController.post);

module.exports = router;
