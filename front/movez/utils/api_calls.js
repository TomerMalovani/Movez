// generic post request revice url and body

import axios from 'axios'

export const postRequest = async (url, body) => {
    try {
        console.log(url,body)
        let response = await axios.post(url, body)   
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
        console.log(response)
        return response.data
    } catch (error) {
        return error.response.data
    }
}