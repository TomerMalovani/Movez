const Messages = require('../models/index').Messages
const MoveRequest = require('../models/index').MoveRequest
const PriceProposal = require('../models/index').PriceProposal

const getUsersUUIDFromChat = async (req, res) => {
    const requestID = req.params.uuid;

    try {
        // Find the chat by primary key

        // If no chat is found, return a 404 error
        // Find the move request associated with the chat
        const chatMoveRequest = await MoveRequest.findByPk(requestID);
        if (!chatMoveRequest) {
            return res.status(404).json({ message: `No move request found with ID = ${chat.RequestID}` });
        }

        // Find all price proposals related to the move request
        const priceProposals = await PriceProposal.findAll({ where: { RequestID: chatMoveRequest.uuid } });

        // Collect the UUIDs of users involved in the chat
        const usersUUID = [chatMoveRequest.UserID];
        priceProposals.forEach((proposal) => {
            usersUUID.push(proposal.MoverID);
        });

        // Return the collected UUIDs
        res.status(200).json({ usersUUID });

    } catch (error) {
        // Log the error and return a 500 status with the error message
        console.error('Error fetching users from chat:', error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
  
  module.exports = {
    getUsersUUIDFromChat,
  };