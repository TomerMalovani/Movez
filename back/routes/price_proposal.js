var express = require('express');
var router = express.Router();
const {uuIDValidation} = require('../validation/uuidValidation');
const {priceProposalPostValidation, validateUpdatePriceProposal} = require('../validation/priceproposal_validation');

const {getPriceProposal,
    createPriceProposal,
    updatePriceProposal,
    deletePriceProposal,
	findMovingRequestProposals,
	findProposalByMoverAndRequest,
	getProviderPricePropasal,
	clientAgreePriceProposal,
	moverAgreePriceProposal
} = require("../controller/pricepropsal")

router.get('/request/:requestID', findMovingRequestProposals)
router.get('/requestbymover/:RequestID/:moverID', findProposalByMoverAndRequest)
router.get('/provider/:moverID', getProviderPricePropasal)
router.route('/').post(priceProposalPostValidation, createPriceProposal).
get(uuIDValidation, getPriceProposal).
patch(uuIDValidation, validateUpdatePriceProposal, updatePriceProposal).
delete(uuIDValidation, deletePriceProposal)

router.get('/moveragree/:uuid', moverAgreePriceProposal)
router.get('/clientagree/:uuid', clientAgreePriceProposal)


module.exports = router;