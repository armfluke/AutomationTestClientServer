var robot = require("robotjs");
var os = require('os');
var osName = require('os-name');
const fs = require('fs');
const exec = require("child_process").exec;
var ip = require('ip');

function clickUninstall(){
    var screenSize = robot.getScreenSize();
    var height = screenSize.height;
    var width = screenSize.width;
    var x = width/2;

    for(let y=height/2;y<height;y+=1){
        robot.moveMouse(x,y);
        if(robot.getPixelColor(x, y) == "ff9f40"){
            robot.mouseClick();
            return true;
        }
    }
}

function writeFile(content,time){
    fs.writeFile(time+'result.json', JSON.stringify(content), function (err) {
        if (err){
            console.log(err);
        }
    });
}

function checkProcess(json){
    setTimeout(function(){
        exec('tasklist | findstr /R ^'+json.installerName,function(error,stdout,stderr){
            if(error){
                robot.keyTap('enter');
            }
        });
    }, 3000);
}

function writeResult(json,status,error){
    if(status == "Pass"){
        var content = {
            name : json.name,
            hostName: os.hostname(),
            ip: ip.address(),
            os: osName(os.platform(), os.release()),
            osArch: os.arch(),
            time: time,
            status : "Pass"
        }
        console.log(json.name+" successfully uninstall");
        console.log("------------------------------");
        console.log("!!! Automation Testing pass !!!");
    }else{
        var content = {
            name : json.name,
            hostName: os.hostname(),
            ip: ip.address(),
            os: osName(os.platform(), os.release()),
            osArch: os.arch(),
            time: time,
            status : status,
            error : error
        }
        console.log("------------------------------");
        console.log("!!! Automation Testing fail !!!");
    }
    writeFile(content,time);
}

var install = function(json,time){
    return new Promise(function(resolve,reject){   //install program
        console.log("Start installing "+json.name);
        var path = os.homedir()+json.installer;
        checkProcess(json);
        exec('start '+path,function(error,stdout,stderr){
            if(error){
                reject("Can't find "+json.name+" installer");
            }
            resolve();
        });
    }).then(    //check if program already install
        function(){
            return new Promise(function(resolve,reject){
                setTimeout(function(){
                    exec('tasklist | findstr /R ^'+json.processName,function(error,stdout,stderr){
                        if(stdout != ""){
                            resolve(json.name+" successfully install");
                        }
                        reject(json.name+" fail to install");
                    });
                }, 12000);
            });
        },function(error){
            throw error;
        }
    ).then(     //check if program install correctly
        function(success){
            console.log(success);
            return new Promise(function(resolve,reject){
                var path = os.homedir()+json.path;
                if (fs.existsSync(path)) {
                    resolve(json.name+" install correctly");
                }
                reject(json.name+" install with wrong path");
            });
        },function(error){
            throw error;
        }
    ).then(     //check if program create start menu
        function(success){
            console.log(success);
            return new Promise(function(resolve,reject){
                var pathInstall = os.homedir()+json.startMenuInstall;
                var pathUninstall = os.homedir()+json.startMenuUninstall;
                if (fs.existsSync(pathInstall) && fs.existsSync(pathUninstall)) {
                    resolve(json.name+" already create start menu");
                }
                reject("Start menu don't created");
            });
        },function(error){
            throw error;
        }
    ).then(     //kill program
        function(success){
            console.log(success);
            return new Promise(function(resolve,reject){
                exec('taskkill /IM '+json.processName+' /F',function(error,stdout,stderr){
                    if(error){
                        reject("Can't find process "+json.processName);
                    }
                    resolve();
                });
            });
        },function(error){
            throw error;
        }
    )
}

var uninstall = function(json,time){
    return new Promise(function(resolve,reject){
        console.log("Uninstalling "+json.name);
        checkProcess(json);
        var path = os.homedir()+json.installer+" --uninstall";
        exec('start '+path,function(error,stdout,stderr){
            if(error){
                reject("Can't find "+json.name+" installer");
            }
        });
        resolve();
    }).then(     //click to uninstall
        function(){
            setTimeout(function(){
                if(clickUninstall()){
                    writeResult(json,"Pass","");
                }else{
                    writeResult(json,"Fail","Can't click install button")
                }
            }, 7000);
        },function(error){
            throw error;
        }
    ).catch(function(error){
        writeResult(json,"Fail",error,time);
    });
}

var installationTest = function(json,time){
     install(json).then(function(){
        uninstall(json,time);
     },function(error,time){
        throw error
     }).catch(function(error){
        writeResult(json,"Fail",error,time);
    });
}

exports.install = install;
exports.uninstall = uninstall;
exports.installationTest = installationTest;