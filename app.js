var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const expressSession = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const bcrypt = require('bcryptjs');

var indexRouter = require('./routes/index');
var foldersRouter = require('./routes/folders');
var folderFilesRouter = require('./routes/folderFiles');
var filesRouter = require('./routes/files');
var fileRouter = require('./routes/file');

var app = express();

const prisma = new PrismaClient();
const prismaSessionsStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

const cloudinary = require('cloudinary').v2;


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  expressSession({
    secret: 'passport',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // equal to 1 day
    store: prismaSessionsStore,
  })
);
app.use(passport.session());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        folders: {
          include: {
            files: true,
          }
        },
      },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use((req, res, next) => {
  if (req.path === '/login' || req.path === '/signup') {
    return next();
  }
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});



cloudinary.config({
  cloud_name: 'dnahc3t71',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});




app.use('/', indexRouter);
app.use('/folders', foldersRouter);
app.use('/folders/:folderId/files', folderFilesRouter);
app.use('/folders/:folderId/files/:fileId', fileRouter); // Handle get, delete AND download file
app.use('/files', filesRouter); // Handle upload file GET POST

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
