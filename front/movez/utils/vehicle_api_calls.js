const axios = require('axios');
import { URL } from './consts'
import { deleteRequest, getRequest, postRequest } from './api_calls'

export const getAllVehicles = async (token) => {
	try{
		const url = `${URL}/vehicle_info/user/`
		const data = await getRequest(url, token)
		if (data.message !== "success") {
			throw new Error(data.message)
		}
		return data.vehicles
	}catch(err){
		console.log(err)
		throw new Error(err)
	}
	

}

export const createVehicle = async (token, vehicle) => {

	const url = `${URL}/vehicle_info/`

	try {
		const response = await postRequest(url, vehicle, token)
		if (response.status !== 201)
			throw new Error(response.message)
		console.log("vehicleInfo", response.data)

		return response.data.vehicleInfo
	} catch (error) {
		console.log(error)
		throw new Error(error)
	}
}

export const deleteVehicle = async (token, vehicleId) => {
	const url = `${URL}/vehicle_info/?uuid=${vehicleId}`
	try {
		const response = await deleteRequest(url, token)
		console.log("car delete",response)
		return response.data
	} catch (error) {
		console.log(error)
		throw new Error(error)
	}
}