var express = require('express');
var router = express.Router();
// var axios = require('axios');
var DB = require('../cofig/db')
var helper = require('./helper')
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nareshsuman318@gmail.com',
    pass: 'ayushisharma318'
  }
});

/* GET users listing. */
router.get('/', function (req, res, next) {

  DB.connect(function (err, db) {
    if (!err)
      var myobj = { name: "Company Inc", address: "Highway 37" };
    db.collection("customers").insertMany([myobj], function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
    });
  })

  console.log("1 ");

  res.send("ok")

});
router.post('/login', function (req, response, next) {

  helper.findCustomer({ username: req.body.username }, function (err, findRes) {
    // console.log("working", err, res)
    if (err) {
      response.send(err)
    }
    else {
      if (!findRes[0]) {
        response.send({ saved: false, status: 600, errors: { username: "these credentials does not exist" } })
      }
      else {
        console.log("send res", findRes, req.body.password, findRes[0].password)
        bcrypt.compare(req.body.password, findRes[0].password, function (err, compareRes) {
          console.log(compareRes)
          if (compareRes === true) {
            var token = jwt.sign({ result: findRes[0] }, 'key')
            response.send({ saved: true, token: token, user: findRes[0] })       //user is require in frontend for roletype
          }
          else {
            response.send({ saved: false, status: 600, errors: { username: "these credentials does not exist" } })
          }

        });

      }

    }
  })


});

router.post('/register', function (req, response, next) {
  // console.log(req.body)
  helper.findCustomer({ username: req.body.username }, function (err, res) { //check username exists or not
    if (err) {
      response.send(err)
    }
    else {
      if (res[0]) {
        response.send({ saved: false, status: 601, errors: { username: "This username already exists" } })
      }
      else {
        helper.findCustomer({ email: req.body.email }, function (err, res) {  //check email exists or not

          // console.log("working", err, res)
          if (err) {
            response.send(err)
          }
          else {
            if (res[0]) {
              response.send({ saved: false, status: 601, errors: { email: "This email already exists" } })
            }
            else {
              helper.insertCustomer(req.body, function (err, res) {
                response.send({ saved: true })
              })
            }

          }
        })
      }

    }

  })
});
router.post('/forgot_password', function (req, response, next) {
  // console.log(req.body)
  helper.findCustomer(req.body, function (err, res) {                       // req.body=>{email:"naresh@fma.com"}
    // console.log("working", err, res)
    if (err) {
      response.send(err)
    }
    else {
      if (!res[0]) {
        response.send({ saved: false, status: 602, reason: "This email  does not exist" })
      }
      else {
        TempId = Math.floor(Math.random() * 1000000);
        var mailOptions = {
          from: 'nareshsuman@gmail.com',
          to: req.body.email,
          subject: 'Change your password',
          text: 'Hi ' + res[0].username + " for changing your password please click on this link http://localhost:3002/change-password/" + TempId
        };
        helper.insesrtTempId({ TempId: TempId, username: res[0].username, timestamp: new Date() }, function (err, res) {
          if (err) {
            response.send(err);
          }
          else {
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                response.send(error)
                console.log(error);
              } else {
                response.send({ saved: true })
                console.log('Email sent: ' + info.response);
              }
            });
          }

        })

      }

    }
  })

});
router.post('/forgot_password/:TempId', function (req, response, next) {
  console.log("TempId is", req.params.TempId)

  helper.findTempId({ TempId: parseInt(req.params.TempId) }, function (err, res) {
    if (err) {
      response.send(err)
    }
    else {
      console.log(res)
      if (res[0])
        helper.checkTempId(res[0], function (err, res) {
          if (err) {
            response.send(err)
          }
          else {
            response.send(res)
          }
        });
      else {
        response.send({ saved: false })

      }

      // response.send(res)
    }
  })
  // response.send({ saved: true })


})
router.post('/reset_password', function (req, response, next) {
  // console.log(req.params.TempId)

  helper.findTempId({ TempId: parseInt(req.body.TempId) }, function (err, res) {
    if (err) {
      response.send(err)
    }
    else {
      console.log("find res", res)

      helper.updatePassword({ username: res[0].username }, { password: req.body.password }, function (err, res) {
        if (err) {
          console.log(err)
          response.send(err)
        }
        else {
          // console.log("update res ",res)
          if (res.result.n)
            helper.deleteTempId({ TempId: parseInt(req.body.TempId) }, function (err, re) { })
          response.send({ saved: true })
        }

      })

      // response.send(res)
    }
  })



})


module.exports = router;
