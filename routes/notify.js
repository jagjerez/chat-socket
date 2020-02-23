'use strict'

var express = require('express');

var router = express.Router()
var middlewareVerifyToken = require('../middleware/verifyToken');
var notifyController = require('../controllers/notifyController')

router.post('/',middlewareVerifyToken,notifyController.notify)

module.exports = router;