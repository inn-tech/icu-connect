var sqlite3 = require('sqlite3');
const path = require('path')
const cwd = __dirname
const databasePath = path.join(cwd,'/mcu.db')



var db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE, (err) => {

    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
   // runQueries(db);
});



function createDatabase() {
    console.log('create new database',databasePath)
    var newdb = new sqlite3.Database(databasePath, (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

function createTables(newdb) {
    newdb.exec(`
        CREATE TABLE IF NOT EXISTS
        SystemFaces
        (ID integer primary key autoincrement, face_id text UNIQUE, face_data text, firstname text,
            surname text , user_group text default 'Enrolled', group_id integer default 0 ,
             face_version text ,face_image text,added integer);
        `, ()  => {
            runQueries(newdb);
    });
}

function runQueries(newdb) {
    db = newdb
}


module.exports = {
    addFace:function (faceData, callback){
        db.run('INSERT INTO SystemFaces (`face_id`,`face_data`,`firstname`,`surname`,`user_group`,`group_id`,`face_version`,`face_image`,`added`) VALUES (?,?,?,?,?,?,?,?,?)',
        [faceData.face_id,faceData.face_data,faceData.firstname,faceData.surname,faceData.user_group,faceData.group_id,faceData.face_version,faceData.face_image,faceData.added], function(error,row){
            if(error){
                callback(error,0);                    
            }else{
                callback(null,row);
            }
        });
    } ,
    getUpdates:function(lastupdate, callback){

        db.all("SELECT * FROM SystemFaces WHERE added > $updatetime ORDER BY added DESC LIMIT 200",{$updatetime:lastupdate},function(error,result){

            if(error){
                callback(error,null);
            }else{
                callback(null,result);
            }
        });

    },      
    getRecordById:function(uid, callback){

        db.all("SELECT * FROM SystemFaces WHERE `face_id`=$face_id",{$face_id:uid},function(error,result){
            if(error){
                callback(error,null);
            }else{
                callback(null,result);
            }
        });

    }      
}
