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

        // Check if the response contains an error message
        if (response.message && response.message !== "success") {
            console.error("Error in response:", response.message);
            return { message: response.message };
        }

        // If the response is successful, return it
        return response;
    } catch (error) {
        console.error("Error fetching provider reviews:", error);
        return { message: "Internal Error", error: error.message };
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
        if (response.message && response.message !== "success") {
            console.error("Error in response:", response.message);
            return { message: response.message, reviews: [] };
        }

        // If the response is successful, return the review data
        return response;
    } catch (error) {
        console.error("Error fetching review by request ID:", error);
        return { message: "Internal Error", error: error.message, reviews: [] };
    }
};

