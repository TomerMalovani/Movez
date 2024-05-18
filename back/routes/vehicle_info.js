var express = require('express');
var router = express.Router();
const {uuIDValidation} = require('../validation/uuidValidation');
const {vehicleInfoPostValidation, validateUpdateVehicleInfo} = require('../validation/vehicleInfo_validation');

const {
    getVehicleInfo,
    createVehicleInfo,
    updateVehicleInfo,
    deleteVehicleInfo,
} = require("../controller/vehicle_page")

router.route('/').post(vehicleInfoPostValidation, createVehicleInfo)
.get(uuIDValidation, getVehicleInfo)
.patch(uuIDValidation, validateUpdateVehicleInfo, updateVehicleInfo)
.delete(uuIDValidation, deleteVehicleInfo)

module.exports = router;