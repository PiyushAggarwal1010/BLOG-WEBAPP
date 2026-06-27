import { useInfiniteQuery } from "@tanstack/react-query";

export const useUsers = () => {
    return useInfiniteQuery({
        queryKey: ["users"],
        queryFn: async ({ pageParam = null }) => {

            const params = new URLSearchParams({ limit: 4 });

            if (pageParam) params.append("cursor", pageParam);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users?${params.toString()}`, {
                credentials: "include"
            });
            return res.json();
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    });
};