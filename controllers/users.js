'use strict';


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


let createUserData = (fbUserID, userName, email)=>{
    let userRecord = {
        "_id":fbUserID,
        "userName": userName,
        "email": email,
        "preferences":{
            "key":"val"
        }
    };


    return userRecord;

};

/**
 * //!!!!!!! error handling default values
 * create a pref object o be inserted in the db
 * @param preferencesInput
 */
let createUserPref= (preferencesInput)=>{

    let preferencesToUpdate = {};
    preferencesToUpdate.currency = preferencesInput.currency;
    preferencesToUpdate.operation = preferencesInput.operation;
    preferencesToUpdate.amount = preferencesInput.amount;
    preferencesToUpdate.publicProfile = preferencesInput.publicProfile ? preferencesInput.publicProfile : false;
    return preferencesToUpdate;


};

const insertUserToDB = function(db, callback, userDoc) {
    // Get USERS collection
    const collection = db.collection(process.env.USERS_COLLECTION);
    // Insert some documents
    collection.insert(
        userDoc, (err, result)=> {

        // assert.equal(err, null);
        // console.log("Inserted user documents into collection");
        callback(err,result);
    });
}


/**
 * create a new user in the db
 * @param req
 * @param res
 */
module.exports.createUser = function createUser (req, res) {

    console.log("in create user");
    if (!req.swagger.params.fb_user_id){
        console.log("missing id");
    }
    // get id from request
    const fbUserID = req.swagger.params.fb_user_id.value;
    const userName = req.swagger.params.fb_user_name.value;
    const email = req.swagger.params.email.value;

    let record = createUserData(fbUserID,userName, email);

    // db url
    const url = process.env.DB_URL;

    // Database Name
    const dbName = process.env.DB_NAME;


    // connect to the server
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected to db");

        const db = client.db(dbName);

        insertUserToDB(db, function(err,result) {


            if (err){
                res.status(500).send(err);
            }
            else{
                console.log("document inserted");
                console.log(result.ops);
                client.close();
                res.send(200);
            }

        }, record);
    });
};




/**
 * get user from db
 * @param req
 * @param res
 */
module.exports.getUser = function getUser (req, res){

    // db url
    const url = process.env.DB_URL;

    // Database Name
    const dbName = process.env.DB_NAME;





    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected to db");

        const db = client.db(dbName);
        const collection = db.collection(process.env.USERS_COLLECTION);
        let id = req.swagger.params.userID.value;
        let cursor = collection.findOne({"_id":id}, (err,doc)=>{
            if (err){
                res.send(err);
            }
            else{
                res.send(doc);
            }
        });


    });

};

/**
 * update user preferences
 * @param req
 * @param res
 */
module.exports.updateUserPref = function updateUserPref(req, res){
    // db url
    const url = process.env.DB_URL;

    // Database Name
    const dbName = process.env.DB_NAME;


    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected to db");

        const db = client.db(dbName);
        const collection = db.collection(process.env.USERS_COLLECTION);
        let id = req.swagger.params.userID.value;
        let preferencesFromRequest = req.swagger.params.preferences.value;

        let preferencesToUpdate = createUserPref(preferencesFromRequest);


        collection.updateOne({
            "_id":id,
        }, {
            $set: {"preferences":preferencesToUpdate}
        }, (err, result)=>{

            if (err){
                res.status(500).send(err);
            }
            else{

                if (result.matchedCount == 0 || result.modifiedCount == 0){
                    // no user docuemnt was found - error
                    res.status(500).send("Error - user not found ")
                }
                else{
                    res.status(200).send("preferences updated");
                }
            }
        });


    });
}

/**
 * get user preferences from db
 * @param req
 * @param res
 */
module.exports.getUserPref = (req, res)=>{

    const url = process.env.DB_URL;

    // Database Name
    const dbName = process.env.DB_NAME;


    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected to db");

        const db = client.db(dbName);
        const collection = db.collection(process.env.USERS_COLLECTION);
        let id = req.swagger.params.userID.value;
        let cursor = collection.findOne({"_id":id}, (err,doc)=>{
            if (err){
                res.status(500).send(err);
            }
            else{
                res.status(200).send(doc.preferences);
            }
        });


    });


}
