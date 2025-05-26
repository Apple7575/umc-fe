// src/hooks/queries/useGetComments.ts
import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/lp";


export const useGetComments = (lpId: number) => {
  return useQuery({
    queryKey: ["comments", lpId],
    queryFn: () => getComments(lpId),
  });
};

