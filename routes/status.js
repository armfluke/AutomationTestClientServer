const OK = 'Service Availiable'
const BUSY = 'Service Unavailiable'

var status = OK

var get = function() {
    return {
        status: status
    }
}

var set = function(status) {
    this.status = status
}

var isAvailiable = function() {
    return this.status === OK
}

module.exports.set = set
module.exports.get = get
module.exports.isAvailiable = isAvailiable