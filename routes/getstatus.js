var express = require('express');
var router = express.Router();
var status = require('./status')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json(status.get());
});

module.exports = router;