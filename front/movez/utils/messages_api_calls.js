import { getRequest } from "./api_calls";
import { URL } from "./consts";

export const getUsersMessage = async (token, chatID) => {
    try {
        const url = `${URL}/messages/users/${chatID}`;
        const response = await getRequest(url, token);
        console.log("API Response: ", response); // Log API response for debugging
       if(response.status !== 200) throw new Error(response.data.message)
        return response.data;
    } catch (error) {
        throw error
    }
}