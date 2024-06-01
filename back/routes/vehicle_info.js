var express = require('express');
var router = express.Router();
const { uuIDValidation, uuIDVehicleValidation } = require('../validation/uuidValidation');
const {vehicleInfoPostValidation, validateUpdateVehicleInfo} = require('../validation/vehicleInfo_validation');

const {
    getVehicleInfo,
    createVehicleInfo,
    updateVehicleInfo,
	getVehiclesByMoverId,
    deleteVehicleInfo,
} = require("../controller/vehicle_page")
router.get('/user/', uuIDValidation, getVehiclesByMoverId);

router.route('/').post(vehicleInfoPostValidation, createVehicleInfo)
	.get(uuIDVehicleValidation, getVehicleInfo)
	.patch(uuIDVehicleValidation, validateUpdateVehicleInfo, updateVehicleInfo)
	.delete(uuIDVehicleValidation, deleteVehicleInfo)


module.exports = router;