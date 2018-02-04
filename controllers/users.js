'use strict';



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


    // const certificateId = request.swagger.params.certificate_id.value;



    res.send(JSON.stringify(record));
};
