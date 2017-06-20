var express = require('express');
var router = express.Router();
var config = require('../config.json')
var status = require('./status')
const os = require('os');
const exec = require("child_process").exec;
const fs = require('fs');
const request = require("request");

var checkIfOperating = false;
/* GET home page. */
router.get('/', function(req, res, next) {
    if (status.isAvailiable()) {
        status.set('Service Unavailable')
        var path = config.testPath;
        console.log(path)
        var name;
        if(req.params.hasOwnProperty("name")){
            name = req.params.name
        }else if(req.body.hasOwnProperty("name")){
            name = req.body.name
        }else if(req.query.hasOwnProperty("name")){
            name = req.query.name
        }else{
            res.send({status: "Error", error: "Please attach product name with HTTP request"});
            status.set("Service Available");
            return;
        }
        res.send({status: "OK"});
        console.log(name)
        exec("cd "+path+" && npm start "+name,function(error,stdout,stderr){
            if(error){
                console.log(error);
            }
            fs.readFile('./automationtest/result.json', 'utf8', function (err,data) {
                if (err) {
                    console.log(err);
                }
                request.post(config.serverIP+'submitres',
                    {json: {result: data}},
                    function(error,response,body){
                        if(error){
                            console.log(error);
                        }else{
                            console.log(response.body);
                        }
                    }
                );
                status.set('Service Available')
                //res.send(data);
            });
        });
    }else {
        res.send({status: "Server is busy, try again in few minute"})
    }

    //res.render('index', { title: 'Express' });
});

module.exports = router;
