var config = require('../config.json')
var request = require('request')

var sendIP = function() {
    var serverRoute = config.serverIP + 'init'
    console.log(serverRoute)
    request.post(config.serverIP + 'init', {json: {ip: '1.2.2.2'}}, function(err, res, body) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(body)
        }
    })
}

module.exports.sendIP = sendIP