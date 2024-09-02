var express = require('express');
var router = express.Router();
const {uuIDValidation} = require('../validation/uuidValidation');
const {getUsersUUIDFromChat} = require('../controller/messages_controller');

router.get('/users/:uuid', uuIDValidation, getUsersUUIDFromChat);
module.exports = router;