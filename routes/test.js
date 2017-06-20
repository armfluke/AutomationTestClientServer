var express = require('express');
var router = express.Router();
var config = require('../config.json')
const os = require('os');
const exec = require("child_process").exec;
const fs = require('fs');
const request = require("request");

var checkIfOperating = false;
/* GET home page. */
router.get('/', function(req, res, next) {
    if (!checkIfOperating) {
        checkIfOperating = true
        res.send({status: "OK"});
        var path = config.testPath;
        exec("cd "+path+" && npm start "+req.body.name,function(error,stdout,stderr){
            fs.readFile('../automationtest/result.json', 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                request.post('http://10.42.87.159:3000/submitres',
                    {json: {result: data}},
                    function(error,response,body){
                        if(error){
                            console.log(error);
                        }else{
                            console.log(response.body);
                        }
                    }
                );
                checkIfOperating = false
                //res.send(data);
            });
        });
    }
    else {
        res.send({status: "Server is busy, try again in few minute"})
    }

    //res.render('index', { title: 'Express' });
});

module.exports = router;
