var express = require('express');
var router = express.Router();
var test = require('installation-automation-test')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {

  test.run('EikonLight')
    .then(() => {
      res.send('test done');
    })
    .catch((error) => {
      res.send('test error');
    })

  
});

module.exports = router;
