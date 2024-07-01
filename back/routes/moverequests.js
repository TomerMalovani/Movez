var express = require('express');
var router = express.Router();
const {uuIDValidation} = require('../validation/uuidValidation');
var {moveRequestPostValidation, validateUpdateMoveRequest} = require('../validation/moveRequest_validation');

const {
    getMoveRequest,
    createMoveRequest,
    updateMoveRequest,
    deleteMoveRequest,
    getMoveRequestsViaUser,
	searchRequest
} = require("../controller/move_request")

router.route('/').post(moveRequestPostValidation, createMoveRequest)
.get(uuIDValidation, getMoveRequest)
.patch(uuIDValidation , validateUpdateMoveRequest, updateMoveRequest).
delete(uuIDValidation ,deleteMoveRequest)

router.post('/search',searchRequest)

router.get('/user',getMoveRequestsViaUser)







module.exports = router;
