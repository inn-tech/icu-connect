# ICU™ Connect

A npm module to allow a user to connect and use an [Innovative Technology Ltd](https://innovative-technology.com) ICU Lite™ or ICU Pro™
Age/Face verification device.


## Features

- Use Device 'local API' mode
- Easy connection
- Device events
- Cross platform

---

## Options

Options can be set at object run function or using the seperate `set_options` request.


| Option | Description | Default |
|:------|:-----------|:-------:|
|`ip`|the ip address of the ICU device|192.168.137.8|
|`ssl`|true for HTTPS connection to ICU Device|true|
|`port`|the localAPI port number of the ICU device|44345|
|`username`|the localAPI username set on the ICU device||
|`password`|the localAPI password set on the ICU device||
|`db_dir`|the location directory for the database file|cwd|
|`db_name`|the filename for the databasefile|icu.db|

---

## Usage

The module initialises, connects, controls and reads the ICU™ device.
The ICU™ device needs to be set up in Local API mode. The user can chose SSL (https) connection or http and enter a security username and password on the 'Running Mode' tab on the device Web Config page http://{ip address>}:3000


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
    console.log('device connection',data)
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
    console.log('detected age (no id)',data.estimated_age)
})

/* 
    The detected face has been identifed as matching a stored ID
*/ 
icu.on('uid',function(data){
    console.log('detected age with id',data.estimated_age,data.uid)
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
### output
```
    device connection {
    DeviceId: '045dea23a',
    DeviceName: 'ICU-Touch',
    DeviceType: 'ICU-U-1',
    HwLevel: '10002',
    SWBuildVersion: '1070',
    Cameras: [
        { Name: 'ICU-Touch-camera', Type: 'usb', Data: '', Enabled: true },
        { Name: 'camera-2', Type: 'none', Data: 'none', Enabled: false }
    ]
    }
    state { device_state: 'initialising' }
    state { device_state: 'ready' }
    start
    detected age (no id) 42
    detected age (no id) 40
    detected age (no id) 42
    end
```
---
## Example
A working example using node and this module can be found on github [icu-connect-example-node](https://github.com/inn-tech/icu-connect-example-node.git)

