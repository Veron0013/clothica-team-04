"use client"

import { useContext } from "react"
import { useRouter } from "next/navigation"
import { FiltersContext } from "../../app/(auth routes)/goods/layout"

export default function Filters() {
	const { filters } = useContext(FiltersContext)
	//const [options, setOptions] = useState({ categories: [] })
	const router = useRouter()

	console.log("f", filters)

	//useEffect(() => {
	//  fetch('/api/filters')
	//    .then((res) => res.json())
	//    .then(setOptions);
	//}, []);

	const handleFilterChange = (newFilters: Record<string, string>) => {
		const params = new URLSearchParams(newFilters).toString()
		router.push(`/goods?${params}`)
	}

	return (
		<div>
			<h3>Фільтри</h3>
			<button onClick={() => handleFilterChange({ price_from: "1", price_to: "100" })}>Ціна 1–100</button>
		</div>
	)
}
