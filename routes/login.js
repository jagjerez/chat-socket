'use strict'

var express = require('express');

var router = express.Router()

var middlewareVerifyUser = require('../middleware/verifyUser');
var middlewareVerifyToken = require('../middleware/verifyToken');

var loginController = require('../controllers/loginController')

router.post('/signIn',middlewareVerifyUser,loginController.signIn)
router.post('/signUp',loginController.signUp)
router.get('/logOut',loginController.logOut)
router.post('/confirme',middlewareVerifyToken,loginController.confirmUser)

module.exports = router;