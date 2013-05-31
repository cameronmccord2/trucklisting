// Begin mongodb required stuff
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectID;

var nodeSessionId = Math.floor(Math.random()*10000);

var url = "mongodb://10.245.74.171:27017";
console.log("Mongo url: " + url);
// End mongodb required stuff

// Truck Clicks
exports.truckClicks = function(req,res){
	console.log("get all clicks");
	Db.connect(url,function(err,db){
		if(err){
			res.send(500,"error connecting to db");
			res.end();
			db.close();
			return;
		}else{
			var collection = db.collection('truckClicks');
			collection.find().toArray(function(err,clicks){
				if(err){
					console.log("error on find method in adminTruckClicks");
					res.send(400);
				}else{
					console.log('got all clicks');
					res.json(200, clicks);
				}
				db.close();
				res.end();
			});
		}
	});
}