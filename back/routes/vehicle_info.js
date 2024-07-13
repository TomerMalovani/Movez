var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
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

router.route('/').post(vehicleInfoPostValidation, upload.single('photo') , createVehicleInfo)
	.get(uuIDVehicleValidation, getVehicleInfo)
	.patch(uuIDVehicleValidation, validateUpdateVehicleInfo, upload.single('photo') ,updateVehicleInfo)
	.delete(uuIDVehicleValidation, deleteVehicleInfo)


module.exports = router;