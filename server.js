var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var mongoConfig = require('./db');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String
});

var pollSchema = new mongoose.Schema({
    id: Number,
    email: String,
    title: String,
    option: [String],
    vote: [Number]
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);
var Poll = mongoose.model('Poll', pollSchema);
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/myvoteapp');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
    User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if (isMatch) return done(null, user);
            return done(null, false);
        });
    });
}));

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    if (req.user) {
        res.cookie('user', JSON.stringify(req.user));
    }
    next();
});

app.post('/api/newpoll', function(req, res) {
    Poll.find({})
        .sort({ id: 'descending' })
        .exec(function(err, docs) {
            if (err) throw err;
            var idPoll = 1;
            if (docs.length !== 0) {
                idPoll = docs[0].id + 1;
            }
            var poll = new Poll({
                id: idPoll,
                email: req.body.email,
                title: req.body.title,
                option: req.body.options,
                vote: req.body.vote
            });
            poll.save(function(err) {
                if (err) return next(err);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ status: "OK", idPoll: poll.id }, null, 3));

            });
        })
});

app.post('/api/getonepoll', function(req, res) {
    console.log(req.body);
    Poll.find({ id: req.body.idPoll }, function(err, result) {
        if (err) throw err;
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 3));
    })
});

app.get('/api/getallpoll', function(req, res) {
    Poll.find({}, function(err, documents) {
        if (err)
            throw err;
        // console.log(documents);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(documents, null, 3));
    })
});

app.post('/api/vote', function(req, res) {
    console.log(req.body);

    Poll.update({ id: req.body.id }, { $set: { vote: req.body.vote } }, function(err, data) {
        if (err) throw err;
        res.send(200);
    });
});

app.post('/api/getuserpoll', function(req, res) {

    Poll.find({ email: req.body.email }, function(err, documents) {
        if (err)
            throw err;
        // console.log(documents);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(documents, null, 3));
    });
});

app.post('/api/updatepoll', function(req, res) {
    console.log(req.body);
    Poll.update({ id: req.body.id }, { $set: { option: req.body.options, vote: req.body.vote } }, function(err, data) {
        if (err) throw err;
        res.send(200);
    });
    // res.send(200);
});

app.post('/api/removepoll', function(req, res) {
    Poll.remove({ id: req.body.id }, function(err) {
        if (err) throw err;
        res.send(200);
    })
});

app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.cookie('user', JSON.stringify(req.user));
    res.send(req.user);
});

app.post('/api/signup', function(req, res, next) {
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });
    user.save(function(err) {
        if (err) return next(err);
        res.send(200);
    });
});

app.get('/api/logout', function(req, res, next) {
    req.logout();
    res.send(200);
});

app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) next();
    else res.send(401);
}

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
