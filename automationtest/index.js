var test = require('./test');
var json = require('./product.json');

const args = process.argv;

if(args[2] != undefined && json.hasOwnProperty(args[2])){
    test.installationTest(json[args[2]],args[3]);
}else{
    console.log("Please add correct product name as a first parameter (product name list is in product.json) !!!");
}