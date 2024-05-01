const pool = require("../db")

const getPriceProposal = async(req,res) => {
    const pricePropsalID = req.params.pricePropsalID
    try {
        const result = await pool.query("SELECT * FROM PricePropsal WHERE PricePropsalID = $1", [pricePropsalID])
        if(result.rowCount > 0){
            res.status(200).json({meesage:"success", pricePropsal: result.rows[0]})
        }
        else{
            res.status(404).json({message:"No Price Propsal with ID = ${PriceProposalID} found"})
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server error", error: error.message})
    }
}

const createPriceProposal = async(req,res) => {
    const {pricePropsalID, requestID, moverID, movingID, estimatedCost, status} = req.body
    try {
        if(!pricePropsalID || !requestID || !moverID || !movingID || !estimatedCost || !status){
            return res.status(400).json({message: "Missing required parameters"})
        }
        const result = await pool.query(
            `INSERT INTO PriceProposal 
            (PriceProposalID, RequestID, MoverID, MovingID, EstimatedCost, Status)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, 
             [pricePropsalID, requestID, moverID, movingID, estimatedCost, status])
        if(result.rowCount > 0){
            res.status(201).json({message: "Price Proposal Created Successfully", priceProposal: result.rows[0]})
        }
        else{
            res.status(500).json({message: "Failed to create Price Proposal"})
         }
        } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

const updatePriceProposal = async(req,res) => {
    const {requestID, moverID, movingID, estimatedCost, status} = req.body
    const priceProposalID = req.params.priceProposalID
    let updateValues = []
    let updateFields = []
    if(!priceProposalID)
        return res.status(400).json({message: 'No Price Proposal given'})
    if(!status && !requestID && !moverID && !movingID && !estimatedCost){
        return res.status(400).json({message: 'No fields to update'})
    }
    try{
        let query = 'UPDATE PriceProposal SET '
        if(requestID){
            updateFields.push('RequestID = $' + (updateValues.length + 1))
            updateValues.push(requestID)
        }
        if(moverID){
            updateFields.push('MoverID = $' + (updateValues.length + 1))
            updateValues.push(moverID)
        }
        if(movingID){
            updateFields.push('MovingID = $' + (updateValues.length + 1))
            updateValues.push(movingID)
        }
        if(estimatedCost){
            updateFields.push('EstimatedCost = $' + (updateValues.length + 1))
            updateValues.push(estimatedCost)
        }
        if(status){
            updateFields.push('Status = $' + (updateValues.length + 1))
            updateValues.push(status)
        }
        query += updateFields.join(', ') + ' WHERE PriceProposalID = $' + (updateValues.length + 1)
        updateValues.push(priceProposalID)
        const result = await pool.query(query, updateValues)
        if(result.rowCount > 0){
            res.status(200).json({message: 'Price Proposal updated successfully'})
        }else{
            res.status(500).json({message: 'Failed to update Price Proposal'})
        }
    }catch(error){
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}

const deletePriceProposal = async(req,res) => {
    const priceProposalID = req.params.priceProposalID
    if(!priceProposalID)
        return res.status(400).json({message: 'No Price Proposal given'})
    try {
        const result = await pool.query("DELETE FROM PriceProposal WHERE PriceProposalID = $1", [priceProposalID])
        if(result.rowCount > 0){
            res.status(200).json({message: 'Price Proposal deleted successfully'})
        }else{
            res.status(404).json({message: 'No Price Proposal with ID = ${PriceProposalID} found'})
        }
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error', error: error.message})
    }
}

module.exports = {
    getPriceProposal,
    createPriceProposal,
    updatePriceProposal,
    deletePriceProposal
}