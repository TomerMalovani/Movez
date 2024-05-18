var express = require('express');
var router = express.Router();
const {uuIDValidation} = require('../validation/uuidValidation');
const {priceProposalPostValidation, validateUpdatePriceProposal} = require('../validation/priceproposal_validation');

const {getPriceProposal,
    createPriceProposal,
    updatePriceProposal,
    deletePriceProposal
} = require("../controller/pricepropsal")

router.route('/').post(priceProposalPostValidation, createPriceProposal).
get(uuIDValidation, getPriceProposal).
patch(uuIDValidation, validateUpdatePriceProposal, updatePriceProposal).
delete(uuIDValidation, deletePriceProposal)

module.exports = router;