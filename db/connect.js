const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

let _db;

const initDb = (callback) => {
    if (_db) {
        console.log('DB is already initialized!');
        return callback(null, _db);
    }
    mongoose.connect(process.env.MONGODB_URI)
        .then((client) => {
            _db = client;
            callback(null, _db);
        })
        .catch((err) => {
            callback(err);
        });
};

module.exports = {
    initDb
}