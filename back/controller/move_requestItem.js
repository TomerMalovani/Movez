const { move } = require('../routes/vehicle_info')
const { uploadPhoto, deletePhoto, updatePhoto } = require('../controller/photo_controller')

const MoveRequestItem = require('../models/index').MoveRequestItems

const getMoveRequestItem = async (req, res) => {
    const requestItemID = req.query.uuid
    try {
        const result = await MoveRequestItem.findByPk(requestItemID)
        if (result) {
            res.status(200).json({ meesage: "success", moveRequestItem: result})
        }
        else {
            res.status(404).json({ message: `No Move Request Item with ID = ${requestItemID} found` })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server error", error: error.message })
    }
}

const getMoveRequestItems = async (req, res) => {
	const moveRequestID = req.query.uuid
	try{
		const result = await MoveRequestItem.findAll({where:{MoveRequestID:moveRequestID}})
		if(result){
			res.status(200).json({message:"success", moveRequestItems:result})
		}else{
			res.status(404).json({message:`No Move Request Items with ID = ${moveRequestID} found`})
		}
	}catch(error){
		res.status(500).json({message:"Internal Server error", error:error.message})
	}
}

const createMoveRequestItem = async (req, res) => {
    const { MoveRequestID, ItemDescription, Height, Width, Depth, Weight, Quantity, SpecialInstructions} = req.body
    let PhotoUrl = ''
    try {
        if(req.file){
            PhotoUrl = await uploadPhoto(req.file)
        }
        const result = await MoveRequestItem.create({ MoveRequestID, ItemDescription, 
            Height, Width, Depth, Weight, Quantity, SpecialInstructions, PhotoUrl})
        if (result) {
            res.status(201).json({ message: "Move Request Item Created Successfully", moveRequestItem: result })
        }
        else {
            res.status(500).json({ message: "Failed to create Move Request Item" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

const updateMoveRequestItem = async (req, res) => {
    const { MoveRequestID, ItemDescription, Height, Width, Depth, Weight, Quantity, SpecialInstructions } = req.body;
    const requestItemID = req.query.uuid;
    
    // Check if any of the fields are missing
   // if (!MoveRequestID && !ItemDescription && !Height && !Width && !Depth && !Weight && !Quantity && !SpecialInstructions) {
    //    return res.status(400).json({ message: 'No fields to update' });
   // }

    try {
        if (req.file) {
            PhotoUrl = await updatePhoto(req.file, PhotoUrl);
        }
        const updateValues = { MoveRequestID, ItemDescription, Height, Width, Depth, Weight, Quantity, SpecialInstructions, PhotoUrl };

        const [affectedRows, updatedRows] = await MoveRequestItem.update(updateValues, { where: { uuid: requestItemID },returning: true });

        if (affectedRows > 0) {
            res.status(200).json({ message: 'Move Request Item updated successfully', moveRequestItem: updatedRows[0]});
        } else {
            res.status(404).json({ message: 'Move Request Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const deleteMoveRequestItem = async (req, res) => {
    const requestItemID = req.query.uuid
    if (!requestItemID)
        return res.status(400).json({ message: 'No Move Request Item given' })
    try {
        const moveRequestItem = await MoveRequestItem.findByPk(requestItemID)
        if(moveRequestItem.PhotoUrl !== ''){
            await deletePhoto(moveRequestItem.PhotoUrl)
        }
        const result = await MoveRequestItem.destroy({ where: { uuid: requestItemID } })
        if (result) {
            res.status(200).json({ message: 'Move Request Item deleted successfully' })
        } else {
            res.status(404).json({ message: `No Move Request Item with ID = ${requestItemID} found` })
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
}

const deleteMoveRequestPhoto = async (req, res) => {
    const requestItemID = req.query.uuid;
    try {
        const item = await MoveRequestItem.findByPk(requestItemID);
        if (!item) {
            return res.status(404).json({ message: 'item not found' });
        }
        else if (item.PhotoUrl) {
           await deletePhoto(item.PhotoUrl);
        }
        else {
            return res.status(409).json({ message: 'No Item Photo found' });
        }
        const [affectedRows, updatedRows] = await User.update(
            { PhotoUrl: '' },{ where: { uuid }, returning: true });
            if(affectedRows > 0){
                res.status(200).json({message: 'Item Photo deleted successfully', user: updatedRows[0]});
            }
            else{
                res.status(500).json({message: 'Failed to delete Item Photo'});
            }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getMoveRequestItem,
    createMoveRequestItem,
    updateMoveRequestItem,
    deleteMoveRequestItem,
	getMoveRequestItems,
    deleteMoveRequestPhoto
}