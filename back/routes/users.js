const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {usersRegisterValidation, usersLoginValidation, usersEditProfileValidation} = require('../validation/users_validation');
const {photoValidation} = require('../validation/photo_validation');
const {uuIDValidation} = require('../validation/uuidValidation');
const { register, login, getUser, uploadProfilePhoto, deleteProfilePhoto, editProfile} = require('../controller/user_controller');
const e = require('express');
/* GET users listing. */
router.post('/register', upload.single('photo'), usersRegisterValidation, register);

router.post('/login',usersLoginValidation, login);

router.get('/',uuIDValidation ,getUser)
router.patch('/', uuIDValidation, usersEditProfileValidation, editProfile)
router.route('/photo').post(upload.single('photo'), uuIDValidation ,uploadProfilePhoto)
.put(photoValidation ,upload.single('photo'), uploadProfilePhoto)
.delete(uuIDValidation, deleteProfilePhoto)



module.exports = router;
