const vehicleInfo = require("../models/index").VehicleInfo
const { uploadPhoto, deletePhoto, updatePhoto } = require('../controller/photo_controller');

const getVehicleInfo = async(req,res)=>{
	const vehicleID = req.query.uuid
    try {
    console.log("vehicle_page try to get vehicle information");
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
  const {  VehicleType, VehicleModel ,Depth, Width , Height } = req.body;
	const MoverID = req.userId;
  let PhotoUrl = null;
  
  try {
      if (req.file) {
        PhotoUrl = await uploadPhoto(req.file);
      }
      const result = await vehicleInfo.create({MoverID, VehicleType, VehicleModel, Depth, Width, Height, PhotoUrl});
      if (result) {
        res.status(201).json({ msg: 'VehicleInfo created successfully', vehicleInfo: result});
      } else {
        console.log('something happend');
        res.status(500).json({ msg: 'Failed to create the vehicle info' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
const updateVehicleInfo = async (req, res) => {
  const { MoverID, VehicleType, VehicleModel,Depth, Width, Height} = req.body;
  const vehicleID = req.query.uuid; // Assuming vehicleID is passed in the URL
  let PhotoUrl = null;
  vehicle = await vehicleInfo.findByPk(vehicleID);
  if(!vehicle){
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  if(vehicle.PhotoUrl){
    PhotoUrl = vehicle.PhotoUrl;
  }
  console.log("body: ", req.body);
  console.log("file: ", req.file);
  try {
      if (req.file) {
        console.log("the file is detected");
          if(PhotoUrl){
            PhotoUrl = await updatePhoto(req.file, PhotoUrl);
            console.log("PhotoUrl: ", PhotoUrl);
          }
          else{
            PhotoUrl = await uploadPhoto(req.file);
            console.log("PhotoUrl: ", PhotoUrl);
          }
      }
      const [affectedRows, updatedRows] = await vehicleInfo.update(
          { MoverID, VehicleType, VehicleModel, Depth, Width, Height, PhotoUrl},
          { where: { uuid: vehicleID }, returning: true}
      );

      if (affectedRows > 0) {
          res.status(200).json({ message: 'VehicleInfo updated successfully', vehicleInfo: updatedRows[0] });
      } else {
          res.status(404).json({ message: 'VehicleInfo not found' });
      }
  } catch (error) {
      console.log(error);
      console.log("error: ", error.message);  
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const deleteVehicleInfo = async (req, res) => {
  const vehicleID = req.query.uuid;
  try {
    const vehicleInformation = await vehicleInfo.findByPk(vehicleID);
    if (!vehicleInformation) {
      return res.status(404).json({ message: 'VehicleInfo not found' });
    }
    else{
      if(vehicleInformation.PhotoUrl){
        await deletePhoto(vehicleInformation.PhotoUrl);
      }
      const result = await vehicleInfo.destroy({ where: { uuid: vehicleID } });
      if (result) {
        res.status(200).json({ message: 'VehicleInfo deleted successfully' });
      } else {
        res.status(404).json({ message: 'VehicleInfo not found' });
      }
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getVehiclesByMoverId = async (req, res) => {
	const moverID = req.userId;
  try {
    const vehicles = await vehicleInfo.findAll({ where: { MoverID: moverID } });
    if (!vehicles) {
      return res.status(404).json({ message: 'No Vehicles found' });
    }
    return res.status(200).json({ message: "success", vehicles });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Error", error: error.message });
  }
};

const deleteVehiclePhoto = async (req, res) => {
  const vehicleID = req.query.uuid;
  try {
    const vehicle = await vehicleInfo.findByPk(vehicleID);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    else if (vehicle.PhotoUrl) {
      await deletePhoto(vehicle.PhotoUrl);
    }
    else {
      return res.status(409).json({ message: 'No Vehicle Photo found' });
    }
    const [affectedRows, updatedRows] = await vehicleInfo.update(
      { PhotoUrl: null }, { where: { uuid: vehicleID }, returning: true });
    if (affectedRows > 0) {
      res.status(200).json({ message: 'Vehicle Photo deleted successfully', vehicleInfo: updatedRows[0] });
    }
    else {
      res.status(500).json({ message: 'Failed to delete Vehicle Photo' });
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
    getVehicleInfo,
    createVehicleInfo,
    updateVehicleInfo,
    deleteVehicleInfo,
    getVehiclesByMoverId,
    deleteVehiclePhoto
  };

