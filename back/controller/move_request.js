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
    const {uuid ,UserID, Status, RequestItemsID, MovingDate, MovingTime, MovingFrom, MovingTo} = req.body
    try{
        const result = await pool.query(`
        INSERT INTO MoveRequest (RequestID, UserID, Status, RequestItemsID, MovingDate, MovingTime, MonvingFrom, MovingTo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
        `, [requestID, UserID, Status, RequestItemsID, MovingDate, MovingTime, MovingFrom, MovingTo])
        if(!requestID || !UserID || !Status || !RequestItemsID || !MovingDate || !MovingTime || !MovingFrom || !MovingTo){ 
            return res.status(400).json({message: 'Missing required information'})
        }
        else if(result.rowCount > 0){
        res.status(201).json({message: 'MoveRequest created successfully', moveRequest: result.rows[0]})
        }else{
            res.status(500).json({message: 'Failed to create the MoveRequest'})
        }
    }
    catch(error){
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}

const updateMoveRequest = async(req,res) =>{
    const {UserID, Status, RequestItemsID, MovingDate, MovingTime, MovingFrom, MovingTo} = req.body
    const requestID = req.params.requestID
    let updateValues = []
    let updateFields = []
    if(!requestID)
        return res.status(400).json({message: 'No request given'})
    if(!Status && !UserID && !RequestItemsID && !MovingDate && !MovingTime && !MovingFrom && !MovingTo){
        return res.status(400).json({message: 'No fields to update'})
    }
    try{
        let query = 'UPDATE MoveRequest SET '
        if(UserID){
            updateFields.push('UserID = $' + (updateValues.length + 1))
            updateValues.push(UserID)
        }
        if(Status){
            updateFields.push('Status = $' + (updateValues.length + 1))
            updateValues.push(Status)
        }
        if(RequestItemsID){
            updateFields.push('RequestItemsID = $' + (updateValues.length + 1))
            updateValues.push(RequestItemsID)
        }
        if(MovingDate){
            updateFields.push('MovingDate = $' + (updateValues.length + 1))
            updateValues.push(MovingDate)
        }
        if(MovingTime){
            updateFields.push('MovingTime = $' + (updateValues.length + 1))
            updateValues.push(MovingTime)
        }
        if(MovingFrom){
            updateFields.push('MovingFrom = $' + (updateValues.length + 1))
            updateValues.push(MovingFrom)
        }
        if(MovingTo){
            updateFields.push('MovingTo = $' + (updateValues.length + 1))
            updateValues.push(MovingTo)
        }
        query += updateFields.join(', ') + ' WHERE RequestID = $' + (updateValues.length + 1) + ' RETURNING *;'
        updateValues.push(requestID)
        const result = await pool.query(query, updateValues)
        if(result.rowCount > 0){
            res.status(200).json({message: 'MoveRequest updated successfully', moveRequest: result.rows[0]})
        }else{
            res.status(404).json({message: 'MoveRequest not found'})
        }
    }
    catch(error){
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}

const deleteMoveRequest = async(req,res) =>{
    const requestID = req.params.requestID
    try{
        const result = await pool.query(`
        DELETE FROM MoveRequest
        WHERE RequestID = $1
        RETURNING *;
        `, [requestID])
        if(result.rowCount > 0){
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