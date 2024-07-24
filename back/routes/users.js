const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {usersRegisterValidation, usersLoginValidation} = require('../validation/users_validation');
const {photoValidation} = require('../validation/photo_validation');
const {uuIDValidation} = require('../validation/uuidValidation');
const { register, login, getUser, uploadProfilePhoto, deleteProfilePhoto } = require("../controller/user_controller")
/* GET users listing. */
router.post('/register', usersRegisterValidation, register);

router.post('/login',usersLoginValidation, login);

router.get('/',uuIDValidation ,getUser)
router.route('/photo').post(upload.single('photo'), uuIDValidation ,uploadProfilePhoto)
.put(photoValidation ,upload.single('photo'), uploadProfilePhoto)
.delete(uuIDValidation, deleteProfilePhoto)



module.exports = router;
