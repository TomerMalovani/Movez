const axios = require('axios');
import { URL } from './consts'
import { getRequest, postRequest } from './api_calls'

export const getAllVehicles = async (token) => {
	try{
		const url = `${URL}/vehicle_info/user/`
		const data = await getRequest(url, token)
		if (data.message !== "success") {
			throw new Error(data.message)
		}
		console.log(data.vehicles)
		return data
	}catch(err){
		console.log(err)
		throw new Error(err)
	}
	

}

export const createVehicle = async (token, vehicle) => {

	const url = `${URL}/vehicle_info/`
	const body = {
		...vehicle
	}
	try {
		const response = await postRequest(url, body, token)
		console.log(response)
		return response.data
	} catch (error) {
		console.log(error)
		throw new Error(error)
	}
}