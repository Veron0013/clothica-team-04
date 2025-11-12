"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/api";
import { CategoriesList } from "@/components/CategoriesList/CategoriesList";

export default function CategoriesPageClient() {
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategories(page, limit),
    keepPreviousData: true,
  });

  const categories = data?.categories ?? [];
  const total = data?.total ?? 0;
  const hasMore = categories.length < total;

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section style={{ padding: "20px" }}>
      <h1>Категорії</h1>

      {isLoading && <p>Завантаження...</p>}
      {!isLoading && <CategoriesList categories={categories} />}

      {hasMore && (
        <button onClick={handleLoadMore} disabled={isFetching}>
          {isFetching ? "Завантаження..." : "Показати більше"}
        </button>
      )}
    </section>
  );
}
/////////////////////////////////////////////
// "use client";

// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getCategories } from "@/lib/api/api";
// import { CategoriesList } from "@/components/CategoriesList/CategoriesList";
// import { Category } from "@/types/categories";

// export default function CategoriesPageClient() {
//   const [page, setPage] = useState(1);
//   const [allCategories, setAllCategories] = useState<Category[]>([]);
//   const limit = 6;

//   const { data, isLoading, isFetching } = useQuery({
//     queryKey: ["categories", page],
//     queryFn: () => getCategories(page, limit),
//     keepPreviousData: true,
//   });

//   const categories = data?.data.categories ?? [];
//   const total = data?.total ?? 0;

//   useEffect(() => {
//     if (categories.length > 0) {
//       setAllCategories((prev) => [...prev, ...categories]);
//     }
//   }, [categories]);

//   const hasMore = allCategories.length < total;

//   const handleLoadMore = () => {
//     if (hasMore) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   return (
//     <section style={{ padding: "20px" }}>
//       <h1>Категорії</h1>

//       {isLoading && <p>Завантаження...</p>}
//       {!isLoading && <CategoriesList categories={allCategories} />}

//       {hasMore && (
//         <button onClick={handleLoadMore} disabled={isFetching}>
//           {isFetching ? "Завантаження..." : "Показати більше"}
//         </button>
//       )}
//     </section>
//   );
// }
