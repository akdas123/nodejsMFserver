var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
var fs = require("fs");


var invPath = '/home/anjdas/CodeBase/personal/MFTracker/MFdataBase/portfolio/investmentDetails.csv'
var totInvPath = '/home/anjdas/CodeBase/personal/MFTracker/MFdataBase/portfolio/totalInvestment.csv'
var amcCodePath = '/home/anjdas/CodeBase/personal/MFTracker/MFdataBase/mfcode'
var csvPath = '/home/anjdas/CodeBase/personal/MFTracker/MFdataBase/navData/'
var mfListPath = '/home/anjdas/CodeBase/personal/MFTracker/MFdataBase/mflist/'

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.post('/addInvestment', function (req, res) {

        var body = req.body;
        console.log(body);
        var schemeCode = body["schemeCode"];
        var schemeName = body["schemeName"];
        var amount = body["amount"];
        var date = body["date"];
        buffer = new Buffer(schemeCode + ";" + schemeName + ";" + amount + ";" + date + "\n");
        fs.open(invPath, 'a', function(err, fd) {
            if (err) {
                throw 'error opening file: ' + err;
            }
        
            fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function() {
                    console.log('file written');
                    res.end('file written');
                })
            });
        });

 
 })

 


 app.get('/getAllInvestments', function (req, res) {
	fs.exists(totInvPath, function(exists) {
	if (exists) {
		res.writeHead(200, {
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "attachment; filename=abc"
	});
	fs.createReadStream(totInvPath).pipe(res);
	} else {
			res.writeHead(400, {"Content-Type": "text/plain"});
			res.end("ERROR file does not exist");
	}
	});

  })




 app.get('/getInvDetails', function (req, res) {
	fs.exists(invPath, function(exists) {
	if (exists) {
		res.writeHead(200, {
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "attachment; filename=abc"
	});
	fs.createReadStream(invPath).pipe(res);
	} else {
			res.writeHead(400, {"Content-Type": "text/plain"});
			res.end("ERROR file does not exist");
	}
	});

  })

 app.get('/getInvDetails/:index', function (req, res) {
	var index = req.params.index;
	console.log(index);
	var index2 = Number(index) + Number(1);
	console.log(index2);
	
	fs.exists(invPath, function(exists) {
	if (exists) {
		fs.readFile(invPath, 'utf8', function(err, data)
		{
    			var line = data.split('\n').slice(index, index2);
			linedata = line[0].split(';');	
    			console.log(linedata);
		//	res.setHeader("Content-Type": "application/json");
			res.send(JSON.stringify({'mfId': linedata[0], 'mfName': linedata[1], 'amount': linedata[2], 'date': linedata[3]}));
		});
	} else {
			res.writeHead(400, {"Content-Type": "text/plain"});
			res.end("ERROR file does not exist");
	}
	});

  })
 app.put('/getInvDetails/:index', function (req, res) {
	var index = req.params.index;
	var index2 = Number(index) + Number(1);
	const newAmount = req.body.amount;
	const newDate = req.body.date;

	
	fs.exists(invPath, function(exists) {
	if (exists) {
		fs.readFile(invPath, 'utf8', function(err, data)
		{
    			var previouslines = data.split('\n').slice(0,index);
    			var nextlines = data.split('\n').slice(index2);
    			var line = data.split('\n').slice(index, index2);
			linedata = line[0].split(';');	
			linedata[2] = newAmount;
			linedata[3] = newDate;
    			console.log(linedata);

			newLine = linedata.join(';');	
			var data2 = previouslines.concat(newLine).concat(nextlines);
			var newlines = data2.join('\n');
    			fs.writeFile(invPath, newlines);
			res.writeHead(200, {"Content-Type": "text/plain"});
			res.end("success");
		});
	} else {
			res.writeHead(400, {"Content-Type": "text/plain"});
			res.end("ERROR file does not exist");
	}
	});

  })

 app.delete('/getInvDetails/:index', function (req, res) {
	var index = req.params.index;
	console.log(index);
	fs.exists(invPath, function(exists) {
	if (exists) {
		fs.readFile(invPath, 'utf8', function(err, data)
		{
    			var previouslines = data.split('\n').slice(0,index);
			index++;
    			var nextlines = data.split('\n').slice(index);
			var data2 = previouslines.concat(nextlines);
			var newlines = data2.join('\n');
    			fs.writeFile(invPath, newlines);
			res.writeHead(200, {"Content-Type": "text/plain"});
			res.end("success");
		});
	} 
	});
})

 app.get('/getList', function (req, res) {
	fs.exists(amcCodePath, function(exists) {
	if (exists) {
		res.writeHead(200, {
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "attachment; filename=abc"
	});
	fs.createReadStream(amcCodePath).pipe(res);
	} else {
			res.writeHead(400, {"Content-Type": "text/plain"});
			res.end("ERROR file does not exist");
	}
	});

  })

 app.get('/getMfList/:id', function (req, res) {
	var id = req.params.id;
	mfListPath2 = mfListPath + id + "_list.csv";
	console.log(id);
	fs.exists(mfListPath2, function(exists) {
	if (exists) {
		res.writeHead(200, {
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "attachment; filename=" + req.params.id
	});
	fs.createReadStream(mfListPath2).pipe(res);
	} else {
			res.writeHead(400, {"Content-Type": "text/plain"});
			res.end("ERROR file does not exist");
	}
	});

  })

 app.get('/getCsv/:id', function (req, res) {
	csvPath2 = csvPath + req.params.id + ".csv";
	fs.exists(csvPath2, function(exists) {
	if (exists) {
		res.writeHead(200, {
		"Content-Type": "application/octet-stream",
		"Content-Disposition": "attachment; filename=" + req.params.id
	});
	fs.createReadStream(csvPath2).pipe(res);
	} else {
			res.writeHead(400, {"Content-Type": "text/plain"});
			res.end("ERROR file does not exist");
	}
	});

  })


//  app.get('/:id', function (req, res) {
//     // First read existing users.
//     fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
//        var users = JSON.parse( data );
//        var user = users["user" + req.params.id] 
//        console.log( user );
//        res.end( JSON.stringify(user));
//     });
//  })
 


// var id = 2;

// app.delete('/deleteUser', function (req, res) {

//    // First read existing users.
//    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
//        data = JSON.parse( data );
//        delete data["user" + 2];
       
//        console.log( data );
//        res.end( JSON.stringify(data));
//    });
// })

var server = app.listen(3000, '10.195.9.176', function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})
