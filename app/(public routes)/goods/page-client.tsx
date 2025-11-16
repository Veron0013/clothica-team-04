"use client"

import { GoodsList } from "@/components/GoodsList"
import { getGoods } from "@/lib/api/api"
import toastMessage, { MyToastType } from "@/lib/messageService"
import { CLEAR_FILTERS, PER_PAGE } from "@/lib/vars"
import { Good, GoodsQuery } from "@/types/goods"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import MessageNoInfo from "@/components/MessageNoInfo/MessageNoInfo"
import css from "./page-client.module.css"
import FilterPanel from "@/components/Filters/FilterPanel"
import Loading from "@/app/loading"
import { AllSortData } from "@/types/filters"
import { debounce } from "lodash"

const ProductsPageClient = () => {
	const router = useRouter()
	const sp = useSearchParams()
	const pathname = usePathname()

	const [displayedGoods, setDisplayedGoods] = useState<Good[]>([])
	const [dataQty, setDataQty] = useState(0)

	const limit = PER_PAGE

	const initialSearch = sp.get("search") || ""
	const initialSort = (sp.get("sort") as keyof AllSortData) || "price_asc"

	const [searchValue, setSearchValue] = useState(initialSearch)
	const [selectedSort, setSelectedSort] = useState<keyof AllSortData>(initialSort)

	const searchParams: GoodsQuery = {
		limit: Number(sp.get("limit")) || limit,
		page: Number(sp.get("page")) || 1,
		...Object.fromEntries(sp.entries()),
	} as GoodsQuery

	const { data, isFetching } = useQuery({
		queryKey: ["GoodsByCategories", searchParams, limit],
		queryFn: async () => {
			const res = await getGoods(searchParams)
			if (!res) toastMessage(MyToastType.error, "bad request")
			return res
		},
		placeholderData: keepPreviousData,
		refetchOnMount: false,
	})

	useEffect(() => {
		if (!data) return
		const fetchDisplayedGoods = () => {
			setDisplayedGoods((prev) => {
				const existingIds = new Set(data.goods.map((i) => i._id))
				const filteredPrev = prev.filter((i) => existingIds.has(i._id))

				const newGoods = data.goods.filter((i) => !filteredPrev.some((p) => p._id === i._id))
				setDataQty(newGoods.length)
				return [...filteredPrev, ...newGoods]
			})
		}
		fetchDisplayedGoods()
	}, [data])

	const handleShowMore = () => {
		const nextLimit = Number(searchParams.limit) + 3
		const newParams = new URLSearchParams(sp)
		newParams.set("limit", String(nextLimit))
		router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
	}

	////
	const sortOptions: { value: keyof AllSortData; label: string }[] = [
		{ value: "price_asc", label: "Ціна +" },
		{ value: "price_desc", label: "Ціна -" },
		{ value: "name_asc", label: "Назва +" },
		{ value: "name_desc", label: "Назва -" },
	]

	const debouncedUpdateSearch = useMemo(
		() =>
			debounce((value: string) => {
				const params = new URLSearchParams(sp.toString())
				if (value) params.set("search", value)
				else params.delete("search")
				params.delete("page")
				router.push(`${pathname}?${params.toString()}`, { scroll: false })
			}, 300),
		[sp, pathname, router]
	)

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
		debouncedUpdateSearch(e.target.value)
	}

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value as keyof AllSortData
		setSelectedSort(value)

		const params = new URLSearchParams(sp.toString())
		params.set("sort", value)
		params.delete("page")
		router.push(`${pathname}?${params.toString()}`, { scroll: false })
	}

	return (
		<>
			<section className={css.goods}>
				<h1 className={css.title}>Всі товари</h1>

				<div className={css.layout}>
					<FilterPanel vieved={Math.min(data?.limit || 0, data?.totalGoods || 0)} total={data?.totalGoods || 0} />

					<div className={css.goodsContent}>
						<div className={css.searchWrapper}>
							<input
								type="text"
								placeholder="Пошук товарів..."
								className={css.searchInput}
								value={searchValue}
								onChange={handleSearchChange}
							/>
						</div>
						<div className={css.sortWrapper}>
							<select
								className={css.sortSelect}
								value={selectedSort} // стан, який будемо створювати
								onChange={handleSortChange}
							>
								{sortOptions.map((opt) => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						</div>

						{displayedGoods.length > 0 && <GoodsList items={displayedGoods} dataQty={dataQty} />}

						{isFetching && <Loading />}

						{!isFetching && data && data?.limit < data?.totalGoods && (
							<button className={css.cardCta} onClick={handleShowMore} disabled={isFetching}>
								{isFetching ? "Завантаження..." : `Показати ще `}
							</button>
						)}

						{data && data?.totalGoods === 0 && (
							<MessageNoInfo buttonText="Скинути фільтри" text={CLEAR_FILTERS} route="/goods" />
						)}
					</div>
				</div>
			</section>
		</>
	)
}

export default ProductsPageClient
