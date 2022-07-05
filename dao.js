var sqlite3 = require('sqlite3');
const path = require('path');
const icu = require('./icu');
const cwd = __dirname

var db_options = {
    'db_dir':cwd,
    'db_name':'icu.db'
}
var databasePath = path.join(db_options.db_dir,'/' + db_options.db_name)


var db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE, (err) => {

    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
        } else if (err) {
            exit(1);
    }

});



function createDatabase() {

    var newdb = new sqlite3.Database(databasePath, (err) => {
        if (err) {
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

    setOptions:function(op){
        Object.keys(op).forEach(key => {
            if(key in db_options){
                db_options[key] = op[key]
                
            }
          });  

        if('db_path' in op || 'db_name' in op){
            // database not default - re-set path and create new if necessary.
            databasePath = path.join(db_options.db_dir,'/' + db_options.db_name)
            db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE, (err) => {
                if (err && err.code == "SQLITE_CANTOPEN") {
                    createDatabase();
                    return;
                    } else if (err) {
                        exit(1);
                }            
            });        
        }
    },    
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
