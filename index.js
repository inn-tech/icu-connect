const icu = require("./icu");
var EventEmitter  = require('events');
var evObj = new EventEmitter();

var session_start = false;

var sys_op = {
    'rate':200
}

function Enroll(data){
    icu.EnrollData(data)
}


function SetOptions(options)
{

    if(options !== undefined){
        //forward options to ICU
        icu.SetOptions(options);
        // set this module's options
        if( 'rate' in options){
            if(options.rate >= 50 && options.rate <= 1000)
            sys_op.rate = options.rate
        }
   }    

}


function Run(options)
{

    SetOptions(options)

    setInterval(function(){
        icu.SetState(function(data){
    
            if('device_connected' in data){
                evObj.emit('connected',data.device_data)                
            }

            if('device_state' in data){
                evObj.emit('device_state',data)
            }

            if(session_start && 'age' in data){
                evObj.emit('age',data.age)
            }
    
            if(session_start && 'uid' in data && data.uid !== 'none'){
                evObj.emit('uid',data.age)
            }
    
    
            if(session_start == false && data.session){
                evObj.emit('sessionstart',data)
                session_start = true
            }else if(session_start == true && !data.session){
                evObj.emit('sessionend',data)
                session_start = false            
            }
    
        })
    },sys_op.rate)    

}







module.exports = {
    run:Run,
    icu:evObj,
    enroll:Enroll, 
    set_options:SetOptions   
  }
