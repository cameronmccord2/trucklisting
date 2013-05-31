// Begin mongodb required stuff
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectID;

var nodeSessionId = Math.floor(Math.random()*10000);

var url = "mongodb://10.245.74.171:27017";
console.log("Mongo url: " + url);
// End mongodb required stuff

// required stuff
var http = require('http');

var awsPort = 8001;
var awsIpAddress = '54.225.66.110';

var useNewData = false;


exports.uploadPhoto = function(req, res){
	console.log("in uploadPhoto");
	// console.log(req)
	// console.log(req.files)
	console.log(req.files.image)

	//var tempFilePath = req.files.image.path;
	fs.readdir('/public', function(err,files){
		console.log('/public')
		if(err)
			console.log(err)
		else
			console.log(JSON.stringify(files));
	});
	fs.readdir('/public/', function(err,files){
		console.log('/public/')
		if(err)
			console.log(err)
		else
			console.log(JSON.stringify(files));
	});
	fs.readdir('./public', function(err,files){
		console.log('./public/')
		if(err)
			console.log(err)
		else
			console.log(JSON.stringify(files));
	});
	fs.readdir('./public/', function(err,files){
		console.log('./public/')
		if(err)
			console.log(err)
		else
			console.log(JSON.stringify(files));
	});
	fs.readdir('./public/images', function(err,files){
		console.log('./public/images')
		if(err)
			console.log(err)
		else
			console.log(JSON.stringify(files));
	});
	fs.readdir('./public/images/', function(err,files){
		console.log('./public/images/')
		if(err)
			console.log(err)
		else
			console.log(JSON.stringify(files));
	});
	res.send("bla")
	// fs.exists('./public/images/' + req.headers.stockNumber, function(exists){
	// 	if(!exists)
	// 		fs.mkdirSync('./public/images/' + req.headers.stockNumber);// might need callback or slash after new folder name
	// 	var targetPath = './public/images/' + req.headers.stockNumber + '/' + req.files.image.name;
	// 	fs.rename(tempFilePath,targetPath, function(err){
	// 		if(err)
	// 			throw err;
	// 		fs.unlink(tempFilePath, function(){
	// 			if(err) throw err;
	// 			res.send("File uploaded to: " targetPath + ' - ' + req.files.image.size + ' bytes');
	// 		});
	// 	});
	// });
	

}