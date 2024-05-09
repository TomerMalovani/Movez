var express = require('express');
var router = express.Router();
const {uuIDValidation} = require('../validation/uuidValidation');
const {vehicleInfoPostValidation} = require('../validation/vehicleInfo_validation');

const {
    getVehicleInfo,
    createVehicleInfo,
    updateVehicleInfo,
    deleteVehicleInfo,
} = require("../controller/vehicle_page")

router.route('/').post(vehicleInfoPostValidation, createVehicleInfo)
router.route('/:vehicleID').get(uuIDValidation, getVehicleInfo)
.patch(uuIDValidation, updateVehicleInfo).delete(uuIDValidation, deleteVehicleInfo)

module.exports = router;