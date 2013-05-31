// Begin mongodb required stuff
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectID;

var nodeSessionId = Math.floor(Math.random()*10000);

var url = "mongodb://10.245.74.171:27017";
console.log("Mongo url: " + url);
// End mongodb required stuff

var checkedForDataUpdate = false;

var truckData = {"stuff":"not"};

var http = require('http');

var awsPort = 8001;
var awsIpAddress = '54.225.66.110';

var useNewData = false;
var nodeSessionId = Math.floor(Math.random()*10000);

console.log("api here" + nodeSessionId)

exports.testDbCall = function(req,res){
	Db.connect(url,function(err,db){
		if(err){
			res.send(500,"error connecting to db");
			console.log("first connect error")
			res.end();
			db.close();
			return;
		}else{
			var collection = db.collection('testCollection');
			collection.find().toArray(function(err,clicks){
				if(err){
					console.log("error on find method in adminTruckClicks");
					res.send(400, "error on find method in adminTruckClicks");
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