import axios, { AxiosResponse } from "axios"

const GET_MODEL = "AddressGeneral"
const GET_CITIES_METHOD = "getCities"

const GET_WH_METHOD = "getWarehouses"

const API_KEY: string = process.env.NEXT_PUBLIC_NOVA_POST_API || ""

export type ApiParamsNovaPost = {
	apiKey: string
	modelName: string
	calledMethod: string
	methodProperties: CityPropsNP | WarehosePropsNP
}

export interface CityPropsNP {
	Page: "1"
	Limit: "20"
	Language: "UA"
	FindByString: string
}

export interface CityRespNP {
	Description: string
	Area: string
	Ref: string
}

export interface WarehosePropsNP {
	Page: "1"
	Limit: "20"
	Language: "UA"
	CityRef: string
	CityName: string
}

export interface WarehoseRespNP {
	Description: string
	ShortAddress: string
	Number: string
}

export const NovaPostServer = axios.create({
	baseURL: process.env.NEXT_PUBLIC_NOVA_POST_URL + "/api",
	withCredentials: true,
})

async function novaPostRequest<TParams extends CityPropsNP | WarehosePropsNP, TResp>(params: {
	apiKey: string
	modelName: string
	calledMethod: string
	methodProperties: TParams
}): Promise<TResp[]> {
	const res: AxiosResponse<{ data: TResp[] }> = await NovaPostServer.post("/", {
		apiKey: params.apiKey,
		modelName: params.modelName,
		calledMethod: params.calledMethod,
		methodProperties: params.methodProperties,
	})

	return res.data.data
}

export const getCities = async (apiKey: string, props: CityPropsNP): Promise<CityRespNP[]> => {
	return novaPostRequest<CityPropsNP, CityRespNP>({
		apiKey: API_KEY,
		modelName: GET_MODEL,
		calledMethod: GET_CITIES_METHOD,
		methodProperties: props,
	})
}

export const getWarehouses = async (apiKey: string, props: WarehosePropsNP): Promise<WarehoseRespNP[]> => {
	return novaPostRequest<WarehosePropsNP, WarehoseRespNP>({
		apiKey: API_KEY,
		modelName: GET_MODEL,
		calledMethod: GET_WH_METHOD,
		methodProperties: props,
	})
}
