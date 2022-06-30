const api = require('./api')
const db = require('./dao')
const uuid = require('uuid')

const sleep = ms => new Promise(r => setTimeout(r, ms));

const SM_CONNECT = 0;
const SM_WAIT = 1;
const SM_POLL = 2;
const SM_UPDATE_FACES = 3;
const SM_DETAIL = 4;
const SM_GET_SETTINGS = 5;
const SM_SET_SETTINGS = 6;
const SM_PURGE_FACES = 7;


var smState = SM_CONNECT;
var token = "";
var runSM = false;
var LastFaceUpdate = 0;

var enrollData = []
var icuDeviceDetail = {}
var icuDeviceSetting = {}
var enrollRecords = []
const enrollBatchMax = 50
var enrollBatchIndex = 0

var noFaceCount = 0
var faceCount = 0
var readySent = false
var disconnectSent = true



function SetOptions(op)
{
  api.setOptions(op)
}



function NewFaceData(data){

  // add data to array
//  enrollData.push(data)

}


function SetState(main_callback){


    // check for any enrollments (any items on array)
    if(smState == SM_POLL && enrollData.length > 0){   
      // get the first array item
        var face = enrollData.pop()   
        // save it to the database. The state-machine will then see a new addition and send it to the ICU
        SaveFace(face)
    }      


      switch (smState) {
          case SM_WAIT:
          // do nothing             
            break;
          case SM_CONNECT:
            if(!disconnectSent){
              var c_data = {
                'device_connected':false,
              }
              disconnectSent = true;
              main_callback(c_data)              
            }            
            readySent = false
            api.getToken(function (statusCode, apiresponse) {
              if (statusCode == 200) {
                token = apiresponse.access_token
                smState = SM_DETAIL
              } else {                 
                smState = SM_CONNECT
              }
            });
            smState = SM_WAIT;
            break;
            case SM_DETAIL:
              api.getDeviceDetail(token,function(statusCode,apiresponse){
                if(statusCode == 200){
                  icuDeviceDetail = apiresponse;
                  var c_data = {
                    'device_connected':true,
                    'device_data':icuDeviceDetail
                  }
                  main_callback(c_data)
                  smState = SM_PURGE_FACES
                }else{
                  disconnectSent = false                  
                  smState = SM_CONNECT;
                }
              });
              smState = SM_WAIT;          
              break;        
              case SM_PURGE_FACES:
                main_callback({
                  'device_state':'initialising'
                })
                  var facedel = {
                    uid:["all"]
                  }
                  api.deleteFaces(token,facedel,function(statusCode,apiresponse){
                    if(statusCode == 200){
                      smState = SM_GET_SETTINGS
                    }else{
                      disconnectSent = false
                      smState = SM_CONNECT;
                    }
                  });     
                  smState = SM_WAIT;     
                  break;   
              case SM_GET_SETTINGS:
                  api.getDeviceSettings(token,function(statusCode,apiresponse){
                      if(statusCode == 200){
                        icuDeviceSetting = apiresponse;
                        smState = SM_SET_SETTINGS
                      }else{
                        disconnectSent = false                        
                        smState = SM_CONNECT;
                      }
                  });
                  smState = SM_WAIT;             
                  break;
                  case SM_SET_SETTINGS:
                  var ab = {
                      Cameras:[
                      {
                          Id_Index:0,
                          Active_Box:true
                      }
                      ]
                  }
                  api.setDeviceSettings(token,ab,function(statusCode,apiresponse){
                      if(statusCode == 200){              
                        smState = SM_POLL
                      }else{
                        disconnectSent = false;                        
                        smState = SM_CONNECT;
                      }
                  });
                  smState = SM_WAIT;             
                  break;     
              case SM_POLL:
                  api.poll(token,function(statusCode,apiresponse){
                      if(statusCode == 200){
                          if(!readySent && 'DeviceState' in apiresponse && apiresponse['DeviceState'] == 'ready'){
                            main_callback({
                              'device_state':'ready'
                            })
                            readySent = true
                          }
                          parsePoll(apiresponse, function(response,data){                                                    
                          smState = response;      
                          if(smState == SM_UPDATE_FACES){
                              enrollRecords = data;
                              enrollBatchIndex = 0;
                          }else{
                            if(data){
                              main_callback(data)
                            }
                          }              
                          });         
                      }else{
                          disconnectSent = false
                          smState = SM_CONNECT;
                      }
                  });
                  smState = SM_WAIT;
                  break;  
              case SM_UPDATE_FACES:
                  var recEnd = (enrollBatchIndex*enrollBatchMax) + enrollBatchMax        
                  var loopEnd = false;               
                  if(enrollRecords.length <= recEnd){
                      recEnd = (enrollBatchIndex*enrollBatchMax) +  enrollRecords.length - (enrollBatchIndex*enrollBatchMax)
                      loopEnd = true;
                  }
                  var up = []
                  for(i = (enrollBatchIndex*enrollBatchMax); i < recEnd; i++){
                      var fc = {
                      Uid:enrollRecords[i].face_id,
                      Version:enrollRecords[i].face_version,
                      Data:enrollRecords[i].face_data,
                      Group:enrollRecords[i].user_group,
                      GroupId:enrollRecords[i].group_id
                      }
                      up.push(fc)
                  }
                  var face_data = {
                      last_update_time:LastFaceUpdate,
                      updates:up
                  }
                  api.updateFaces(token,face_data,function(status,result){            
                      if(loopEnd){
                      smState = SM_POLL
                      }else{
                      enrollBatchIndex += 1
                      smState = SM_UPDATE_FACES
                      }
                  });
                  smState = SM_WAIT
                  break;                                                        
                  
      }        

}



function parsePoll(apiresponse, callback)
{

  var data = null

  if(('FaceInFrame' in apiresponse && apiresponse.FaceInFrame[0].Face) || 
      (apiresponse.Detections !== null && apiresponse.Detections.length > 0) ){

        noFaceCount = 0
        faceCount++

          if(faceCount >= 0 && apiresponse.Detections.length > 0){
            data = {
                age:apiresponse.Detections[0].Age,
                uid:apiresponse.Detections[0].Uid,
                image:apiresponse.Detections[0].Image,
                feature:apiresponse.Detections[0].Feature
            }

            data['session'] = true
            if(data.uid != 'none'){       
              db.getRecordById(data.uid,function(error,result){
                  if(error){
                    data['record_image'] = ''
                  }
                  if(result && result.length == 1){ 
                    data['record_image'] = result[0].face_image
                  }else{
                    data['record_image'] = ''                    
                  }
              });
               
            }else{
                data['record_image'] = ''
            }

          }else{
            data = {
              'session':true
            }
          }
                  
       
  }else{

    noFaceCount++
    if(noFaceCount >= 3){
      data = {
        'session':false
      }
      noFaceCount = 0
      faceCount = 0      
    }
  }

  db.getUpdates(apiresponse.LastFaceUpdate, function(err,result){
      if(!err && result.length){
          LastFaceUpdate = result[0].added            
          callback(SM_UPDATE_FACES,result)
      }else{
          callback(SM_POLL, data)
      }
  });

}


function SaveFace(faceData,callback)
{
        const buff = Buffer.from(faceData.feature, 'base64');  
        const val = uuid.v4();    
        var datesecs = Math.floor(Date.now()/1000)
        var face = {
            face_id:val,
            face_data:buff.toString('utf-8'),
            firstname:'',
            surname: '',
            user_group:'Enrolled',
            group_id:0,
            face_version:"2.0",
            face_image:faceData.image,
            added:datesecs
        }

        db.addFace(face,function(err,result){
            if(err){
                callback('fail')
            }else{
                callback('ok')
            }
        });  

}


module.exports = {
  EnrollData:NewFaceData,
  SetState:SetState,
  SetOptions:SetOptions
}