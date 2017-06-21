var config = require('../config.json')
var fs = require('fs')
var http = require('http')
var request = require('request')
var ip = require('ip')

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

module.exports.downloadInstaller = downloadInstaller
module.exports.sendIP = sendIP