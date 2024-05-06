const express = require('express');
const router = express.Router();
const {register, login} = require("../controller/user_controller")
/* GET users listing. */
router.post('/register',register  );

router.post('/login', login);

module.exports = router;
