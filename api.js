var https = require("https");
var qs = require('querystring');


var api_options = {
    'ip':'192.168.137.8',
    'api_path':'/api/v1_0',    
    'port':44345,
    'ssl':true,
    'username':'',
    'password':''
}


module.exports = {

    setOptions:function(op){

        Object.keys(op).forEach(key => {
            if(key in api_options){
                api_options[key] = op[key]
            }
          });  
    },
     getToken:function (callback) {

    var data = qs.stringify({
        grant_type: 'password',
        username: api_options.username,
        password: api_options.password
    });


    const options = {
        method: "POST",
        hostname: api_options.ip,
        port: api_options.port,
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
            hostname: api_options.ip,
            port: api_options.port,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: api_options.api_path + '/status?e=1',
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
            hostname: api_options.ip,
            port: api_options.port,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: api_options.api_path + '/device',
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
    getDeviceSettings:function (token,callback) {
        const options = {
            method: "GET",
            hostname: api_options.ip,
            port: api_options.port,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: api_options.api_path + '/settings',
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
            hostname: api_options.ip,
            port: api_options.port,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: api_options.api_path + '/settings',
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
            hostname: api_options.ip,
            port: api_options.port,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: api_options.api_path + '/imageupdate',
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
            hostname: api_options.ip,
            port: api_options.port,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false,                
            path: api_options.api_path + '/imagedelete',
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