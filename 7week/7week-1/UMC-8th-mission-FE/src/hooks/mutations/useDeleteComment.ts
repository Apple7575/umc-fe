// src/hooks/mutations/useDeleteComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../apis/lp";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lpId, commentId }: { lpId: number; commentId: number }) =>
      deleteComment(lpId, commentId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.lpId] });
    },
    onError: () => {
      alert("댓글 삭제에 실패했습니다.");
    }
  });
};