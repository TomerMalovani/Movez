// generic post request revice url and body

import axios from 'axios'

export const postRequest = async (url, body,token) => {
    console.log("before send token", token)
    try {
        headers = {
            'authorization': token,
          
        }
        let response = await axios.post(url,body, {headers})   
        return response
    } catch (error) {
        return error.response
    }
}

export const getRequest = async (url,token) => {
    try {
        headers = {
            'authorization': token
        }
        const response = await axios.get(url , {headers})
        return response.data
    } catch (error) {
        return error.response.data
    }
}