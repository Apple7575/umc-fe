// src/hooks/queries/useInfiniteComments.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/lp";

export const useInfiniteComments = (lpId: number, order: "asc" | "desc" = "desc") => {
  return useInfiniteQuery({
    queryKey: ["comments", lpId, order],
    queryFn: ({ pageParam = 0 }) => getComments(lpId, order, pageParam),
    getNextPageParam: (lastPage) => {
      // lastPage 구조에 따라 수정 (예: lastPage.data.hasNext, lastPage.data.nextCursor 등)
      if (lastPage.data.hasNext) return lastPage.data.nextCursor;
      return undefined;
    },
    initialPageParam: 0,
  });
};