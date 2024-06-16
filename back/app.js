let createError = require('http-errors');
const { sequelize } = require('./models');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let vehicleInfoRouter = require('./routes/vehicle_info');
let moveRequestsRouter = require('./routes/moverequests');
let moveRequestItemsRouter = require('./routes/moverequestItems');
let priceProposalRouter = require('./routes/price_proposal');
let app = express();

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// middleware that skip only login and register
app.use(function(req, res, next) {
  if (req.url === '/users/login' || req.url === '/users/register') {
    next();
  } else {
    const token = req.headers['authorization'];
    console.log("headers", req.headers)
    if (token) {
      jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
          console.log("error: ",err)
          res.status(401).json({ message: 'Unauthorized', error: err.message });
        } else {
          console.log("decoded",decoded);
          const {uuid,username} = decoded
          req.userId = uuid
          req.user = username
          // register.user =
          next();
        }
      });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
});



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vehicle_info', vehicleInfoRouter);
app.use('/moverequestitems', moveRequestItemsRouter);
app.use('/moverequests', moveRequestsRouter);
app.use('/priceproposal', priceProposalRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error'+  res.locals.message );
  console.log('error'+  res.locals.message );
});

const port = process.env.PORT || 3000;
app.set('port', port);

async function dbConnect() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

dbConnect();

module.exports = app