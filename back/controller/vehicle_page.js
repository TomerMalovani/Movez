const pool = require("../db")
const VehicleInfo = require("../models/VehicleInfo")

const getVehicleInfo = async(req,res)=>{
    const vehicleID = req.params.vehicleID
    try {
    //const cargoCapacity = await pool.query(
      //  "SELECT Depth, Height, Width, Weight FROM VehicleInfo Where VehicleID = $1",
        //[vehicleID]
    //);
    const cargoCapacity = await VehicleInfo.findbyPk(vehicleID, 
      {attributes: ['Depth', 'Height', 'Width', 'Weight']})
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
    //const vehicleID = req.params.vehicleID
    //const moverID = req.params.moverID
    //const vehicleType = req.params.vehicleType
    //const Depth = req.params.depth
    //const Height = req.params.height
    //const Weight = req.params.Weight
    const { moverID, vehicleType, depth, width ,weight, height } = req.body;
    // Check if any required parameters are missing
  // Check if any parameters are invalid (e.g., non-numeric values for depth, weight, height)
  try {
        //const result = await pool.query(`
        //INSERT INTO VehicleInfo (MoverID, VehicleType, Depth, Width ,Weight, Height)
        //VALUES ($1, $2, $3, $4, $5, $6)
        //RETURNING *;
      //`, [moverID, vehicleType, depth, width, weight, height]);
      const result = await VehicleInfo.create({moverID, vehicleType, depth, width, weight, height});
      if (result) {
        res.status(201).json({ msg: 'VehicleInfo created successfully', vehicleInfo: result.rows[0] });
      } else {
        res.status(500).json({ msg: 'Failed to create the vehicle info' });
      }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

//chatgpt generated
/*
const updateVehicleInfo = async (req, res) => {
    const { moverID, vehicleType, depth, weight, height } = req.body;
    const vehicleID = req.params.uuid; // Assuming vehicleID is passed in the URL
    // Check if any required parameters are missing
    if (!moverID && !vehicleType && !depth && !weight && !height) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    try {
      let updateValues = {};
      // Construct the query dynamically based on which fields are provided in the request
      let query = 'UPDATE VehicleInfo SET ';
      if (moverID) {
       updateValues.moverID = moverID;
      }
      if (vehicleType) {
        updateValues.vehicleType = vehicleType;
      }
      if (depth) {
        updateValues.depth = depth;
      }
      if(width){
        updateValues.width = width;
      }
      if (weight) {
        updateValues.weight = weight;
      }
      if (height) {
        updateValues.height = height;
      }
      const [affectedRows] = await VehicleInfo.update(updateValues, { where: { uuid: vehicleID } });
  
      if (affectedRows > 0) {
        res.status(200).json({ message: 'VehicleInfo updated successfully', vehicleInfo: affectedRows });
      } else {
        res.status(404).json({ message: 'VehicleInfo not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
*/
const updateVehicleInfo = async (req, res) => {
  const { moverID, vehicleType, depth, weight, height } = req.body;
  const vehicleID = req.params.uuid; // Assuming vehicleID is passed in the URL
  try {
      const [affectedRows] = await VehicleInfo.update(
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
  const vehicleID = req.params.uuid; // Assuming vehicleID is passed in the URL
  try {
    const result = await VehicleInfo.destroy({ where: { uuid: vehicleID } });
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