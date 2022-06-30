# ICU™ Connect

A npm module to allow a user to connect and use an Innovative Technology Ltd ICU Lite™ or ICU Pro™
Age/Face verification device.


## Features

- Use Device 'local API' mode
- Easy connection
- Device events
- Cross platform

## Usage

The module initailises, connects, controls and reads the ICU™ device.
The ICU™ device needs to be set up in Local API mode. The user can chose SSL (https) connection or http and enter a security username and password on the 'Running Mode' tab on the device Web Config page (http://{ip address>}:{port number})


```javascript

const {run,icu,enroll,set_options} = require('icu-connect')

// start the ICU device with options
run({
    'ip':'192.168.137.8',
    'ssl':true,
    'port':44345,
    'username':<icu_username>,
    'password':<icu_password>
});


/* 
    connected event - an ICU device has been connected.
    data parameter is a JSON object giving device details
*/ 
icu.on('connected',function(data){
    console.log('device',data)
})


/* 
    connected event - an ICU device has been connected.
    data parameter is a JSON object giving device details
*/ 
icu.on('disconnected',function(){
    console.log('device disconnected')
})



/* 
    device_state event - data parmeter shows 'initialising' or 'ready'
*/ 
icu.on('device_state',function(data){
    console.log('state',data)
})


/* 
    A face has been detected by the ICU and a detection session has started
*/ 
icu.on('sessionstart',function(){
    console.log('start')
})

/* 
    The face is no longer detected by the ICU device
*/ 
icu.on('sessionend',function(){
    console.log('end')
})

/* 
    The detected face has not beed identifed and estimated age is given
*/ 
icu.on('age',function(data){
    console.log(data.estimated_age)
})

/* 
    The detected face has been identifed as matching a stored ID
*/ 
icu.on('uid',function(data){
    console.log(data.estimated_age,data.uid)
})



```


