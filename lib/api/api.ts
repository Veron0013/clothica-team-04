import axios from "axios"

export const nextServer = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
	//baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
})
