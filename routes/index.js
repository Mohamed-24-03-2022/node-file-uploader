const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const prisma = new (require('@prisma/client').PrismaClient)();
const asyncHandler = require('express-async-handler')

const validateUserSingUp = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password doesn't match");
      }
      return true;
    })
    .withMessage("Password doesn't match"),
];


router.get('/', function (req, res, next) {
  res.render('folders');
});

router.get('/login', function (req, res, next) {
  // TODO Display error on the views if failed login
  res.render('login-form');
});

router.post(
  '/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
);

router.get('/signup', function (req, res, next) {
  res.render('signup-form');
});

router.post('/signup', validateUserSingUp, asyncHandler(async function (req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // TODO Display error on the views
    return res.render('signup-form', { errors: result.array() });
  }

  const { username, email, password } = req.body;


  const hashedPassword = await bcrypt.hash(password, 10);

  const rows = await prisma.user.createManyAndReturn({
    data: [
      {
        username,
        email,
        password: hashedPassword,
      },
    ],
  });
  const user = rows[0];

  req.login(user, (err) => {
    if (err) return next(err);
    return res.redirect('/');
  });

}

));

router.post('/signout', function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});


module.exports = router;
