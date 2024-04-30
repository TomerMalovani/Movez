var express = require('express');
var router = express.Router();

const {getPriceProposal,
    createPriceProposal,
    updatePriceProposal,
    deletePriceProposal
} = require("../controller/pricepropsal")

router.route('/').post(createPriceProposal)
router.route('/:priceProposalID').get(getPriceProposal).patch(updatePriceProposal).delete(deletePriceProposal)

module.exports = router;