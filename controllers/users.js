'use strict';


const MongoClient = require('mongodb').MongoClient;

let createUserData = (userId, userName, email)=>{
    let userRecord = {
        "userID": userId,
        "userName": userName,
        "email": email,
        "preferences":{
            "key":"val"
        }
    };


    return userRecord;

};


module.exports.createUser = function createUser (req, res) {


    console.log("in create user");
    if (!req.swagger.params.fb_user_id){
        console.log("missing id");
    }
    // get id from request
    const userID = req.swagger.params.fb_user_id.value;
    const userName = req.swagger.params.fb_user_name.value;
    const email = req.swagger.params.email.value;

    console.log(userID);

    let record = createUserData(userID,userName, email);

    console.log(JSON.stringify(record));

    const url = 'mongodb://test1:abc123@ds123718.mlab.com:23718';

// Database Name
    const dbName = 'mcn-users';

// Use connect method to connect to the server
    MongoClient.connect(url).then((db)=>{
    console.log("connected to mongo");



    }).catch((error)=>{console.log(error)});

    res.send(record);



    // catch(
    //
    //
    //
    //
    // ), function(err, client) {
    //     assert.equal(null, err);
    //     console.log("Connected successfully to server");
    //
    //     const db = client.db(dbName);
    //
    //     client.close();
    // });
    // const certificateId = request.swagger.params.certificate_id.value;


res.send("Errrorrrrr");
    // res.send(record);
};
