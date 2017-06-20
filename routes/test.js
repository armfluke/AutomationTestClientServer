var express = require('express');
var router = express.Router();
const os = require('os');
const exec = require("child_process").exec

/* GET home page. */
router.options('/', function(req, res, next) {
    //console.log(req.params+req.body+req.query);
    res.send(req.body);
    /*var path = os.homedir()+"/Desktop/automationtest";
    exec('cd '+path,function(error,stdout,stderr){
        exec('npm start',function(error,stdout,stderr){
            
        });
    });*/
  //res.render('index', { title: 'Express' });
});

module.exports = router;
