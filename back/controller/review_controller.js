const { Review, Users } = require('../models'); // Import the Review model

const createReview = async (req, res) => {
    const { rating, comment, RequesterID, ProviderID, RequestID } = req.body;

    try {
        console.log("in review controller");
        console.log("providerId: ", ProviderID, "comment: ", comment, "requestId: ", RequestID);
        const result = await Review.create({
            rating,
            comment,
            RequesterID,
            ProviderID,
            RequestID
        });

        if (result) {
            res.status(201).json({ message: "Review Created Successfully", review: result });
        } else {
            res.status(500).json({ message: "Failed to create review" });
        }
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getProviderReviews = async (req, res) => {
    const providerId = req.params.providerId;

    try {
        console.log("Fetching reviews for provider ID:", providerId);
        const reviews = await Review.findAll({ where: { ProviderID: providerId } });

        if (reviews && reviews.length > 0) {
            console.log("reviews in the back: ", reviews);
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = (totalRating / reviews.length).toFixed(2);

            res.status(200).json({
                message: "success",
                reviews,
                averageRating,
            });
        } else {
            res.status(200).json({ message: "no_reviews", reviews: [], averageRating: 0 });
        }
    } catch (error) {
        console.error("Error fetching provider reviews:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



const updateReview = async (req, res) => {
    const { rating, comment } = req.body;
    const reviewUuid = req.params.reviewUuid;
    try {
        // Attempt to update the review
        console.log("req is: " ,req);
        console.log("the new rating and comment are: ", rating, "comment: ", comment);
        console.log("the reviewId: ", reviewUuid);
        const [numOfRowsAffected, updatedRows] = await Review.update(
            { rating, comment },
            { where: { uuid: reviewUuid }, returning: true }
        );

        // Check if the update was successful
        if (numOfRowsAffected > 0) {
            res.status(200).json({ message: 'Review updated successfully', review: updatedRows[0] });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



const getReviewByRequest = async (req, res) => {
    const requestId = req.params.requestId;

    try {
        // Log the request ID to verify it's being received correctly
        console.log("Fetching review for request ID:", requestId);

        // Fetch the review for the given request ID
        const review = await Review.findOne({ where: { RequestID: requestId } });

        // Check if the review was found
        if (review) {
            console.log("Review found:", review);
            res.status(200).json({ message: "success", review });
        } else {
            res.status(404).json({ message: `No review found for Request ID = ${requestId}` });
        }
    } catch (error) {
        console.error("Error fetching review by request ID:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = {
    createReview,
    getProviderReviews,
    updateReview,
    getReviewByRequest
};
