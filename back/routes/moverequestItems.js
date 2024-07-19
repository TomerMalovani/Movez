var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {uuIDValidation} = require('../validation/uuidValidation');
const {moveRequestItemPostValidation, validateUpdateMoveRequestItem} = require('../validation/moveRequestItem_validation');

const {
    getMoveRequestItem,
    createMoveRequestItem,
    updateMoveRequestItem,
    deleteMoveRequestItem,
	getMoveRequestItems,
    deleteMoveRequestPhoto
} = require("../controller/move_requestItem")


router.route('/').post(moveRequestItemPostValidation, upload.single('photo') ,createMoveRequestItem).
get(uuIDValidation, getMoveRequestItem).
patch(upload.single('photo') ,uuIDValidation, validateUpdateMoveRequestItem, updateMoveRequestItem).
delete(uuIDValidation, deleteMoveRequestItem)

router.get('/request', getMoveRequestItems)
router.delete('/photo', deleteMoveRequestPhoto)

module.exports = router;