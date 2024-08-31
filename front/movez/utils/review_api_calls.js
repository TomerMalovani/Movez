import { postRequest, getRequest, putRequest, deleteRequest ,postPhotoRequest } from './api_calls'
import { URL } from './consts'

const base_url = `${URL}/review`

export const createReview = async (token, body) => {
    try {
        const url = `${base_url}/`;
        console.log("url is ", url);
        const response = await postRequest(url, body, token);
        if (response.status !== 201) throw new Error(response.message);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getProviderReviews = async (token, providerId) => {
    try {
        const url = `${base_url}/provider/${providerId}`;
        console.log("Fetching provider reviews with URL:", url);
        const response = await getRequest(url, token);

        if (typeof response === 'object' && response.data.message) {
            if (response.data.message === "success") {
                return response.data;  // Return as is
            } else if (response.data.message === "no_reviews") {
                return { message: "no_reviews", reviews: [], averageRating: 0 };
            } else {
                console.error("Error in response:", response.data.message);
                return { message: response.data.message, reviews: [], averageRating: 0 };
            }
        } else {
            console.error("Unexpected response format:", response);
            return { message: "Unexpected response format", reviews: [], averageRating: 0 };
        }
    } catch (error) {
        console.error("Error fetching provider reviews:", error);
        return { message: "Internal Error", reviews: [], averageRating: 0 };
    }
};


export const updateReview = async (token, reviewUuid, body) => {
    try {
        const url = `${base_url}/${reviewUuid}`;
        console.log("url to update review: ", url);
        const response = await putRequest(url, body, token);
        if (response.status !== 200) throw new Error(response.message);
        return response;
    } catch (error) {
        throw error;
    }
};


export const getReviewByRequest = async (requestId, token) => {
    try {
        const url = `${base_url}/request/${requestId}`;
        console.log("Fetching review for request with URL:", url);
        const response = await getRequest(url, token);

        // Check if the response contains an error message
        if (response.data.message && response.data.message !== "success") {
            console.error("Error in response:", response.data.message);
            return { message: response.data.message, reviews: [] };
        }

        // If the response is successful, return the review data
        return response.data;
    } catch (error) {
        console.error("Error fetching review by request ID:", error);
        return { message: "Internal Error", error: error.message, reviews: [] };
    }
};

