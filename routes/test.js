var express = require('express');
var router = express.Router();
var config = require('../config.json')
var status = require('./status')
const os = require('os');
const exec = require("child_process").exec;
const fs = require('fs');
const parseString = require('xml2js').parseString;
const DOMParser = require('xmldom').DOMParser
const request = require("request");
const htmlToJson = require('html-to-json');
const tableToJson = require('tabletojson');
var http = require('http')

/* GET home page. */

router.get('/', function (req, res, next) {

    if (status.get().status == 'Service Available') {
        status.set('Service Unavailable')
        var dirPath = __dirname
        dirPath = dirPath.substr(0, dirPath.length - 6)
        var path = dirPath + config.testPath;
        console.log(path)



        var name = req.body.name || req.query.name
        if (!name) {
            res.send({
                status: "Error",
                error: "Please attach product name with HTTP request"
            });
            status.set("Service Available");
            return;
        }

        // var downloadUrl = req.body.url || req.query.url
        // if (!downloadUrl) {
        //     res.send({
        //         status: "Error",
        //         error: "Please attach download url with HTTP request"
        //     })
        //     status.set("Service Available")
        //     return;
        // }

        var test = req.body.test || req.query.test
        if (!test) {
            res.send({
                status: "No test found"
            })
            status.set("Service Available")
            return;
        }

        getUrlFromJenkins((url) => {
            if (url == 'error') {
                status.set("Service Available")
                res.send({
                    status: "Error"
                })
                return;
            }
            downloadInstaller(process.env.USERPROFILE + config.installerPath, url, function (err) {
                if (err) {
                    status.set('Service Available');
                    res.send({
                        status: "Error",
                        error: "Download Installer Failed (url: " + downloadUrl + ")"
                    })
                } else {
                    if (test === 'InstallationTest') {
                        res.send({
                            status: "OK"
                        });

                        runInstallationTest(name, path)
                    } else {
                        res.send({
                            status: "Error",
                            error: "There is no Test (" + test + ")"
                        });
                    }
                }
            });
        });


    } else {
        res.send({
            status: "Server is busy, try again in few minute"
        })
    }

    //res.render('index', { title: 'Express' });
});

function runInstallationTest(name, path) {
    console.log(name)
    var time = new Date();
    var date = time.toISOString().replace(/\:/g, '-');
    exec("cd " + path + " && npm start " + name + " " + date, function (error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        sendResult(date)
    });
}

function sendResult(time) {
    var dirPath = __dirname
    dirPath = dirPath.substr(0, dirPath.length - 6)
    console.log(dirPath)
    fs.readFile(dirPath + '/TestLogs/' + time + '/result.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        request.post(config.serverIP + 'submitres', {
                json: {
                    result: data
                }
            },
            function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response.body);
                }
            }
        );

        status.set('Service Available')
    });
}

function downloadInstaller(path, url, callback) {
    // var path = 
    // console.log(path)
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
    console.log('start downloading to path ' + path + ' from ' + url);
    // var file = fs.createWriteStream(path)
    // var request = http.get(url, function (response) {
    //     response.pipe(file)
    //     file.on('finish', function () {
    //         file.close(callback)
    //         console.log('download done')
    //     })

    // })
    // var options = {
    //     hostname  : url,
    //     path      : path,
    //     method    : 'GET'
    // };

    var file = fs.createWriteStream(path);

    var req = http.request(url, function (res) {
        //console.log("statusCode: ", res.statusCode);
        //console.log("headers: ", res.headers);
        if (res.statusCode == '200') {
            res.on('data', function (d) {
                file.write(d);
            });
            res.on('end', function () {
                file.close(callback)
                console.log('donwload done')
            })

            res.on('error', function (e) {
                console.error(e);
                file.close()
                fs.unlink(path)
                callback(e)
            });
        } else {
            file.close()
            fs.unlink(path)
            callback('error: ' + res.statusCode)
        }
    });
    req.end()

}

function getUrlFromJenkins(callback) {
    // var parser = new DOMParser()
    // request.get('http://ucbuild.int.thomsonreuters.com/job/EOE-build-(windows)/', function (error, response, body) {
    //     if (error) {
    //         console.log(error);
    //         return;
    //     }

    //     // var html = parser.parseFromString(response.body, "application/xml");

    // });
    tableToJson.convertUrl(
        'http://ucbuild.int.thomsonreuters.com/job/EOE-build-(windows)/', {
            useFirstRowForHeadings: true
        },
        function (tablesAsJson) {
            if (tablesAsJson) {
                let url = 'http://ucbuild.int.thomsonreuters.com/job/EOE-build-(windows)/lastSuccessfulBuild/artifact/dist/' + tablesAsJson[4][1][1]
                callback(url);
            } else {
                callback('error');
            }
        }
    );
}

module.exports = router;