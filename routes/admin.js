// Begin mongodb required stuff
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');

var nodeSessionId = Math.floor(Math.random()*10000);

var url = "mongodb://54.214.247.68:27017/trucklisting";
console.log("Mongo url: " + url);
// End mongodb required stuff

// required stuff
var http = require('http');
var mdb = require('./database');

var awsPort = 8001;
var awsIpAddress = '54.225.66.110';

var useNewData = false;
