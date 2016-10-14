/**
 * Created by Magnus on 01-10-2016.
 */
var express = require("express");
var router = express.Router();
var cors = require("cors");
var connection = require("../config/database");
ObjectId=require('mongodb').ObjectId;
//router.all("/projects",cors(),function(req,res,next){
//  next();
//})

router.all("/p_users", cors(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE'
    res.header['Access-Control-Allow-Headers'] = ' Content-Type, Accept';
    next();
})

router.get("/p_users", function (req, res) {
    var db = connection.get();
    db.collection("p_users").find({},{__v: 0}).toArray(function (err, p_users) {
        if (err) {
            res.status(500);
            return res.json({code: 500, msg: "Could not fetch users"})
        }
        res.json(p_users);
    })
})

router.post("/p_users", function (req, res) {
    var p_user = req.body;
    var db = connection.get();
    db.collection("p_users").insertOne(p_user, function (err, r) {
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not create a new user"})
        }
        var newUser = r.result;
        console.log(newUser);
        return res.json(p_user);
    })

})


router.put("/p_users", function (req, res) {
    var p_user = req.body;
    var db = connection.get();
    var id = new ObjectId(p_user._id);
    delete p_user._id;
    db.collection("p_users").replaceOne({_id:id},p_user,function(err,result){
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not update the provided user: "+err})
        }
        console.log("Result: "+result);
        return res.json(result);
    });

});

router.delete("/p_users", function (req, res) {
    var p_user = req.body;
    var db = connection.get();
    var id = new ObjectId(p_user._id);
    db.collection("p_users").deleteOne({_id:id},p_user,function(err,deleted){
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not delete the provided user: "+err})
        }
        console.log("Deleted: "+deleted);
        return res.json(deleted);
    });

});


module.exports = router;