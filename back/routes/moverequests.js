var express = require('express');
var router = express.Router();

const {
    getMoveRequest,
    createMoveRequest,
    updateMoveRequest,
    deleteMoveRequest
} = require("../controller/move_request")

router.route('/').post(createMoveRequest)
router.route('/:uuid').get(getMoveRequest).patch(updateMoveRequest).delete(deleteMoveRequest)

module.exports = router;
