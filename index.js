
const {Worker} = require("worker_threads");

let num = 40;

const worker = new Worker("./icu.js", {workerData: {num: num}});

//Listen for a message from worker
worker.once("message", result => {
  console.log(`${num}th Fibonacci Number: ${result}`);
});

worker.on("error", error => {
  console.log(error);
});

worker.on("exit", exitCode => {
  console.log(exitCode);
})

console.log("Executed in the parent thread");



//const icu = require('./icu')
//var EventEmitter  = require('events');
//var eventEmitter = new EventEmitter();

//const sleep = ms => new Promise(r => setTimeout(r, ms));

//module.exports = eventEmitter

//var newSession = false;


// eventEmitter.on('test',function(){
// //    console.log('test')
// })


// run()
// console.log('mod')


// async function runState(){


//     console.log('connect test','run')

//     while(true){

//         await sleep(600)
//     // console.log('test1')
//     // await sleep(600)

//         // d = true;
//         // setTimeout(() => {
//         //     d = false
//         //     console.log('tock')
//         // },6);
//         // console.log('wait')
//         // while(d == true){}

//         // console.log('tick')

//     // sleep(500)

//     }
// }





// icu.StartSM(function(icu_data){

 

//     if(icu_data.session){
//         if(!newSession){
//             eventEmitter.emit('sessionstart')
//             newSession = true
//         }

//         if('age' in icu_data){
//             eventEmitter.emit('age',{'estimated_age':icu_data.age})
//         }
//         if('uid' in icu_data && icu_data.uid !== 'none'){
//             eventEmitter.emit('id',{'uid':icu_data['uid']})
//         }

//     }else{
//         if(newSession){
//             eventEmitter.emit('sessionend')        
//             newSession = false
//         }
//     }


// });


// eventEmitter.on('sessionstart',function(){
//     console.log('start')
// })

// eventEmitter.on('sessionend',function(){
//     console.log('end')
// })

// eventEmitter.on('age',function(data){
//     console.log(data)
// })

// eventEmitter.on('uid',function(data){
//     console.log(data)
// })

