import { postRequest, getRequest, deleteRequest,postPhotoRequest } from './api_calls'
import { URL } from './consts'

// UserID, moveStatus, moveDate, moveTime, moveFrom, moveTo,items
// items:
// ItemDescription, Height, Width, Depth, Weight, Quantity, SpecialInstructions
export const createNewMoveRequest = async (token, body, numOfPhotos) => {
	try {
		let response;
		console.log("body: ", body);
		const url = `${URL}/moverequests`;
		console.log("url47: ", url)
		if(numOfPhotos > 0){
			console.log("im in: ", numOfPhotos)
			response = await postRequest(url, body, token, null, true);
		}
		else{
			response = await postRequest(url, body, token);
		}
		console.log("API Response: ", response); // Log API response for debugging
		if (response.status !== 201) throw new Error(response.message)
		return response
	} catch (error) {
		throw error
	}
}

export const deleteMoveRequest = async (token, uuid) => {
	try {
		const url = `${URL}/moverequests/?uuid=${uuid}`;
		const response = await deleteRequest(url, token);
		console.log(`Move request with UUID ${uuid} deleted successfully.`); // Logging success message
		return response;
	} catch (error) {
		console.error(`Error deleting move request with UUID ${uuid}:`, error); // Logging error message
		throw error;
	}
};

export const searchMoveRequest = async (token, lat, lng, radius, vehicleUUID, isUsingAlgorithm) => {
	try {
		const url = `${URL}/moverequests/search`
		const body = {
			lat: lat,
			lng: lng,
			radius: radius,
			vehicleUUID: vehicleUUID,
			isUsingAlgorithm: isUsingAlgorithm
		}
		const response = await postRequest(url, body,token)
		console.log("API Response:", response); // Log API response for debugging
		return response.data;
	} catch (error) {
		console.error('Error fetching move requests via user:', error);
		throw error;
	}

}

export const showRequestedMoves = async (token) => {
	try {
		const url = `${URL}/moverequests/user`
		const response = await getRequest(url, token)
		console.log("API Response:", response); // Log API response for debugging
		return response;
	} catch (error) {
		console.error('Error fetching move requests via user:', error);
		throw error;
	}
};

export const showSingleMoveRequestItems = async (token, moveRequestId) => {
	try {
		const url = `${URL}/moverequestitems/request?uuid=${moveRequestId}`
		const response = await getRequest(url, token)
		console.log("response", response)
		if (response.message !== "success") {
			throw new Error(response.message)
		}
		return response.moveRequestItems;
	} catch (error) {
		console.error('Error fetching move request items:', error);
		throw error;
	}
}

export const uploadSingleMoveRequestItemPhoto = async ()=>{

}