export const GENDERS = ["male", "female", "unisex"]
export const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"]
export const COLORS = ["white", "black", "grey", "blue", "green", "red", "pastel"]

export type goodsSize = "XL" | "XS" | "S" | "M" | "L" | "XXL"
export type goodsGender = "male" | "female" | "unisex"

export interface GoodsFilter {
	size: goodsSize
	gender: goodsGender
	price_from: number
	price_to: number
}
