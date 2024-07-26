import { postRequest, getRequest, deleteRequest,postPhotoRequest } from './api_calls'
import { URL } from './consts'

// UserID, moveStatus, moveDate, moveTime, moveFrom, moveTo,items
// items:
// ItemDescription, Height, Width, Depth, Weight, Quantity, SpecialInstructions
export const createNewMoveRequest = async (token, body) => {

	try {

		const url = `${URL}/moverequests/`
		const reqBody = {
			moveStatus: "Pending",
			moveDate: body.moveDate,
			moveTime: body.moveDate,
			moveFromCoor: body.moveFromCoor,
			moveToCoor: body.moveToCoor,
			fromAddress: body.fromAddress,
			toAddress: body.toAddress,
			items: body.items
		}
		const response = await postRequest(url, reqBody, token)
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

export const searchMoveRequest = async (token, lat,lng,radius) => {
	try {
		const url = `${URL}/moverequests/search`
		const body = {
			lat: lat,
			lng: lng,
			radius: radius
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