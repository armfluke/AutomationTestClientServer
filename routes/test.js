var express = require('express');
var router = express.Router();
var config = require('../config.json')
var status = require('./status')
const os = require('os');
const exec = require("child_process").exec;
const fs = require('fs');
const request = require("request");
var http = require('http')

/* GET home page. */

router.get('/', function (req, res, next) {
    if (status.isAvailiable()) {
        status.set('Service Unavailable')
        var path = config.testPath;
        console.log(path)
        
        var name = req.body.name
        if(!name) {
            res.send({status: "Error", error: "Please attach product name with HTTP request"});
            status.set("Service Available");
            return;
        }

        var downloadUrl = req.body.url 
        if (!downloadUrl) {
            res.send({ status: "Error", error: "Please attach download url with HTTP request" })
            status.set("Service Available")
            return;
        }

        var test = req.body.test
        if (!test) {
            res.send({ status: "No test found" })
            status.set("Service Available")
            return;
        }

        downloadInstaller(process.env.USERPROFILE + config.installerPath, downloadUrl, function (downloadResponse, err) {
            if (err) {
                status.set('Service Available')
                res.send({ status: "Error", error: "Download Installer Failed (url: " + downloadUrl + ")" })
            }
            else {
                
                res.send({ status: "OK" });
                console.log(name)
                var time = new Date();
                exec("cd " + path + " && npm start " + name +" "+ time, function(error, stdout, stderr){
                    if(error){
                        console.log(error);
                    }
                    fs.readFile('./automationtest/'+time+'/result.json', 'utf8', function (err,data) {
                        if (err) {
                            console.log(err);
                        }
                        request.post(config.serverIP + 'submitres',
                            { json: { result: data } },
                            function (error, response, body) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(response.body);
                                }
                            }
                        );
                        status.set('Service Available')
                        //res.send(data);
                    });
                });
            }
        })
    } else {
        res.send({ status: "Server is busy, try again in few minute" })
    }

    //res.render('index', { title: 'Express' });
});


function downloadInstaller(path, url, callback) {
    // var path = 
    // console.log(path)
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
    console.log('start downloading to path ' + path + ' from ' + config.installerUrl)
    var file = fs.createWriteStream(path)
    var request = http.get(url, function (response) {
        response.pipe(file)
        file.on('finish', function () {
            file.close(callback)
            console.log('download done')
        })

    }).on('error', function (err) {
        fs.unlink(path)
        console.log(err)
        if (callback) callback(err)
    })
}

module.exports = router;
