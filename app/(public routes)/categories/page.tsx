import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getCategories } from "@/lib/api/api";
import CategoriesPageClient from "./page-client";

export default async function CategoriesPage() {
  const queryClient = new QueryClient();
  const initialPage = 1;
  const limit = 6;

  await queryClient.prefetchQuery({
    queryKey: ["categories", initialPage],
    queryFn: () => getCategories(initialPage, limit),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesPageClient />
    </HydrationBoundary>
  );
}
