import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";

export const usePosts = (searchQuery) => {
  return useInfiniteQuery({
    queryKey: ["posts", searchQuery],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams();

      params.append("limit", 4);
      if (pageParam) params.append("cursor", pageParam);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/posts?${params.toString()}`
      );

      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,

    placeholderData: keepPreviousData,
  });
};