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
    
            if(data != undefined){

                if('device_connected' in data){
                    if(data.device_connected){
                        evObj.emit('connected',data.device_data)                
                    }else{
                        evObj.emit('disconnected')                     
                    }
                }

                if('device_state' in data){
                    evObj.emit('device_state',data)
                }

                if('face_saved' in data){
                    evObj.emit('face_saved',data['face_saved'])
                }


                if(session_start && 'age' in data && 'uid' in data && data.uid === 'none'){
                    var c_data = {
                        'estimated_age':data.age,
                        'captured_image':data.image,
                        'feature':data.feature
                    }
                    evObj.emit('age',c_data)
                }
        
                if(session_start && 'uid' in data && data.uid !== 'none'){
                    var c_data = {
                        'estimated_age':data.age,
                        'captured_image':data.image,
                        'uid':data.uid,
                        'database_image':data.record_image
                    }                
                    evObj.emit('uid',c_data)
                }
        
        
                if(session_start == false && data.session){
                    evObj.emit('sessionstart',data)
                    session_start = true
                }else if(session_start == true && !data.session){
                    evObj.emit('sessionend',data)
                    session_start = false            
                }
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
