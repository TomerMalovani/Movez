import { postRequest ,getRequest} from './api_calls'
import {URL} from './consts'

// UserID, moveStatus, moveDate, moveTime, moveFrom, moveTo,items
// items:
// ItemDescription, Height, Width, Depth, Weight, Quantity, SpecialInstructions
export const createNewMoveRequest = async (token,body) => {

    try{

        const url = `${URL}/moverequests/`
        const reqBody ={
            moveStatus:"Pending", 
            moveDate: body.moveDate,
            moveTime: body.moveDate,
            moveFromCoor: body.moveFromCoor,
            moveToCoor: body.moveToCoor,
            fromAddress:body.fromAddress,
            toAddress:body.toAddress,
            items: body.items
        }
        const response = await postRequest(url,reqBody,token)
        return response
    }catch(error){
        console.log("ERROR IN POST",error)
    }

 
}

export const showRequestedMoves = async (token) => {
    try {
        const url = `${URL}/moverequests/user`
        const response = await getRequest(url,token)
		console.log("API Response:", response); // Log API response for debugging
        return response;
    } catch (error) {
        console.error('Error fetching move requests via user:', error);
        throw error;
    }
};