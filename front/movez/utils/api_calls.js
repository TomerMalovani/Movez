// generic post request revice url and body

import axios from 'axios'

export const postRequest = async (url, body,token, image) => {
    console.log("before send token", token, url);
    try {
        const headers = {
            'authorization': token,
        };

        let formData;
        if (image) {
            formData = new FormData();
            formData.append('file', {
                uri: image.uri,
                name: image.name,
                type: image.type,
            });
            Object.keys(body).forEach(key => {
                formData.append(key, body[key]);
            });
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            formData = body;
        }

        let response = await axios.post(url, formData, { headers });
        console.log("response", response);
        return response;
    } catch (error) {
        console.error("Error in postRequest:", error);
        return error.response;
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

export const deleteRequest = async (url, token) => {
    try {
        const headers = {
            'Authorization': token
        };

        const response = await axios.delete(url, { headers });

        if (response.status !== 200) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            throw new Error(response.statusText); // Throw an error with the status text
        }
        console.log(`DELETE request to ${url} successful.`);
        return response;
    } catch (error) {
        console.error('Error in deleteRequest:', error);
        throw error; // Re-throw the error to propagate it further
    }
};




export const putRequest = async (url, body, token) => {
    try {
        const headers = {
            'Authorization': token
        };

        let formData;
        if (image) {
            formData = new FormData();
            formData.append('file', {
                uri: image.uri,
                name: image.name,
                type: image.type,
            });
            Object.keys(body).forEach(key => {
                formData.append(key, body[key]);
            });
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            formData = body;
        }

        const response = await axios.put(url, formData, { headers });

        if (response.status !== 200) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            throw new Error(response.statusText); // Throw an error with the status text
        }

        console.log(`PUT request to ${url} successful.`);
        return response.data;
    } catch (error) {
        console.error('Error in putRequest:', error);
        throw error; // Re-throw the error to propagate it further
    }
}

export const postPhotoRequest = async (url, data, token) => {
    try{
        const headers = {
            'Authorization': token,
            'Content-Type': 'multipart/form-data'
        }
        const response = await axios.post(url, data, {headers});
        return response;
    }
    catch(error){
        console.log("error in uploading photo: ",error);
        throw error;
    }
}