import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import ProductsPageClient from "./page-client"
import { SearchParams } from "next/dist/server/request/search-params"
import { GoodsFilter } from "@/lib/productsServise"

interface Props {
	searchParams: Promise<GoodsFilter>
}

const ProductsPage = async ({ searchParams }: Props) => {
	const search = searchParams ? await searchParams : {}

	console.log(search)

	const queryClient = new QueryClient()

	//const query = new URLSearchParams(params).toString()
	//const res = await fetch(`${process.env.API_URL}/goods?${query}`, { cache: "no-store" })
	//const data = await res.json()

	//const qParam: SearchParams = {
	//	category,
	//	page: 1,
	//}npm run dev

	await queryClient.prefetchQuery({
		queryKey: ["GoodsByCategories", search],
		//queryFn: () => getTrandingMovies(qParam),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProductsPageClient />
		</HydrationBoundary>
	)
}

export default ProductsPage
