const moveRequest = require("../models/index").MoveRequest

const getMoveRequest = async(req,res)=>{
    const requestID = req.query.uuid
    try{
        const result = await moveRequest.findOne({where: {uuid: requestID}})
        if(result){
            res.status(200).json({message: 'MoveRequest found', moveRequest: result})
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
    try{
        const result = await moveRequest.create({UserID, moveStatus, moveDate, moveTime, moveFrom, moveTo})
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
    const { UserID, moveStatus, moveDate, moveTime, moveFrom, moveTo } = req.body;
    const requestID = req.query.uuid;

    try {
        const [numOfRowsAffected, updatedRows] = await moveRequest.update(
            { UserID, moveStatus, moveDate, moveTime, moveFrom, moveTo },
            { where: { uuid: requestID }, returning: true}
        );
    
        if (numOfRowsAffected > 0) {
    
            res.status(200).json({ message: 'MoveRequest updated successfully', moveRequest: updatedRows[0] });
        } else {
            res.status(404).json({ message: 'MoveRequest not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const deleteMoveRequest = async(req,res) =>{
    const requestID = req.query.uuid
    try{
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