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

router.all("/posts", cors(), function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE'
    res.header['Access-Control-Allow-Headers'] = ' Content-Type, Accept';
    next();
})

router.get("/posts", function (req, res) {
    var db = connection.get();
    db.collection("posts").find({},{__v: 0}).toArray(function (err, posts) {
        if (err) {
            res.status(500);
            return res.json({code: 500, msg: "Could not fetch posts"})
        }
        res.end(JSON.stringify(posts, null, '\t'))
    })
})

router.get("/posts/near/:long/:lat/:distance", function (req, res) {

    var db = connection.get();


    var data = {
        "near": {
            "lat": parseFloat(req.params.lat),
            "long": parseFloat(req.params.long),
            "distance": parseFloat(req.params.distance)
        }

    }
    db.collection("posts").find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [data.near.long, data.near.lat]
                },

            $maxDistance: 10/111.12
        }}
    }).toArray(function (err, posts) {
        if (err) {
            res.status(500);
            return res.json({code: 500, msg: err})

        }
        res.end(JSON.stringify(posts, null, '\t'))

    })
})



router.get("/posts/:id", function (req, res) {
    var db = connection.get();
    var id = new ObjectId(req.params.id);
    db.collection("posts").findOne({_id:id}, function(err,result) {
        if (err) {
            res.status(500);
            return res.json({code: 500, msg: "Could not get the provided post: " + err})
        }
        console.log("Result: " + result);
        res.end(JSON.stringify(result, null, '\t'))
    });
})


router.post("/posts", function (req, res) {
    var post = req.body;
    var db = connection.get();
    db.collection("posts").insertOne(post, function (err, r) {
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not create a new post"})
        }
        var newPost = r.result;
        console.log(newPost);
        return res.json(post);
    })

})


router.put("/posts", function (req, res) {
    var post = req.body;
    var db = connection.get();
    var id = new ObjectId(post._id);
    delete post._id;
    db.collection("posts").replaceOne({_id:id},post,function(err,result){
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not update the provided post: "+err})
        }
        console.log("Result: "+result);
        res.end(JSON.stringify(post, null, '\t'))
    });

});

router.delete("/posts", function (req, res) {
    var post = req.body;
    var db = connection.get();
    var id = new ObjectId(post._id);
    db.collection("posts").deleteOne({_id:id},post,function(err,deleted){
        if(err){
            res.status(500);
            return res.json({code: 500, msg: "Could not delete the provided post: "+err})
        }
        console.log("Deleted: "+deleted);
        return res.json(deleted);
    });

});


module.exports = router;