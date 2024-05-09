const pool = require("../db")
const MoveRequest = require("../models/MoveRequest")

const getMoveRequest = async(req,res)=>{
    const requestID = req.params.uuid
    try{
        //const result = await pool.query(`
        //SELECT * FROM MoveRequest
       // WHERE RequestID = $1
        //`, [requestID])
        const result = await MoveRequest.findOne({where: {uuid: requestID}})
        if(result.rowCount > 0){
            res.status(200).json({message: 'MoveRequest found', moveRequest: result.rows[0]})
        }else{
            res.status(404).json({message: 'MoveRequest not found'})
        }
    }
    catch(error){
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}

const createMoveRequest = async(req,res) =>{
    const {UserID, Status, MovingDate, MovingTime, MovingFrom, MovingTo} = req.body
    try{
        //const result = await pool.query(`
        //INSERT INTO MoveRequest (RequestID, UserID, Status, MovingDate, MovingTime, MonvingFrom, MovingTo)
        //VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        //RETURNING *;
        //`, [requestID, UserID, Status, MovingDate, MovingTime, MovingFrom, MovingTo])
        const result = await MoveRequest.create({UserID, Status, MovingDate, MovingTime, MovingFrom, MovingTo})
        if(result.rowCount > 0){
        res.status(201).json({message: 'MoveRequest created successfully', moveRequest: result.rows[0]})
        }else{
            res.status(500).json({message: 'Failed to create the MoveRequest'})
        }
    }
    catch(error){
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}


const updateMoveRequest = async (req, res) => {
    const { UserID, Status, MovingDate, MovingTime, MovingFrom, MovingTo } = req.body;
    const requestID = req.params.uuid;

    // Check if any required parameters are missing
    if (!Status && !UserID && !RequestItemsID && !MovingDate && !MovingTime && !MovingFrom && !MovingTo) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    try {
        const [updatedRowsCount, updatedRows] = await MoveRequest.update(
            { UserID, Status, MovingDate, MovingTime, MovingFrom, MovingTo },
            { where: { uuid: requestID }, returning: true }
        );

        if (updatedRowsCount > 0) {
            res.status(200).json({ message: 'MoveRequest updated successfully', moveRequest: updatedRows[0] });
        } else {
            res.status(404).json({ message: 'MoveRequest not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deleteMoveRequest = async(req,res) =>{
    const requestID = req.params.uuid
    try{
       // const result = await pool.query(`
        //DELETE FROM MoveRequest
        //WHERE RequestID = $1
        //RETURNING *;
       // `, [requestID])
        const result = await MoveRequest.destroy({where: {uuid: requestID}})
        if(result){
            res.status(200).json({message: 'MoveRequest deleted successfully'})
        }else{
            res.status(404).json({message: 'MoveRequest not found'})
        }
    }
    catch(error){
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}

module.exports = {
    getMoveRequest,
    createMoveRequest,
    updateMoveRequest,
    deleteMoveRequest}