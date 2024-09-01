import { postRequest, getRequest, deleteRequest } from './api_calls'
import { URL } from './consts'

const base_url = `${URL}/priceproposal`

export const createPriceProposal = async (token, body) => {
	try {
		const url = `${base_url}/`
		console.log("url", url)
		const reqBody = {
			...body
		}
		const response = await postRequest(url, reqBody, token)
		if (response.status !== 201) throw new Error(response.message)
		return response
	} catch (error) {
		throw error
	}
}

export const removePriceProposal = async (token, uuid) => {
	try {
		const url = `${base_url}/?uuid=${uuid}`
		const response = await deleteRequest(url, token)
		if (response.status !== 200) throw new Error(response.message)
		return response
	} catch (error) {
		throw error
	}
}

// /proposal/request/:requestID
export const getPriceProposalsByRequest = async (token, requestID) => {
	try {
		const url = `${base_url}/request/${requestID}`
		const response = await getRequest(url, token)
		console.log("response priceProp", response)
		if (response.data.message !== "success") throw new Error(response.data.message)
		return response.data.proposals
	} catch (error) {
		throw error
	}
}

// proposal/requestbymover/:RequestID/:moverID
export const getPriceProposalsByRequestAndMover = async (token, requestID, moverID) => {
	try {
		const url = `${base_url}/requestbymover/${requestID}/${moverID}`
		const response = await getRequest(url, token)
		console.log("response price", response)

		if (response.data.message !== "success") throw new Error(response.data.message)
		return response.data.proposals[0]
	} catch (error) {
		throw error
	}
}


export const getPriceProposalForProvider = async (token, moverID) => {
	try {
		const url = `${base_url}/provider/${moverID}`
		const response = await getRequest(url, token)
		console.log("response price", response)
		if (response.data.message !== "success") throw new Error(response.data.message)
		return response.data.proposals
	} catch (error) {
		console.log(error)
		throw error
	}
}

// /moveragree/: uuid
// 	/ clientagree /: uuid
// GET

export const moverAgreePriceProposal = async (token, uuid) => {
	try {
		const url = `${base_url}/moveragree/${uuid}`
		const response = await getRequest(url, token)
		if (response.status !== 200) throw new Error(response.message)
		return response.data
	} catch (error) {
		throw error
	}
}

export const clientAgreePriceProposal = async (token, uuid) => {
	try {
		const url = `${base_url}/clientagree/${uuid}`
		const response = await getRequest(url, token);
		console.log("in api_price_prop. response: ", response, response.status);
		if (response.status !== 200) throw new Error(response.data.message)
		return response.data
	} catch (error) {
		throw error
	}
}

export const clientCancelPriceProposal = async (token, uuid) => {
	try {
		const url = `${base_url}/clientCancel/${uuid}`
		const response = await getRequest(url, token);
		console.log("in api_price_prop. response: ", response, response.status);
		if (response.status !== 200) throw new Error(response.data.message)
		return response.data
	} catch (error) {
		throw error
	}
}