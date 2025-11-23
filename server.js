const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const mongodb = require('./db/connect');
const passport = require('./config/passport');

dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

app
    .use(express.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, DELETE, OPTIONS'
        );
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    })

    .use(
        session({
            secret: process.env.SESSION_SECRET || '9258da7e79295d2c76d0b3237af30aab',
            resave: false,
            saveUninitialized: false,
        })
    )
    
    .use(passport.initialize())
    .use(passport.session())

    .use('/', require('./routes'));

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port);
        console.log(`Connected to database and listening on port ${port}.`);
    }
});