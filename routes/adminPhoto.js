// Begin mongodb required stuff
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');

var nodeSessionId = Math.floor(Math.random()*10000);

var url = "mongodb://54.214.247.68:27017";
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
			else
				console.log('moved file success');
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
		fs.exists(file.path, function(exists){
			console.log(file.path + ' exists: ' + exists);
			if(!exists)
				console.log('temp file: ' + file.path + ' doesnt exitst');
			else
				this.checkConflictsDestination();
		})
	}

	this.checkDirectory = function(){
		fs.exists(saveDirectory, function(exists){
			console.log(saveDirectory + ' exists: ' + exists);
			if(!exists)
				fs.mkdir(saveDirectory, this.checkTempFile());
			else
				this.checkTempFile();
		});
	}
	console.log('in here')
	this.checkDirectory();
}

exports.uploadPhoto = function(req, res){
	console.log("in uploadPhoto");
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
			console.log('afeter get db collection' + req.body.length)
			for (var i = req.body.files[i].length - 1; i >= 0; i--) {
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
				collection.insert(image, {w:1}, function(result){
					console.log('in insert into truckimages: ' + result)
					doPhoto(assets, req.files[req.body.files[i].uploadName], req.body.files[i].forTruck, 
					req.body.files[i].photoStatus, req.body.files[i].photoType, result._id);
				});
			};
			res.send("bla");
			db.close();
			res.end();
		}
	});

	// [{"from"="me","forTruck":"12345","photoType":1,"photoStatus":2,"uploadName":"fileUpload"},{"from":"me","forTruck":"12345","photoType":1,"photoStatus":2,"uploadName":"fileUpload"}]

	
	// console.log(req)
	// console.log(req.files)
	//console.log(req);

	//var tempFilePath = req.files.image.path;
	
	fs.exists('./public/index.html', function(exists){
		console.log('./public/index exists: ' + exists);
	});
	
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