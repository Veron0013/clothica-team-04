"use client"
import css from "./PopularGoods.module.css"
import Link from "next/link"
import { useRef, useState } from "react"
import { type Good } from "@/types/goods"
import { GoodsList } from "../GoodsList"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperType } from "swiper"
import { Navigation, Keyboard, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { fetchPopularGoods } from "@/lib/api/mainPageApi"

type PopularGoodsProps = {
	initialData: {
		items: Good[]
		page: number
		totalPages: number
	}
}
export default function PopularGoods({ initialData }: PopularGoodsProps) {
	const [popularGoods, setPopularGoods] = useState<Good[]>(initialData.items)
	const [page, setPage] = useState(1)
	const [isLoadingMore, setIsLoadingMore] = useState(false)

	const totalPages = initialData.totalPages
	const hasMore = page < totalPages

	const swiperRef = useRef<SwiperType | null>(null)

	const [isBeginning, setIsBeginning] = useState(true)
	const [isEnd, setIsEnd] = useState(false)

	const isPrevDisabled = isBeginning
	const isNextDisabled = isEnd && !hasMore

	const handlePrev = () => {
		if (!swiperRef.current) return
		swiperRef.current.slidePrev()
	}

	const handleNext = async () => {
		const swiper = swiperRef.current
		if (!swiper) return

		const atEnd = swiper.isEnd
		if (atEnd && hasMore && !isLoadingMore) {
			setIsLoadingMore(true)
			try {
				const nextPage = page + 1
				const data = await fetchPopularGoods({ page: nextPage, limit: 3 })
				setPopularGoods((prev) => [...prev, ...data.items])
				setPage(nextPage)
			} catch (error) {
				console.error(error)
			} finally {
				setIsLoadingMore(false)
			}
		}
		swiper.slideNext()
	}

	return (
		<section id="popular-goods" className={css.popularGoods}>
			<div className={css.container}>
				<div className={css.nav}>
					<h2 className={css.title}>Популярні товари</h2>
					<Link className={css.allGoodsBtn} href="/goods">
						Всі товари
					</Link>
				</div>
				<div className={css.sliderWrapper}>
					<Swiper
						modules={[Navigation, Keyboard, Pagination]}
						onBeforeInit={(swiper) => {
							swiperRef.current = swiper
						}}
						onSlideChange={(swiper) => {
							setIsBeginning(swiper.isBeginning)
							setIsEnd(swiper.isEnd)
						}}
						keyboard={{ enabled: true }}
						spaceBetween={32}
						slidesPerView={1}
						breakpoints={{
							768: { slidesPerView: 2 },
							1440: { slidesPerView: 4 },
						}}
						pagination={{
							clickable: true,
							el: ".popularPagination",
						}}
						className={css.swiper}
					>
						{popularGoods.map((good) => (
							<SwiperSlide key={good._id}>
								<GoodsList items={[good]} />
							</SwiperSlide>
						))}
					</Swiper>
					<div className={css.controls}>
						<div className={`popularPagination ${css.pagination}`}></div>
						<button
							type="button"
							className={`${css.navBtn} ${css.navPrev} ${isPrevDisabled ? css.navBtnDisabled : ""}`}
							onClick={handlePrev}
							disabled={isPrevDisabled}
							aria-label="Попередні товари"
						>
							<svg className={css.icon} width={24} height={24}>
								<use href="/sprite.svg/#arrow_back"></use>
							</svg>
						</button>
						<button
							type="button"
							className={`${css.navBtn} ${css.navNext} ${isNextDisabled ? css.navBtnDisabled : ""}`}
							onClick={handleNext}
							disabled={isNextDisabled || isLoadingMore}
							aria-label="Наступні товари"
						>
							<svg className={css.icon} width={24} height={24}>
								<use href="/sprite.svg/#arrow_forward"></use>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
