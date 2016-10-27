var MongoClient = require('mongodb').MongoClient

function getConnectionString(connection_string) {
  connection_string = 'mongodb://<nulamo>:<nulamo1337>@ds021036.mlab.com:21036/nulamo'
  return connection_string;
}
var connection;

var connect = function(connectionString, done) {
  if (connection) return done();
  var url = getConnectionString(connectionString);
  console.log(url);
  MongoClient.connect(url, function(err, db) {
    if (err){
      return done(err);
    }
    connection = db;
    connection.collection("friends").createIndex({"created": 1},{expireAfterSeconds:30*60 } );
    connection.collection("friends").createIndex({loc:"2dsphere"});

    done();
  })
}
var get = function() {
  return connection;
}
var close = function(done) {
  if (connection) {
    connection.close(function(err, result) {
      connection= null;
      done(err,result)
    })
  }
}
module.exports.connect = connect;
module.exports.get = get;
module.exports.close = close;
