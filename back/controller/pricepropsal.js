const pool = require("../db")
const priceProposal = require("../models/index").PriceProposal

const getPriceProposal = async(req,res) => {
    const pricePropsalID = req.query.uuid
    try {
        //const result = await pool.query("SELECT * FROM PricePropsal WHERE PricePropsalID = $1", [pricePropsalID])
        const result = await priceProposal.findByPk(pricePropsalID)
        if(result){
            res.PriceStatus(200).json({meesage:"success", pricePropsal: result.rows[0]})
        }
        else{
            res.PriceStatus(404).json({message:`No Price Propsal with ID = ${PriceProposalID} found`})
        }
    } catch (error) {
        res.PriceStatus(500).json({message: "Internal Server error", error: error.message})
    }
}

const createPriceProposal = async(req,res) => {
    const {RequestID, MoverID, MovingID, EstimatedCost, PriceStatus} = req.body
    console.log(RequestID, MoverID, MovingID, EstimatedCost, PriceStatus)
    console.log('im here')
    try {
        //const result = await pool.query(
        //    `INSERT INTO PriceProposal 
        //    (PriceProposalID, RequestID, MoverID, MovingID, EstimatedCost, PriceStatus)
        //     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, 
        //     [pricePropsalID, RequestID, MoverID, MovingID, EstimatedCost, PriceStatus])
        const result = await priceProposal.create({RequestID, MoverID, MovingID, EstimatedCost, PriceStatus})
        if(result){
            res.status(201).json({message: "Price Proposal Created Successfully", priceProposal: result})
        }
        else{
            res.status(500).json({message: "Failed to create Price Proposal"})
         }
        } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

const updatePriceProposal = async (req, res) => {
    const { RequestID, MoverID, MovingID, EstimatedCost, PriceStatus } = req.body;
    const priceProposalID = req.query.uuid;

   // if (!PriceStatus && !RequestID && !MoverID && !MovingID &EstimatedCost) {
   //     return res.PriceStatus(400).json({ message: 'No fields to update' });
   // }

    try {
        const [numOfRowsAffected, affectedRows] = await priceProposal.update(
            { RequestID, MoverID, MovingID, EstimatedCost, PriceStatus },
            { where: { uuid: priceProposalID }, returning: true}
        );

        if (numOfRowsAffected > 0) {
            res.status(200).json({ message: 'Price Proposal updated successfully', priceProposal: affectedRows[0]});
        } else {
            res.status(404).json({ message: 'Price Proposal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const deletePriceProposal = async(req,res) => {
    const priceProposalID = req.query.uuid
    try {
        const result = await priceProposal.destroy({where: {uuid: priceProposalID}})
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