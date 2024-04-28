var express = require('express');
var router = express.Router();

const {
    getVehicleCargoInfo,
    createNewCargoInfo,
    editCargoInfo,
    deleteCargoInfo,
} = require("../controller/")