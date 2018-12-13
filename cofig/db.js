var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var db = {
    connect: function (callback) {
        var res = null, err = null
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) {
                //  throw err;
                callback(err, null)
            }
            else {
                var dbo = db.db("rsiStock");
                callback(null,dbo)

            }

        })
        // var res="here",err=null

    }
}
module.exports = db;