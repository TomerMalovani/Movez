const { where } = require("sequelize")

const priceProposal = require("../models/index").PriceProposal
const User = require('../models/index').Users
const MoveRequest = require('../models/index').MoveRequest

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

const findMovingRequestProposals = async(req,res) => {
	const requestID = req.params.requestID
	try {
		const result = await priceProposal.findAll({ where: { RequestID: requestID }})
		// for every proposal, get the provider details from the Users table and add it to the result

		const users = await User.findAll()
		const usersMap = {}
		users.forEach(user => {
			usersMap[user.uuid] = user
		})

		result.forEach(proposal => {
			const provider = usersMap[proposal.MoverID]
			const {email,username} = provider
			proposal.dataValues.provider = { email, username }
		})

		if(result){
			res.status(200).json({message: "success", proposals: result})
		}
		else{
			res.status(404).json({message: `No proposals found for Moving Request with ID = ${movingID}`})
		}
	} catch (error) {
		console.log("error", error)
		res.status(500).json({message: "Internal Server Error", error: error.message})
	}
}

const findProposalByMoverAndRequest = async(req,res) => {
	const moverID = req.params.moverID
	const requestID = req.params.RequestID
	try {
		const result = await priceProposal.findAll({where: {MoverID: moverID, RequestID: requestID}})
		if(result){
			res.status(200).json({message: "success", proposals: result})
		}
		else{
			res.status(404).json({message: `No proposals found for Mover with ID = ${moverID} and Request with ID = ${requestID}`})
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({message: "Internal Server Error", error: error.message})
	}
}

const getProviderPricePropasal = async (req, res) => {
	const moverID = req.params.moverID;
	try {
		const result = await priceProposal.findAll({ where: { MoverID: moverID } });

		for (const proposal of result) {
			const request = await MoveRequest.findOne({ where: { uuid: proposal.RequestID } });
			if (request) {
				
				proposal.dataValues.request = request;
			}
		}

		if (result.length > 0) {
			res.status(200).json({ message: "success", proposals: result });
		} else {
			res.status(404).json({ message: `No proposals found for Mover with ID = ${moverID}` });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error", error: error.message });
	}
};



const moverAgreePriceProposal = async(req,res) => {
	const priceProposalID = req.params.uuid
	let newStatus;
	try {
		const currRequest = await priceProposal.findOne({where: {uuid: priceProposalID}})
		if(currRequest.PriceStatus === "Pending"){
		const result = await priceProposal.update({PriceStatus: "AcceptedByMover"}, {where: {uuid: priceProposalID}})
		newStatus = "AcceptedByMover"
	}else {
			// if (currRequest.PriceStatus === "AcceptedByClient")
			const result = await priceProposal.update({PriceStatus: "Accepted"}, {where: {uuid: priceProposalID}})
			await MoveRequest.update({MoveStatus: "Accepted"}, {where: {uuid: currRequest.RequestID}})
			newStatus = "Accepted"

		}
		if(result){
			res.status(200).json({ message: "Price Proposal Accepted", newStatus: newStatus })
		}
		else{
			res.status(404).json({message: `No Price Proposal with ID = ${priceProposalID} found`})
		}
	} catch (error) {
		console.log("agree eror",error);
		res.status(500).json({message: "Internal Server Error", error: error.message})
	}
}

const clientAgreePriceProposal = async (req, res) => {
	const priceProposalID = req.params.uuid
	let result;
	try {
		const currRequest = await priceProposal.findOne({ where: { uuid: priceProposalID } })
		if (currRequest.PriceStatus === "Pending") {
			 result = await priceProposal.update({ PriceStatus: "AcceptedByClient" }, { where: { uuid: priceProposalID } })
		} else {
			// if (currRequest.PriceStatus === "AcceptedByClient")
			 result = await priceProposal.update({ PriceStatus: "Accepted" }, { where: { uuid: priceProposalID } })
			await MoveRequest.update({ MoveStatus: "Accepted" }, { where: { uuid: currRequest.RequestID } })

		}
		if (result) {
			res.status(200).json({ message: "Price Proposal Accepted" })
		}
		else {
			res.status(404).json({ message: `No Price Proposal with ID = ${priceProposalID} found` })
		}
	} catch (error) {
		console.log("client aggree",error);
		res.status(500).json({ message: "Internal Server Error", error: error.message })
	}
}

module.exports = {
    getPriceProposal,
    createPriceProposal,
    updatePriceProposal,
    deletePriceProposal,
	findMovingRequestProposals,
	findProposalByMoverAndRequest,
	getProviderPricePropasal,
	clientAgreePriceProposal,
	moverAgreePriceProposal
}