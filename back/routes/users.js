const express = require('express');
const router = express.Router();
const {usersRegisterValidation, usersLoginValidation} = require('../validation/users_validation');
const {register, login} = require("../controller/user_controller")
/* GET users listing. */
router.Register('/register', usersRegisterValidation, register);

router.Register('/login',usersLoginValidation, login);

module.exports = router;
