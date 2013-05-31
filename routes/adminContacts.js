// Begin mongodb required stuff
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectID;

var nodeSessionId = Math.floor(Math.random()*10000);

var url = "mongodb://10.245.74.171:27017";
console.log("Mongo url: " + url);
// End mongodb required stuff

// contacts
exports.allContacts = function(req,res){
	console.log("get all contacts");
	Db.connect(url,function(err,db){
		var collection = db.collection('truckContacts');
		collection.find().toArray(function(err,contacts){
			if(err){
				console.log("error on find method in adminTruckContacts:allContacts");
				res.send(400);
			}else{
				console.log('got all contacts');
				res.json(200, contacts);
			}
			db.close();
			res.end();
		});
	});
}

exports.contactByField = function(req,res){
	console.log("get contactByField: " + req.get('whatField'));
	if(req.get('whatField') == undefined || req.get('whatField') == null ||
		req.get('fieldData') == undefined || req.get('fieldData') == null){
		res.send(500, "Missing whatField or fieldData");
		res.end();
		return;
	}
	Db.connect(url,function(err,db){
		if(err){
			res.send(500,"error connecting to db");
			res.end();
			return;
		}else{
			var collection = db.collection('truckContacts');
			var specifics; 
			if(req.get('whatField') == "name")
				specifics = {name:req.get('fieldData')};
			else if(req.get('whatField') == "id")
				specifics = {_id:ObjectId(req.get('fieldData'))};
			else if(req.get('whatField') == "email")
				specifics = {email:req.get('fieldData')};
			else if(req.get('whatField') == "phoneNumber")
				specifics = {phoneNumber:req.get('fieldData')};
			else if(req.get('whatField') == "truckStockNumber")
				specifics = {truckStockNumber:req.get('fieldData')};
			else if(req.get('whatField') == "clientSessionId")
				specifics = {clientSessionId:req.get('fieldData')};
			else if(req.get('whatField') == "status")
				specifics = {status:parseInt(req.get('fieldData'))};
			else if(req.get('whatField') == "beforeDate")
				specifics = {recievedDate:{$lte:req.get('fieldData')}};
			else if(req.get('whatField') == "afterDate")
				specifics = {recievedDate:{$gte:req.get('fieldData')}};
			else if(req.get('whatField') == "lastContactedBeforeDate")
				specifics = {lastContacted:{$lte:req.get('fieldData')}};
			else if(req.get('whatField') == "lastContactedAfterDate")
				specifics = {lastContacted:{$gte:req.get('fieldData')}};
			else{
				console.log("whatField is invalid: " + req.get('whatField'));
				res.send(500, "whatField is invalid: " + req.get('whatField'));
				db.close();
				res.end();
				return;
			}
			
			collection.find(specifics).toArray(function(err,contacts){
				if(err){
					console.log("error on find method for: " + req.get('whatField') + " with ifno: " + req.get('fieldData'));
					res.send(400);
				}else{
					console.log('got specific contacts');
					res.json(200, contacts);
				}
				db.close();
				res.end();
			});
		}
	});
}

exports.updateContact = function(req,res){
	console.log("updateContact how: " + req.get('whatField'));
	if(req.get('whatField') == undefined || req.get('whatField') == null){
		res.send(500, "Missing whatField");
		res.end();
		return;
	}
	if(req.get('whatField') == "all"){
		Db.connect(url,function(err,db){
			if(err){
				res.send(500,"error connecting to db");
				res.end();
				return;
			}else{
				var collection = db.collection("truckContacts");
				collection.update({_id:ObjectId(req.body._id)},{
					$set:{
						name:req.body.name,
						email:req.body.email,
						phoneNumber:req.body.phoneNumber,
						whenBestContact:req.body.whenBestContact,
						comment:req.body.comment,
						adminComment:req.body.adminComment,
						lastContacted:req.body.lastContacted
					}
				},function(err,result){
					if(err){
					console.log("error on updateContact method for: " + req.get('whatField'));
					res.send(400);
					}else{
						console.log("result: " + result);
						res.json(200, result);
					}
					db.close();
					res.end();
				});
			}
		});
	}else if(req.get('whatField') == 'historyEntry'){
		if(req.body.entryTime == undefined){
			res.send(500, "Mission entryDate field");
			res.end();
			return;
		}
		Db.connect(url,function(err,db){
			if(err){
				res.send(500, "error connecting to db");
				res.end();
				return;
			}else{
				var collection = db.collection('truckContacts');
				var newEntry = new Object();
				newEntry.date = req.body.entryDate;
				newEntry.comment = req.body.entryComment;
				newEntry.timeRecieved = (new Date()).getTime();
				collection.update({_id:ObjectId(req.get('id'))},{'$push':{'historyEntries':newEntry}},function(err,result){
					if(err){
						res.send(500, "error finding a contact by that id");
						db.close();
						res.end();
						return;
					}else{
						console.log(result);
						collection.find({_id:ObjectId(req.get('id'))}).toArray(function(err,result2){
							if(err){
								res.send(500, "error finding a contact by that id");
							}else{
								console.log(result2)
								res.send(200, result2[0].historyEntries);
							}
							db.close();
							res.end();
						});
					}
				});
			}
		});
	}else{
		Db.connect(url,function(err,db){
			if(err){
				res.send(500,"error connecting to db");
				res.end();
				return;
			}else{
				var collection = db.collection('truckContacts');
				var specifics;
				if(req.get('whatField') == "name")
					specifics = {$set:{name:req.get('fieldData')}};
				else if(req.get('whatField') == "email")
					specifics = {$set:{email:req.get('fieldData')}};
				else if(req.get('whatField') == "phoneNumber")
					specifics = {$set:{phoneNumber:req.get('fieldData')}};
				else if(req.get('whatField') == "truckStockNumber")
					specifics = {$set:{truckStockNumber:req.get('fieldData')}};
				else if(req.get('whatField') == "clientSessionId")
					specifics = {$set:{clientSessionId:parseInt(req.get('fieldData'))}};
				else if(req.get('whatField') == "status")
					specifics = {$set:{status:parseInt(req.get('fieldData'))}};
				else if(req.get('whatField') == "whenBestContact")
					specifics = {$set:{whenBestContact:req.get('fieldData')}};
				else if(req.get('whatField') == "comment")
					specifics = {$set:{comment:req.get('fieldData')}};
				else if(req.get('whatField') == "lastContacted")
					specifics = {$set:{lastContacted:req.get('fieldData')}};
				else if(req.get('whatField') == "adminComment")
					specifics = {$set:{adminComment:req.get('fieldData')}};
				else{
					console.log("whatField is invalid: " + req.get('whatField'));
					res.send(500, "whatField is invalid: " + req.get('whatField'));
					db.close();
					res.end();
					return;
				}
				console.log(specifics)
				console.log(req)
				collection.update({_id:ObjectId(req.get('id'))},specifics,function(err,result){
					if(err){
						console.log("error on update method for: " + req.get('whatField') + " with info: " + req.get('fieldData'));
						res.send(400);
					}else{
						console.log('changed contact');
						res.json(200);
					}
					db.close();
					res.end();
				});
			}
		});
	}
}