import { useInfiniteQuery } from "@tanstack/react-query";

export const usePosts = () => {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = null }) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/posts?limit=4&cursor=${pageParam || ""}`
      );
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
};