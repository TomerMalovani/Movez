var express = require('express');
var router = express.Router();
const {uuIDValidation} = require('../validation/uuidValidation');
const {moveRequestItemPostValidation, validateUpdateMoveRequestItem} = require('../validation/moveRequestItem_validation');

const {
    getMoveRequestItem,
    createMoveRequestItem,
    updateMoveRequestItem,
    deleteMoveRequestItem,
	getMoveRequestItems
} = require("../controller/move_requestItem")


router.route('/').post(moveRequestItemPostValidation, createMoveRequestItem).
get(uuIDValidation, getMoveRequestItem).
patch(uuIDValidation, validateUpdateMoveRequestItem, updateMoveRequestItem).
delete(uuIDValidation, deleteMoveRequestItem)

router.get('/request', getMoveRequestItems)
module.exports = router;