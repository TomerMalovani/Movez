var express = require('express');
var router = express.Router();

const { createReview, getProviderReviews, getReviewByRequest, updateReview } = require("../controller/review_controller");

router.route('/').post(createReview);
router.get('/provider/:providerId', getProviderReviews);
router.get('/request/:requestId', getReviewByRequest);
router.patch('/:reviewUuid', updateReview);
module.exports = router;