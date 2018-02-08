'use strict';


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


let createUserData = (fbUserID, userName, email)=>{
    let userRecord = {
        "fbUserID": fbUserID,
        "userName": userName,
        "email": email,
        "preferences":{
            "key":"val"
        }
    };


    return userRecord;

};



const insertUserToDB = function(db, callback, userDoc) {
    // Get USERS collection
    const collection = db.collection(process.env.USERS_COLLECTION);
    // Insert some documents
    collection.insert(
        userDoc, (err, result)=> {
        assert.equal(err, null);
        console.log("Inserted user documents into collection");
        callback(result);
    });
}





module.exports.createUser = function createUser (req, res) {


    console.log("in create user");
    if (!req.swagger.params.fb_user_id){
        console.log("missing id");
    }
    // get id from request
    const fbUserID = req.swagger.params.fb_user_id.value;
    const userName = req.swagger.params.fb_user_name.value;
    const email = req.swagger.params.email.value;

    console.log(fbUserID);

    let record = createUserData(fbUserID,userName, email);

    const url = process.env.DB_URL;

// Database Name
    const dbName = process.env.DB_NAME;


    // Use connect to the server
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected to db");

        const db = client.db(dbName);

        insertUserToDB(db, function(result) {
            console.log("document inserted");
            console.log(result.ops);
            client.close();
            res.send(200);
        }, record);
    });


};
