var https = require("https");
var qs = require('querystring');

var sysconfig = require('./config')

const ICU_HTTPS_PORT = 44345

module.exports = {
     getToken:function (username, password, callback) {

    var data = qs.stringify({
        grant_type: 'password',
        username: username,
        password: password
    });



    const options = {
        method: "POST",
        hostname: sysconfig.api.path,
        port: ICU_HTTPS_PORT,
        rejectUnauthorized: false,
        requestCert: true,
        agent: false,        
        path: "/Token",
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    }

    const req = https.request(options, (res) => {

        var dataQueue = "";
        res.on('data', (d) => {
            dataQueue += d;  
        });
        res.on('end', function () {
            if(res.statusCode == 200){
                dataQueue = JSON.parse(dataQueue);
            }
            callback(res.statusCode, dataQueue);
        });

        res.on('error', function(error){
            console.log('error',error)
        });

    })

    req.on('error', (error) => {
        callback(500, "");

    });
    req.write(data)
    req.end()

    },poll:function (token,callback) {
        const options = {
            method: "GET",
            hostname: sysconfig.api.path,
            port: ICU_HTTPS_PORT,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: sysconfig.api.base_url + '/status?e=1',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
        }
        const req = https.request(options, (res) => {
            var dataQueue = "";
            res.on('data', (d) => {
                dataQueue += d;
            });
            res.on('end', function () {
                if(res.statusCode == 200){
                    dataQueue = JSON.parse(dataQueue);
                }
                callback(res.statusCode, dataQueue);
            });
        })
    
        req.on('error', (error) => {
            callback(500, "");
        });
        req.end()
    
    },
    getDeviceDetail:function (token,callback) {
        const options = {
            method: "GET",
            hostname: sysconfig.api.path,
            port: ICU_HTTPS_PORT,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: sysconfig.api.base_url + '/device',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
        }
        const req = https.request(options, (res) => {
            var dataQueue = "";
            res.on('data', (d) => {
                dataQueue += d;
            });
            res.on('end', function () {
                if(res.statusCode == 200){
                    dataQueue = JSON.parse(dataQueue);
                }
                callback(res.statusCode, dataQueue);
            });
        })
    
        req.on('error', (error) => {
            console.log('poll',error)
            callback(500, "");
        });
        req.end()
    
    },
    getDeviceSettings:function (token,callback) {
        const options = {
            method: "GET",
            hostname: sysconfig.api.path,
            port: ICU_HTTPS_PORT,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: sysconfig.api.base_url + '/settings',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
        }
        const req = https.request(options, (res) => {
            var dataQueue = "";
            res.on('data', (d) => {
                dataQueue += d;
            });
            res.on('end', function () {
                if(res.statusCode == 200){
                    dataQueue = JSON.parse(dataQueue);
                }
                callback(res.statusCode, dataQueue);
            });
        })
    
        req.on('error', (error) => {
            callback(500, "");
        });
        req.end()
    
    },setDeviceSettings:function (token,settings,callback) {

        var data = JSON.stringify(settings)

        const options = {
            method: "POST",
            hostname: sysconfig.api.path,
            port: ICU_HTTPS_PORT,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: sysconfig.api.base_url + '/settings',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length                
                
            }
        }
        const req = https.request(options, (res) => {
            var dataQueue = "";
            res.on('data', (d) => {          
                dataQueue += d;
            });
            res.on('end', function () {
                if(res.statusCode == 200 && dataQueue.length > 0){
                    dataQueue = JSON.parse(dataQueue);
                }
                callback(res.statusCode, dataQueue);
            });
        })
    
        req.on('error', (error) => {
            callback(500, "");
        });
        req.write(data)    
        req.end()
    
    },updateFaces:function (token,faces,callback) {
        var data = JSON.stringify(faces)

        const options = {
            method: "POST",
            hostname: sysconfig.api.path,
            port: ICU_HTTPS_PORT,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: sysconfig.api.base_url + '/imageupdate',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length                
                
            }
        }
        const req = https.request(options, (res) => {
            var dataQueue = "";
            res.on('data', (d) => {          
                dataQueue += d;
            });
            res.on('end', function () {
                if(res.statusCode == 200 && dataQueue.length > 0){
                    dataQueue = JSON.parse(dataQueue);
                }
                callback(res.statusCode, dataQueue);
            });
        })
    
        req.on('error', (error) => {
            callback(500, "");
        });
        req.write(data)    
        req.end()
    
    }, deleteFaces:function (token,faces,callback) {
        var data = JSON.stringify(faces)

        const options = {
            method: "POST",
            hostname: sysconfig.api.path,
            port: ICU_HTTPS_PORT,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: sysconfig.api.base_url + '/imagedelete',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length                
                
            }
        }
        const req = https.request(options, (res) => {
            var dataQueue = "";
            res.on('data', (d) => {          
                dataQueue += d;
            });
            res.on('end', function () {
                if(res.statusCode == 200 && dataQueue.length > 0){
                    dataQueue = JSON.parse(dataQueue);
                }
                callback(res.statusCode, dataQueue);
            });
        })
    
        req.on('error', (error) => {
            callback(500, "");
        });
        req.write(data)    
        req.end()
    
    },   
}    