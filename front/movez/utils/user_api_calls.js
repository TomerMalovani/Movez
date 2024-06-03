import { postRequest ,getRequest} from './api_calls'
import {URL} from './consts'
// accept env variables
// import dotenv from 'dotenv'
// dont = dotenv.config()
// const {URL} = process.env


export const register = async (username, email, password) => {
    const body = {
        username,
        email,
        password
    }
    try {
		const respone = await postRequest(`${URL}/users/register`, body)
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
			return res.user
		}else throw new Error(res.message)
      
    } catch (error) {
        console.log(error)
		throw new Error(error)
    }
}