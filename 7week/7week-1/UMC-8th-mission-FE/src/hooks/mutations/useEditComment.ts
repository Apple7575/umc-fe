// src/hooks/mutations/useEditComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editComment } from "../../apis/lp";

export const useEditComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lpId, commentId, content }: { lpId: number; commentId: number; content: string }) =>
      editComment(lpId, commentId, content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.lpId] });
    },
    onError: () => {
      alert("댓글 수정에 실패했습니다.");
    }
  });
};