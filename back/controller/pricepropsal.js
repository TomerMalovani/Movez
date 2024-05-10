const pool = require("../db")
const PriceProposal = require("../models/PriceProposal")

const getPriceProposal = async(req,res) => {
    const pricePropsalID = req.params.uuid
    try {
        //const result = await pool.query("SELECT * FROM PricePropsal WHERE PricePropsalID = $1", [pricePropsalID])
        const result = await PriceProposal.findByPk(pricePropsalID)
        if(result){
            res.status(200).json({meesage:"success", pricePropsal: result.rows[0]})
        }
        else{
            res.status(404).json({message:`No Price Propsal with ID = ${PriceProposalID} found`})
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server error", error: error.message})
    }
}

const createPriceProposal = async(req,res) => {
    const {requestID, moverID, movingID, estimatedCost, status} = req.body
    try {
        //const result = await pool.query(
        //    `INSERT INTO PriceProposal 
        //    (PriceProposalID, RequestID, MoverID, MovingID, EstimatedCost, Status)
        //     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, 
        //     [pricePropsalID, requestID, moverID, movingID, estimatedCost, status])
        const result = await PriceProposal.create({requestID, moverID, movingID, estimatedCost, status})
        if(result){
            res.status(201).json({message: "Price Proposal Created Successfully", priceProposal: result.rows[0]})
        }
        else{
            res.status(500).json({message: "Failed to create Price Proposal"})
         }
        } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

const updatePriceProposal = async (req, res) => {
    const { requestID, moverID, movingID, estimatedCost, status } = req.body;
    const priceProposalID = req.params.uuid;

    if (!status && !requestID && !moverID && !movingID && !estimatedCost) {
        return res.status(400).json({ message: 'No fields to update' });
    }

    try {
        const [affectedRows] = await PriceProposal.update(
            { requestID, moverID, movingID, estimatedCost, status },
            { where: { uuid: priceProposalID } }
        );

        if (affectedRows > 0) {
            res.status(200).json({ message: 'Price Proposal updated successfully' });
        } else {
            res.status(404).json({ message: 'Price Proposal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const deletePriceProposal = async(req,res) => {
    const priceProposalID = req.params.uuid
    try {
        const result = await PriceProposal.destroy({where: {uuid: priceProposalID}})
        if(result){
            res.status(200).json({message: 'Price Proposal deleted successfully'})
        }else{
            res.status(404).json({message: `No Price Proposal with ID = ${PriceProposalID} found`})
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