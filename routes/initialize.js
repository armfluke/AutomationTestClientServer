var config = require('../config.json')
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

module.exports.sendIP = sendIP