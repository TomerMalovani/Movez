const moveRequest = require("../models/index").MoveRequest
const moveRequestItem = require("../models/index").MoveRequestItems

const getMoveRequest = async(req,res)=>{
    const requestID = req.query.uuid
    try{
        const result = await moveRequest.findOne({where: {uuid: requestID}})
        // get all move requests items for the move request
        
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
    const { UserID,moveStatus, moveDate, moveTime, moveFromCoor, moveToCoor,fromAddress,toAddress,items} = req.body
    console.log("body check",req.body,req.userId)

    try{

        const result = await moveRequest.create({ UserID,moveStatus, moveDate, moveTime, moveFromCoor, moveToCoor,fromAddress,toAddress})
        console.log(result)
        if(result){
            const itemsArray = items.map(item => {
                return {
                    MoveRequestID: result.uuid,
                    ItemDescription: item.ItemDescription,
                    Height: item.Height,
                    Width: item.Width,
                    Depth: item.Depth,
                    Weight: item.Weight,
                    Quantity: item.Quantity,
                    SpecialInstructions: item.SpecialInstructions
                }
            })
        const moveRequestItems = await moveRequestItem.bulkCreate(itemsArray)
        if(moveRequestItems){
            res.status(201).json({message: 'MoveRequest created successfully', moveRequest: result, moveRequestItems})
        }
        else{
            res.status(500).json({message: 'Failed to create MoveRequestItems'})
        }
        }else{
            res.status(500).json({message: 'Failed to create the MoveRequest'})
        }
    }
    catch(error){
        console.log(error)
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