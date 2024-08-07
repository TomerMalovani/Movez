import { postRequest ,getRequest, postPhotoRequest, deleteRequest} from './api_calls'
import {URL} from './consts'
// accept env variables
// import dotenv from 'dotenv'
// dont = dotenv.config()
// const {URL} = process.env


export const register = async (username, email, password, firstName, lastName, phoneNumber, image) => {
    const body = {
        username: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber
    }
    try {
		const respone = await postRequest(`${URL}/users/register`, body, null, image)
		if (respone.status !== 201) throw new Error(respone.data.message)
			return respone.data
    } catch (error) {
		throw error
    }
}

export const login = async (username, password) => {
    const body = {
        username,
        password
    }
    try {
     const respone = await  postRequest(`${URL}/users/login`, body)

		if (respone.status !== 200) throw new Error(respone.data.message)
	return respone.data
    } catch (error) {
		throw error
    }
}

export const getProfile = async (token) => {
    try {
        // console.log("token",token)
		const res = await getRequest(`${URL}/users`, token)
		if (res.user){
			console.log("res", res)
            console.log("res.user", res.user)
			return res.user
		}else throw new Error(res.message)
      
    } catch (error) {
        console.log(error)
		throw new Error(error)
    }
}

export const uploadPhoto = async (token, photo) => {
    try{
        const res = await postPhotoRequest(`${URL}/users/photo`, photo, token);
        if(res.status !== 201) throw new Error(res.message)
        return res.data
    }
    catch(error){
        throw error
    }
}

export const deleteProfilePhoto = async (token) => {
    try{
        const res = await deleteRequest(`${URL}/users/photo`, token);
        console.log("deleteProfilePhoto status: ", res.status)
        if(res.status !== 200) throw new Error(res.message)
        return res.data
    }
    catch(error){
        throw error
    }
}