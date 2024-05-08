const {
    getMoveRequestItem,
    createMoveRequestItem,
    updateMoveRequestItem,
    deleteMoveRequestItem
} = require("../controller/move_requestItem")

router.route('/').post(createMoveRequestItem)
router.route('/:uuid').get(getMoveRequestItem).patch(updateMoveRequestItem).delete(deleteMoveRequestItem)

module.exports = router;