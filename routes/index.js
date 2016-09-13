var express = require("express");
var app = express();
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
  // props
  host:'localhost',
  user: 'root',
  password: '',
  database: 'test_db'
});

connection.connect(function(err){
 if (!!err) {
   console.log("Error!");
  } else {
   console.log("Connected on Port 3000");
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
      // console.log("Query successful.");
      // console.log("ROWS", rows[0]);
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
      // console.log("Query successful.");
      // console.log("ROWS", rows[0]);
    }
  });
})


// router.get("/home", function(req,res){
//   res.render("home");
// });


module.exports = router;
