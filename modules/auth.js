var jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    //console.log("adding")

    if (req.headers['token']) {
        console.log(req.headers['token'])
        var decoded = jwt.verify(req.headers['token'], 'key');
        console.log(decoded)
        if (decoded.user_name) {
            res.send({c:"you are allowed"})
            // next()
        } else {
            res.send({c: "you are not allowed"})
        }
    } else {
        res.send({c: "please provide token"})
    }

    console.log(decoded)
}