var config = require('../config.json')
var fs = require('fs')
var http = require('http')
var request = require('request')
var ip = require('ip')
var cpr = require('cpr').cpr

var sendIP = function() {
    var serverRoute = config.serverIP + 'init'
    console.log(serverRoute)
    var myIP = ip.address() + ':' + config.port
    var myID = '1234'; //uniqueID
    console.log('my ip is ' + myIP)
    request.post(config.serverIP + 'init', {json: {ip: myIP, id:myID}}, function(err, res, body) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(body)
        }
    })
}

var copyBat = function() {
    var dest = process.env.USERPROFILE + '\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\test.bat'
    var batDir = __dirname
    batDir = batDir.substr(0, batDir.length - 6)
    var src =  batDir + '\\bat\\test.bat'
    console.log('start copy test.bat from ' + src + ' to ' + dest)
    cpr(src, dest, { overwrite: true }, function(err){
        if (err) {
            console.log(err)
        }
        else {
            console.log('copy done')
        }
    })
    // ncp(src, dest, function(err) {
    //     if (err) {
    //         return console.err
    //     }
    //     console.log('copy test.bat to ' + dest)
    // })
}

module.exports.sendIP = sendIP
module.exports.copyBat = copyBat