const axios = require('axios');
import { URL } from './consts'
import { deleteRequest, getRequest, postRequest, postPhotoRequest, putRequest } from './api_calls'

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


export const getVehicleByVehicleUUID = async (token, vehicleUUID) => {
    try {
		const url = `${URL}/vehicle_info/?uuid=${vehicleUUID}`;
		console.log("the url: ", url);
		const data = await getRequest(url, token);

        if (data.message !== "success") {
            throw new Error(data.message);
        }

        return data.VehicleInfo;
    } catch (err) {
        console.error("Error fetching vehicle info by UUID:", err);
        throw new Error(err);
    }
};


export const createVehicle = async (token, vehicle, image) => {

	const url = `${URL}/vehicle_info/`
	
	try {
		const response = await postRequest(url, vehicle, token, image)
		if (response.status !== 201)
			throw new Error(response.message)
		console.log("vehicleInfo", response.data)

		return response.data.vehicleInfo
	} catch (error) {
		console.log(error)
		throw new Error(error)
	}
}

export const editVehicle = async (token, vehicle, image) => {
	const url = `${URL}/vehicle_info/?uuid=${vehicle.uuid}`
	try {
		const response = await putRequest(url, vehicle, token, image)
		console.log(response)
		if (response.status !== 200)
			throw new Error(response.message)
		console.log("vehicleInfo", response.data.vehicleInfo);
		return response.data.vehicleInfo
	} catch (error) {
		console.log(error)
		throw new Error(error)
	}
}

export const deleteVehiclePhoto = async (token, vehicleId) => {
	const url = `${URL}/vehicle_info/photo/?uuid=${vehicleId}`
	try {
		const response = await deleteRequest(url, token)
		if (response.status !== 200)
			throw new Error(response.message)
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