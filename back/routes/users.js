const express = require('express');
const router = express.Router();
const {usersRegisterValidation, usersLoginValidation} = require('../validation/users_validation');
const { register, login, getUser } = require("../controller/user_controller")
/* GET users listing. */
router.post('/register', usersRegisterValidation, register);

router.post('/login',usersLoginValidation, login);

router.get('/', getUser )



module.exports = router;
