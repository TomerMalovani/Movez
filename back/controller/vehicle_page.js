const pool = require("../db")
const vehicleInfo = require("../models/index").VehicleInfo

const getVehicleInfo = async(req,res)=>{
    const vehicleID = req.query.vehicleID
    try {
    const cargoCapacity = await vehicleInfo.findbyPk(vehicleID)
    if(!cargoCapacity.rows.length){
        return res.status(404).json({msg: `No Vehicle With ${vehicleID} id`});
    }
    res.status(200).json(cargoCapacity.rows)
    }
    catch(error) {
        return res.status(500).json({msg: "Internal Error", err:
    error.message})
    }
}
//note: vehicle id should'nt be required from the user
// the vehicle id should be an internal DB value and be provided by us
const createVehicleInfo = async(req, res) => {
  const { moverID, vehicleType, depth, width ,weight, height } = req.body;
  try {
      const result = await vehicleInfo.create({moverID, vehicleType, depth, width, weight, height});
      if (result) {
        res.status(201).json({ msg: 'VehicleInfo created successfully', vehicleInfo: result.rows[0] });
      } else {
        res.status(500).json({ msg: 'Failed to create the vehicle info' });
      }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
const updateVehicleInfo = async (req, res) => {
  const { moverID, vehicleType, depth, weight, height } = req.body;
  const vehicleID = req.query.uuid; // Assuming vehicleID is passed in the URL
  try {
      const [affectedRows] = await vehicleInfo.update(
          { moverID, vehicleType, depth, weight, height },
          { where: { uuid: vehicleID } }
      );

      if (affectedRows > 0) {
          res.status(200).json({ message: 'VehicleInfo updated successfully', vehicleInfo: affectedRows });
      } else {
          res.status(404).json({ message: 'VehicleInfo not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const deleteVehicleInfo = async (req, res) => {
  const vehicleID = req.query.uuid;
  try {
    const result = await vehicleInfo.destroy({ where: { uuid: vehicleID } });
    if (result) {
      res.status(200).json({ message: 'VehicleInfo deleted successfully' });
    } else {
      res.status(404).json({ message: 'VehicleInfo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
  
module.exports = {
    getVehicleInfo,
    createVehicleInfo,
    updateVehicleInfo,
    deleteVehicleInfo
};