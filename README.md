# ICU Connect

A npm module to allow a user to connect and use an Innovative Technology Ltd ICU Lite™ or ICU Pro™
Age/Face verification device.


## Features

- Use Device 'local API mode'
- Easy connection
- Device events
- Cross platform

## Usage

The module initailises, connects, controls and reads the ICU™ device.
The ICU™ device needs to be set up in Local API mode. The user can chose SSL (https) connection or http and enter a security username and password on the 'Running Mode' tab on the device Web Config page (http://{ip address>}:{port number})


```javascript

    const {run,icu,enroll,set_options} = require('icu-connect')

    run({
        'rate':200
    });


    icu.on('connected',function(data){
        console.log('device',data)
    })


    icu.on('device_state',function(data){
        console.log('state',data)
    })



    icu.on('sessionstart',function(){
        console.log('start')
    })

    icu.on('sessionend',function(){
        console.log('end')
    })

    icu.on('age',function(data){
        console.log(data)
    })

    icu.on('uid',function(data){
        console.log(data)
    })