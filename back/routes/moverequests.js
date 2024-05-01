var express = require('express');
var router = express.Router();

const {
    getMoveRequests,
    createMoveRequest,
    updateMoveRequest,
    deleteMoveRequest
} = require("../controller/move_requests")

router.route('/').post(createMoveRequest)
router.route('/:requestID').get(getMoveRequests).patch(updateMoveRequest).delete(deleteMoveRequest)
