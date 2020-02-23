'use strict'

var express = require('express');

var router = express.Router()
var middlewareVerifyToken = require('../middleware/verifyToken');
var ChatController = require('../controllers/ChatController')

router.get('/messages/:emisor/:receptor',middlewareVerifyToken,ChatController.getChat)
router.get('/messages/:emisor/:receptor/:limit',middlewareVerifyToken,ChatController.getChat)
router.get('/messages/:emisor/:receptor/:limit/:where',middlewareVerifyToken,ChatController.getChat)
router.post('/messages',middlewareVerifyToken,ChatController.postMessage)

module.exports = router;
