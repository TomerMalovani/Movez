const vehicleInfo = require("../models/index").VehicleInfo

const getVehicleInfo = async(req,res)=>{
    const vehicleID = req.query.uuid
    try {
    const vehicleInformation = await vehicleInfo.findByPk(vehicleID)
    if(!vehicleInformation){
        return res.status(404).json({msg: `No Vehicle With ${vehicleID} id`});
    }
    return res.status(200).json({message: "success", VehicleInfo: vehicleInformation})
    }
    catch(error) {
        return res.status(500).json({msg: "Internal Error", err:
    error.message})
    }
}
//note: vehicle id should'nt be required from the user
// the vehicle id should be an internal DB value and be provided by us
const createVehicleInfo = async(req, res) => {
  const { MoverID, VehicleType, Depth, Width , Height } = req.body;
  try {
      const result = await vehicleInfo.create({MoverID, VehicleType, Depth, Width, Height});
      if (result) {
        res.status(201).json({ msg: 'VehicleInfo created successfully', vehicleInfo: result});
      } else {
        res.status(500).json({ msg: 'Failed to create the vehicle info' });
      }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
const updateVehicleInfo = async (req, res) => {
  const { MoverID, VehicleType, Depth, Width, Height } = req.body;
  const vehicleID = req.query.uuid; // Assuming vehicleID is passed in the URL
  try {
      const [affectedRows, updatedRows] = await vehicleInfo.update(
          { MoverID, VehicleType, Depth, Width, Height },
          { where: { uuid: vehicleID }, returning: true}
      );

      if (affectedRows > 0) {
          res.status(200).json({ message: 'VehicleInfo updated successfully', vehicleInfo: updatedRows[0] });
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