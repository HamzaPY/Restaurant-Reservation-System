var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var dbConfig = require('./database/db');
var createError = require('http-errors');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
let User = require('./models/user');
const compression = require('compression')

// Connecting with mongo db
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
        console.log('Database sucessfully connected')
    },
    error => {
        console.log('Database could not connected: ' + error)
    }
)

User.register(new User({username: 'Hamza'}), 
'123456', (err, user) => {
if(err) {
}
else {
    user.firstname = "Mohammad";
    user.lastname = "Hamza";
    user.admin = true;
    user.save((err, user) => {
    if (err) {
    }
  });
}
});

var adminRouter = require('./routes/admin.route');

const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());
//app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'uploads')));

app.use('/admin', adminRouter);

// Create port
const port = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.get('*', (req, res)=>{
   res.sendFile(path.join(__dirname,'public/index.html'))
})

const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    console.error(err.message); // Log error message in our server's console
    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
    res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});