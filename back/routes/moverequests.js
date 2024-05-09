var express = require('express');
var router = express.Router();
const {uuIDValidation} = require('../validation/uuidValidation');
var {moveRequestPostValidation } = require('../validation/moveRequest_validation');

const {
    getMoveRequest,
    createMoveRequest,
    updateMoveRequest,
    deleteMoveRequest
} = require("../controller/move_request")

router.route('/').post(moveRequestPostValidation, createMoveRequest)
router.route('/:uuid').get(uuIDValidation, getMoveRequest)
.patch(uuIDValidation ,updateMoveRequest).delete(uuIDValidation ,deleteMoveRequest)

module.exports = router;
