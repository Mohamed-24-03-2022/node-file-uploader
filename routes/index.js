const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');

router.get('/', indexController.renderFolders);

router.get('/login', indexController.renderLogInForm);

router.post('/login', indexController.authenticateUser);

router.get('/signup', indexController.renderSignUpForm);

router.post('/signup', indexController.handleUserSingUp);

router.post('/signout', indexController.handleUserSignOut);

module.exports = router;

