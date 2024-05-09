var express = require('express');
var router = express.Router();
const {uuIDValidation} = require('../validation/uuidValidation');
const {moveRequestItemPostValidation} = require('../validation/moveRequestItem_validation');

const {
    getMoveRequestItem,
    createMoveRequestItem,
    updateMoveRequestItem,
    deleteMoveRequestItem
} = require("../controller/move_requestItem")


router.route('/').post(moveRequestItemPostValidation, createMoveRequestItem)
router.route('/:uuid').get(uuIDValidation, getMoveRequestItem).
patch(uuIDValidation, updateMoveRequestItem).delete(uuIDValidation, deleteMoveRequestItem)

module.exports = router;