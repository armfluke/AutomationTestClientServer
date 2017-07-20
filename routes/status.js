 

var status = "Service Available"

var get = function() {
    return {
        status: status
    }
}

var set = function(newStatus) {
    status = newStatus
}

var isAvailiable = function() {
    return status == OK
}

module.exports.set = set
module.exports.get = get
module.exports.isAvailiable = isAvailiable