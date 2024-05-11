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

const createMoveRequestItem = async (req, res) => {
    const { moveRequestID, itemDescription, height, width, depth, weight, quantity, specialInstructions} = req.body
    try {
        const result = await MoveRequestItem.create({ moveRequestID, itemDescription, 
            height, width, depth, weight, quantity, specialInstructions})
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
    const { moveRequestID, itemDescription, height, width, depth, weight, quantity, specialInstructions } = req.body;
    const requestItemID = req.query.uuid;
    
    // Check if any of the fields are missing
   // if (!moveRequestID && !itemDescription && !height && !width && !depth && !weight && !quantity && !specialInstructions) {
    //    return res.status(400).json({ message: 'No fields to update' });
   // }

    try {
        const updateValues = { moveRequestID, itemDescription, height, width, depth, weight, quantity, specialInstructions };

        const [affectedRows] = await MoveRequestItem.update(updateValues, { where: { uuid: requestItemID } });

        if (affectedRows > 0) {
            res.status(200).json({ message: 'Move Request Item updated successfully' });
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

module.exports = {
    getMoveRequestItem,
    createMoveRequestItem,
    updateMoveRequestItem,
    deleteMoveRequestItem
}