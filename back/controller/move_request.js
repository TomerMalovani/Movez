const pool = require("../db")
const moveRequest = require("../models/index")

const getMoveRequest = async(req,res)=>{
    const requestID = req.params.uuid
    try{
        //const result = await pool.query(`
        //SELECT * FROM MoveRequest
       // WHERE RequestID = $1
        //`, [requestID])
        const result = await moveRequest.findOne({where: {uuid: requestID}})
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
    const {UserID, moveStatus, moveDate, moveTime, moveFrom, moveTo} = req.body
    console.log("ceh")
    try{
        console.log("ceh")
        const result = await moveRequest.MoveRequest.create({UserID, moveStatus, moveDate, moveTime, moveFrom, moveTo})
        if(result){
        res.status(201).json({message: 'MoveRequest created successfully', moveRequest: result})
        }else{
            res.status(500).json({message: 'Failed to create the MoveRequest'})
        }
    }
    catch(error){
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}


const updateMoveRequest = async (req, res) => {
    const { UserID, Status, moveDate, moveTime, moveFrom, moveTo } = req.body;
    const requestID = req.params.uuid;

    // Check if any required parameters are missing
    if (!Status && !UserID && !RequestItemsID && !moveDate && !moveTime && !moveFrom && !moveTo) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    try {
        const [updatedRowsCount, updatedRows] = await moveRequest.update(
            { UserID, Status, moveDate, moveTime, moveFrom, moveTo },
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
        const result = await moveRequest.destroy({where: {uuid: requestID}})
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