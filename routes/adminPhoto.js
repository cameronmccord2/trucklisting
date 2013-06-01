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

var awsPort = 8001;
var awsIpAddress = '54.225.66.110';

var useNewData = false;



/*
	type = 1 - additional, 2 - original, 3 - largeImage, 4 - tileImage
*/
var doPhoto = function(saveDirectory, file, truck, status, type, dbId){
	this.saveFile = function(){
		console.log('in this.saveFile');
		fs.rename(file.path, saveDirectory + dbId + '.jpg', function(err){
			if(err)
				console.log('couldnt move file, error: ' + err);
			else{
				console.log('moved file success: ' + saveDirectory + dbId + '.jpg');
				// fs.unlink(saveDirectory + dbId + '.jpg',function(err){
				// 	if(err){
				// 		console.log('there was an error deleting the file');
				// 	}else
				// 		console.log('deleted the file');
				// });
			}
		});
	}

	this.checkConflictsDestination = function(){
		fs.exists(saveDirectory + dbId + '.jpg', function(exists){
			if(exists)
				console.log('the file already exists');
			else
				this.saveFile();
		});
	}

	this.checkTempFile = function(){
		if(file.path != undefined)
			fs.exists(file.path, function(exists){
				console.log(file.path + ' exists: ' + exists);
				if(!exists)
					console.log('temp file: ' + file.path + ' doesnt exitst');
				else
					this.checkConflictsDestination();
			});
		else
			console.log('file.path is undefined')
	}

	this.checkDirectory = function(){
		console.log('in check directory')
		fs.exists(saveDirectory, function(exists){
			console.log(saveDirectory + ' exists: ' + exists);
			if(!exists)
				fs.mkdir(saveDirectory, this.checkTempFile());
			else
				this.checkTempFile();
		});
	}
	console.log('in here')
	if(saveDirectory != undefined && file != undefined && truck != undefined 
		&& status != undefined && dbId != undefined && type != undefined)
		this.checkDirectory();
	else
		console.log('something was undefined')
}

exports.uploadPhoto = function(req, res){
	console.log("in uploadPhoto");
	console.log(req.body)
	console.log('after body')
	var assets = './public/assets/';

	Db.connect(url,function(err,db){
		console.log('connected to db')
		if(err){
			res.send(500,"error connecting to db" + err);
			res.end();
			return;
		}else{
			console.log('before get collection')
			var collection = db.collection('truckImages');
			console.log('afeter get db collection')
			for (var i = req.body.files.length - 1; i >= 0; i--) {
				if(req.body.files[i].from != undefined && req.body.files[i].forTruck != undefined && 
					req.body.files[i].photoType != undefined && req.body.files[i].photoStatus != undefined && 
					req.body.files[i].uploadName != undefined){
					console.log('before image')
					var image = {
						'location':assets,
						'from':req.body.files[i].from,
						'forTruck':req.body.files[i].forTruck,
						'photoType':req.body.files[i].photoType,
						'photoStatus':req.body.files[i].photoStatus,
						'uploadName':req.body.files[i].uploadName
					};
					console.log('inserting')
					var id = collection.insert(image, {w:1}, function(result){
						console.log('image', image)
						console.log('in insert into truckimages: ' + result)
						doPhoto(assets, req.files[image.uploadName], image.forTruck, 
						image.photoStatus, image.photoType, image._id);
						console.log('after doPhoto');
						if(i == 0){
							res.send("bla");// never gets here yet without real data
							db.close();
							res.end();
						}
					});
					console.log('after insert');
				}else
					console.log('something was undefined in files[i]')
			};
			res.send(100);
		}
	});
}