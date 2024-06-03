// generic post request revice url and body

import axios from 'axios'

export const postRequest = async (url, body,token) => {
    console.log("before send token", token,url)
    try {
        headers = {
            'authorization': token,
          
        }
        let response = await axios.post(url,body, {headers})   
		console.log("response",response)
        return response
    } catch (error) {
        return error.response
    }
}

export const getRequest = async (url,token) => {
    try {
		console.log("token",token)
        headers = {
            'Authorization': token
        }
        const response = await axios.get(url , {headers})
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export const deleteRequest = async (url,token) => {
	try {
		headers = {
			'Authorization': token
		}
		const response = await axios.delete(url , {headers})
		if (response.status !== 200)
			throw new Error(response.message)
		return response.data
	} catch (error) {
		throw new Error(error.response.data) 

	}
}