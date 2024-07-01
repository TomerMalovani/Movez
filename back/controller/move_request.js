const moveRequest = require("../models/index").MoveRequest
const moveRequestItem = require("../models/index").MoveRequestItems
const  {calculateVolume, allPermutationsOfItem} = require('../controller/move_requestItem');


const VehicleInfo = require("../models/VehicleInfo");

const searchRequest = async (req,res) => {
	// given {lat ,lng} and radius find all move requests that are within the radius 
	const userUUid = req.userId
	const { lat, lng, radius } = req.body;
	console.log("searchRequest", lat, lng)
	try{

		const [results, metadata] = await moveRequest.sequelize.query(`
      SELECT 
        "uuid", 
        "UserID", 
        "moveStatus", 
        "moveDate", 
        "moveTime", 
        "moveFromCoor", 
        "moveToCoor", 
        "fromAddress", 
        "toAddress", 
        "distance", 
        "createdAt", 
        "updatedAt" 
      FROM 
        "MoveRequest" 
      WHERE 
        "UserID" != :userUUid AND
     ST_DWithin(
          "moveFromCoor", 
          ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
          :radius
        );
    `, {
			replacements: { userUUid, lat, lng, radius }
		});
		console.log(results)
		if (results){
			res.status(200).json(results)
		}else{
			res.status(404).json({message: 'MoveRequest not found'})
		}
	}
	catch(error){
		console.log(error)
		res.status(500).json({message: 'Internal Server Error', error: error.message})
	}
}


const getMoveRequestsViaUser = async (req,res) =>{
    const userId = req.userId
    try{
        const result = await moveRequest.findAll({where: {UserID: userId}})
        // get all move requests items for the move request
        
        if(result){
            res.status(200).json(result)
        }else{
            res.status(404).json({message: 'MoveRequest not found'})
        }
    }
    catch(error){
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}

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

const isThereMatchBetweenMoveRequestToVehicle = (itemsArr, vehicleHeight,vehicleWidth,vehicleDepth ) =>{
    itemsArr.sort((a,b)=> {
        return calculateVolume(b) - calculateVolume(a);
     });
    let itemsArrLength = itemsArr.length;
    let freeSpace =  { 
        height: vehicleHeight,
        width: vehicleWidth,
        depth: vehicleDepth
    }
   for(let i =0; i< itemsArrLength ;i++)
    {
       let isItemFits = false;
       let permutations = allPermutationsOfItem(itemsArr[i]);
       let permutationsLength = permutations.length;
       for(let j =0 ; j< permutationsLength; j++)
        {
            let permutation = permutations[j];
           if(permutation.height <= freeSpace.height && permutation.width <= freeSpace.width && permutation.depth <= freeSpace.depth)
            {
                freeSpace.height -= permutation.height;
                freeSpace.width -= permutation.width;
                freeSpace.depth -= permutation.depth;
                isItemFits = true;
                break;
            }
        }
        if(!isItemFits)
            return false;
    }
    return true;
   
}

getAdjustedMoveRequests = async (req,res) =>{
    const mover_id = req.query.moverId;
    try{
        const moverVehicle = await VehicleInfo.find({where: {moverId: mover_id}});
        const moveRequsts = await moveRequest.findAll({where: {moveStatus: "pending"}});

        if(moveRequests.length ==0)
           return res.status(404).json({message: 'there are no pending move requests'});
        if(!moverVehicle)
            return res.status(404).json({message: 'mover id does not exists'});
        const adjustedmoveRequests = [];
        for(moveRequest in moveRequests){
            const requestItems = await moveRequestItem.findAll({ where: { MoveRequestID: moveRequest.uuid } });
            if(!Array.isArray(requestItems)){
               return res.status(404).json({ message: 'MoveRequestItems not found' });
            }
            if(isThereMatchBetweenMoveRequestToVehicle(requestItems, moverVehicle.Height, moverVehicle.Width, moverVehicle.Depth))
                {
                    adjustedmoveRequests.push(moveRequest);

                }

    }
    if(adjustedmoveRequests.length !=0)
    return res.status(200).json({message: 'matching move requests were found', adjustedmoveRequests});
   return res.status(200).json({message: 'there are no matching mover requests right now'});
}
    catch(error)
    {
        res.status(500).json({message: 'Internal Server Error', error: error.message});
    }
}
module.exports = {
    getMoveRequest,
    createMoveRequest,
    updateMoveRequest,
	deleteMoveRequest, getMoveRequestsViaUser, searchRequest
}