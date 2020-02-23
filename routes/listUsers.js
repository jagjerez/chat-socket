'use strict'

var express = require('express');

var router = express.Router()

var middlewareVerifyUser = require('../middleware/verifyUser');
var middlewareVerifyToken = require('../middleware/verifyToken');

var listUserController = require('../controllers/listUserController')


router.get('/users/:nextPageToken?',middlewareVerifyToken,listUserController.list)


module.exports = router;