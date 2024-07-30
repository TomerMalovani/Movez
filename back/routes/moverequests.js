var express = require('express');
var router = express.Router();
const {uuIDValidation} = require('../validation/uuidValidation');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
var {moveRequestPostValidation, validateUpdateMoveRequest} = require('../validation/moveRequest_validation');

const {
    getMoveRequest,
    createMoveRequest,
    updateMoveRequest,
    deleteMoveRequest,
    getMoveRequestsViaUser,
	searchRequest
} = require("../controller/move_request")

router.route('/').post(moveRequestPostValidation, upload.array('photos') ,createMoveRequest)
.get(uuIDValidation, getMoveRequest)
.patch(uuIDValidation , validateUpdateMoveRequest, updateMoveRequest).
delete(uuIDValidation ,deleteMoveRequest)

router.post('/search',searchRequest)

router.get('/user',getMoveRequestsViaUser)







module.exports = router;
