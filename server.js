//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
const path = require('path');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// Setting Base directory
app.use(bodyParser.json());
console.log('*******----------***'+__dirname);
app.use(express.static(__dirname + '/dist/'));
//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
 var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

//Initiallising connection string
var dbConfig = {
    user:  "Disk_Space",
    password: "Comcast99!",
    server: "slackdbg-wc-1p",
    database: "Patching_Activity"
};

//Function to connect to database and execute query
var  executeQuery = function(res, query) {	
	sql.connect(dbConfig, function (err) {
		if (err) {   
			console.log("Error while connecting database :- " + err);
			res.send(err);
		}
		else {
			// create Request object
			var request = new sql.Request();
			// query to the database
			request.query(query, function (err, resp) {
				if (err) {
					throw err;
					// res.send(err);
					res.json({Status : 500, message : "Something went wrong!"});
				}
				else {
					res.json({success : "Inserted Successfully"});
					sql.close();
				}
			});
		}
	});	
}

app.all('/', function(req, res, next) {
   res.sendFile(path.join(__dirname, '/dist/', 'index.html'));
});

app.get("/api/user", function(req , res){
	var query = "select * from Patching_Report_Final_V1";
	executeQuery (res, query);
});

app.post('/api/patchUpdate', function(req, res) {
	serverName = req.body['serverName']
    version = req.body['version']
    patchStatus = req.body['patchStatus']

    pmrStatus = req.body['pmrStatus']
    patchStDate = req.body['patchStDate']
    environmentDet = req.body['environmentDet']

    application = req.body['application']
    dba = req.body['dba']

    completedBy = req.body['completedBy']

    if(serverName || version || patchStatus || pmrStatus || patchStDate || environmentDet || dba || application || completedBy) {
    	console.log(new Date(patchStDate));
    	var query = "INSERT INTO [P_Reports] ([Server Name], [Environment], [Application], [Version], [Patch_Start_Date], [DBA], [Patch Status], [PMR Status], [CompletedBy]) VALUES('" +serverName+"','"+environmentDet+"', '"+application+"' , '"+version+"', convert(datetime,'"+patchStDate+"'), '"+dba+"', '"+patchStatus+"', '"+pmrStatus+"', '"+completedBy+"')";
    	executeQuery(res, query);
    }
});
