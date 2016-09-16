var express = require("express");
var app = express();
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.JAWSDB_URL || 'mysql://root:thereare4lights@localhost/test_db');

connection.connect();

connection.connect(function(err){
 if (!!err) {
   console.log("Error!", err);
  } else {
    console.log("Connected.");
  }
});

router.get("/", function(req,res){
  res.render("index");
});

router.get('/rooms', function(req, res){
  connection.query("SELECT * FROM rooms", function (err, rows, fields){
    if(!!err){
      console.log("Query error!");
      console.log("err", err);
    } else {
      res.status(200).json(rows);
      console.log("Query successful.");
    }
  });
})

router.get('/room_actions', function(req, res){
  connection.query("SELECT * FROM room_actions", function (err, rows, fields){
    if(!!err){
      console.log("Query error!");
      console.log("err", err);
    } else {
      res.status(200).json(rows);
      console.log("Query successful.");
    }
  });
})


// router.get("/home", function(req,res){
//   res.render("home");
// });


module.exports = router;
