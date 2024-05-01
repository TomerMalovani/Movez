const pool = require("../db")

const getVehicleInfo = async(req,res)=>{
    const vehicleID = req.params.vehicleID
    try {
    const cargoCapacity = await pool.query(
        "SELECT Depth, Height, Width, Weight FROM VehicleInfo Where VehicleID = $1",
        [vehicleID]
    );
    if(!cargoCapacity.rows.length){
        return res.status(404).json({msg: "No Vehicle With ${vehicleID} id"});
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
    if (!moverID || !vehicleType || !depth || !width || !weight || !height) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }
  
  // Check if any parameters are invalid (e.g., non-numeric values for depth, weight, height)
  if (isNaN(Number(depth)) || isNaN(Number(weight)) || isNaN(Number(height))) {
    return res.status(400).json({ message: 'Invalid parameter values' });
  }
    try {
        const result = await pool.query(`
        INSERT INTO VehicleInfo (MoverID, VehicleType, Depth, Width ,Weight, Height)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `, [moverID, vehicleType, depth, width, weight, height]);
      if (result.rowCount > 0) {
        res.status(201).json({ msg: 'VehicleInfo created successfully', vehicleInfo: result.rows[0] });
      } else {
        res.status(500).json({ msg: 'Failed to create the vehicle info' });
      }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

//chatgpt generated
const updateVehicleInfo = async (req, res) => {
    const { moverID, vehicleType, depth, weight, height } = req.body;
    const vehicleID = req.params.vehicleID; // Assuming vehicleID is passed in the URL
    let updateValues = [];
    let updateFields = [];
  
    // Check if any required parameters are missing
    if (!moverID && !vehicleType && !depth && !weight && !height) {
      return res.status(400).json({ message: 'No fields to update' });
    }
  
    try {
      // Construct the query dynamically based on which fields are provided in the request
      let query = 'UPDATE VehicleInfo SET ';
      if (moverID) {
        updateFields.push('MoverID = $' + (updateValues.length + 1));
        updateValues.push(moverID);
      }
      if (vehicleType) {
        updateFields.push('VehicleType = $' + (updateValues.length + 1));
        updateValues.push(vehicleType);
      }
      if (depth) {
        updateFields.push('Depth = $' + (updateValues.length + 1));
        updateValues.push(depth);
      }
      if(width){
        updateFields.push('Width = $' + (updateValues.length + 1));
        updateValues.push(weight);
      }
      if (weight) {
        updateFields.push('Weight = $' + (updateValues.length + 1));
        updateValues.push(weight);
      }
      if (height) {
        updateFields.push('Height = $' + (updateValues.length + 1));
        updateValues.push(height);
      }
      
      query += updateFields.join(', ') + ' WHERE VehicleID = $' + (updateValues.length + 1) + ' RETURNING *;';
      updateValues.push(vehicleID);
  
      const result = await pool.query(query, updateValues);
  
      if (result.rowCount > 0) {
        res.status(200).json({ message: 'VehicleInfo updated successfully', vehicleInfo: result.rows[0] });
      } else {
        res.status(404).json({ message: 'VehicleInfo not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };

  const deleteVehicleInfo = async (req, res) => {
    const vehicleID = req.params.vehicleID; // Assuming vehicleID is passed in the URL
  
    try {
      const result = await pool.query(`
        DELETE FROM VehicleInfo
        WHERE VehicleID = $1
        RETURNING *;
      `, [vehicleID]);
  
      if (result.rowCount > 0) {
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