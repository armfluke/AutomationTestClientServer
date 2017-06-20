var express = require('express');
var router = express.Router();
const os = require('os');
const exec = require("child_process").exec
const $ = require('jquery');

/* GET home page. */
router.options('/', function(req, res, next) {
    $.ajax({
        url: "http://localhost:3000/test",
        type: "OPTIONS",
        data: {
            name: "Eikon Light",
            test: "InstaltionTest"
        },
        success: function(response){
            console.log(response);
        },
        error: function(error){
            console.log(error);
        }
    });
    /*var path = os.homedir()+"/Desktop/automationtest";
    exec('cd '+path,function(error,stdout,stderr){
        exec('npm start',function(error,stdout,stderr){
            
        });
    });*/
  //res.render('index', { title: 'Express' });
});

module.exports = router;
