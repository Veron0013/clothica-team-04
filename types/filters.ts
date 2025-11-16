import { GoodCategory } from "./goods"

export type AllFilters = {
	categories?: GoodCategory[]
	colors?: string[]
	genders?: string[]
	sizes?: string[]
	fromPrice?: number
	toPrice?: number
}

export type AllSortData = {
	price_asc: "Ціна +"
	price_desc: "Ціна -"
	name_asc: "Назва +"
	name_desc: "Назва -"
}
