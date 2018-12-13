var DB = require('../cofig/db')
var bcrypt = require('bcrypt');
var methods = {
    findCustomer: function (findObject, callback) {
        DB.connect(function (error, database) {
            if (!error)
                database.collection("customers").find(findObject).toArray(function (err, findResponse) {
                    if (err) {
                        callback(err, null)
                    }
                    else {
                        // console.log("ddddddddd", findResponse);
                        callback(null, findResponse)
                    }

                });
        })
    },
    insertCustomer: function (inserObject, callback) {
        DB.connect(function (error, database) {
            if (!error) {
                console.log(inserObject)
                bcrypt.hash(inserObject.password, 10, function (err, hash) {

                    inserObject.password = hash;
                    inserObject.confirm_password = hash;
                    database.collection("customers").insertOne(inserObject, function (err, insertResponse) {
                        if (err) {
                            callback(err, null)
                        }
                        else {
                            // console.log("ddddddddd", insertResponse);
                            callback(null, insertResponse)
                        }

                    });
                });

            }
        })
    },
    deleteCustomer: function (deleteObject, callback) {
        DB.connect(function (error, database) {
            if (!error)
                database.collection("customers").insertOne(deleteObject, function (err, deleteResponse) {
                    if (err) {
                        callback(err, null)
                    }
                    else {
                        // console.log("ddddddddd", deleteResponse);
                        callback(null, deleteResponse)
                    }

                });
        })
    },
    updateCustomer: function (findObject, updation, callback) {
        DB.connect(function (error, database) {
            if (!error)
                database.collection("customers").updateOne(findObject, { $set: updation }, function (err, updateResponse) {
                    if (err) {
                        callback(err, null)
                    }
                    else {
                        // console.log("ddddddddd", updateResponse);
                        callback(null, updateResponse)
                    }

                });
        })
    },
    updatePassword: function (findObject, updation, callback) {
        DB.connect(function (error, database) {
            if (!error)

                bcrypt.hash(updation.password, 10, function (err, hash) {
                    updation.password = hash
                    updation.confirm_password = hash
                    database.collection("customers").updateOne(findObject, { $set: updation }, function (err, updateResponse) {
                        if (err) {
                            callback(err, null)
                        }
                        else {
                            // console.log("ddddddddd", updateResponse);
                            callback(null, updateResponse)
                        }

                    });
                });
        })
    },
    insesrtTempId: function (inserObject, callback) {
        DB.connect(function (error, database) {
            if (!error)
                database.collection("TempId").insertOne(inserObject, function (err, insertResponse) {
                    if (err) {
                        callback(err, null)
                    }
                    else {
                        // console.log("ddddddddd", insertResponse);
                        callback(null, insertResponse)
                    }

                });
        })
    },
    findTempId: function (findObject, callback) {
        DB.connect(function (error, database) {
            console.log(findObject)
            if (!error)
                database.collection("TempId").find(findObject).toArray(function (err, findResponse) {
                    if (err) {
                        callback(err, null)
                    }
                    else {
                        // console.log("ddddddddd", findResponse);
                        callback(null, findResponse)
                    }

                });
        })
    },
    deleteTempId: function (deleteObj, callback) {
        DB.connect(function (error, database) {
            console.log(deleteObj)
            if (!error)
                database.collection("TempId").deleteOne(deleteObj, function (err, findResponse) {
                    if (err) {
                        callback(err, null)
                    }
                    else {
                        // console.log("ddddddddd", findResponse);
                        callback(null, findResponse)
                    }

                });
        })
    },
    checkTempId: function (obj, callback) {
        date = obj.timestamp;
        currentDate = new Date();
        // console.log(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        // console.log(currentDate.getFullYear(), date.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
        if (date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDate() === currentDate.getDate() && date.getHours() === currentDate.getHours()) {
            if (currentDate.getMinutes() < date.getMinutes() + 10) {
                callback(null, { saved: true });
            }
            else {
                this.deleteTempId(obj, function (err, res) { })
                callback(null, { saved: false });
            }
        }
        else {
            console.log(false)
            this.deleteTempId(obj, function (err, res) { })
            callback(null, { saved: false });

        }


    },
}

module.exports = methods;