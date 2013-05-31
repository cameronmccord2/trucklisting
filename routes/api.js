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
	console.log("into test111")
	res.write('hello there, this is a test');
	res.end();
}