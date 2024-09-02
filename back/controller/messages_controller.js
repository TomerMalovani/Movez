const messages = require('../models/index').Messages
const users = require('../models/index').Users
const moveRequest = require('../models/index').MoveRequest
const priceProposal = require('../models/index').PriceProposal

const getUsersUUIDFromChat = async (req, res) => {
    const chatID = req.params.uuid
    try {
        const chat = await messages.findByPk(chatID);
        const usersUUID = []
        if (chat) {
           const chatmoveRequest = await moveRequest.findByPk(chat.RequestID);
           const pricePropsals = await priceProposal.findAll({ where: { RequestID: moveRequestUUID.uuid }})
           usersUUID.push(chatmoveRequest.RequesterID);
           pricePropsals.forEach(priceProposal => {
               usersUUID.push(priceProposal.MoverID);
           });
        }
        else {
            res.status(404).json({ message: `No messages found for with ID = ${chatID}` })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}