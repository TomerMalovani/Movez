var express = require('express');
var router = express.Router();

const {
    getVehicleInfo,
    createVehicleInfo,
    updateVehicleInfo,
    deleteVehicleInfo,
} = require("../controller/vehicle_page")

router.route('/').post(createVehicleInfo)
router.router('/:vehicleID').get(getVehicleInfo).patch(updateVehicleInfo).delete(deleteVehicleInfo)

module.exports = router;