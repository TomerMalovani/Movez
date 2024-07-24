var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uuIDValidation, uuIDVehicleValidation } = require('../validation/uuidValidation');
const {vehicleInfoPostValidation, validateUpdateVehicleInfo} = require('../validation/vehicleInfo_validation');
const { photoValidation } = require('../validation/photo_validation');
const {
    getVehicleInfo,
    createVehicleInfo,
    updateVehicleInfo,
	getVehiclesByMoverId,
    deleteVehicleInfo,
    deleteVehiclePhoto
} = require("../controller/vehicle_page");

router.get('/user/', uuIDValidation, getVehiclesByMoverId);

router.route('/').post( upload.single('photo'), vehicleInfoPostValidation, createVehicleInfo)
	.get(uuIDVehicleValidation, getVehicleInfo)
	.patch(upload.single('photo') ,uuIDVehicleValidation, validateUpdateVehicleInfo, updateVehicleInfo)
	.delete(uuIDVehicleValidation, deleteVehicleInfo)
router.delete('/photo',deleteVehiclePhoto)

module.exports = router;