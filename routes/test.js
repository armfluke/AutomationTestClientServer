var express = require('express');
var router = express.Router();
const os = require('os');
const exec = require("child_process").exec;
const fs = require('fs');
const request = require("request");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send({status: "OK"});
    var path = "../automationtest";
    console.log(path);
    exec("cd "+path+" && npm start "+req.query.name,function(error,stdout,stderr){
        fs.readFile('../automationtest/result.json', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            /*request.post('http://10.42.87.159:3000/submitres',
                {json: {result: data}},
                function(error,response,body){
                    if(error){
                        console.log(error);
                    }else{
                        console.log(response);
                    }
                }
            );*/
            //res.send(data);
        });
    });

    //res.render('index', { title: 'Express' });
});

module.exports = router;
