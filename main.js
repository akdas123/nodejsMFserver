var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
var fs = require("fs");


var path = 'C:/Users/anjdas/Documents/Personal/testProj/mftracker/src/assets/portfolio/investmentDetails.csv'

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
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
        fs.open(path, 'a', function(err, fd) {
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

 


// app.get('/listUsers', function (req, res) {
//     fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
//         console.log( data );
//         res.end( data );
//     });
//  })

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

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

})