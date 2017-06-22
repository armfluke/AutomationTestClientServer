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
    console.log('my ip is ' + myIP)
    request.post(config.serverIP + 'init', {json: {ip: myIP}}, function(err, res, body) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(body)
        }
    })
}

var downloadInstaller = function() {
    var path = process.env.USERPROFILE + config.installerPath
    // console.log(path)
    if (!fs.existsSync(path)) {
        console.log('start downloading to path ' + path + ' from ' + config.installerUrl)
        var file = fs.createWriteStream(path)
        var request = http.get(config.installerUrl, function(response) {
            response.pipe(file)
            console.log('download done')
        })
    }
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

module.exports.downloadInstaller = downloadInstaller
module.exports.sendIP = sendIP
module.exports.copyBat = copyBat