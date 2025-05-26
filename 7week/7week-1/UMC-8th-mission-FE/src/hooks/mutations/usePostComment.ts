import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../apis/lp"; // 또는 comment

export const usePostComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postComment,
    // Optimistic update
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["comments", variables.lpId] });
      const previousComments = queryClient.getQueryData(["comments", variables.lpId]);
      // Optimistically update the cache
      queryClient.setQueryData(["comments", variables.lpId], (old: any) => {
        if (!old) return [variables];
        return [...old, { ...variables, id: Date.now(), isOptimistic: true }];
      });
      return { previousComments };
    },
    onError: (_err, variables, context) => {
      // Rollback to previous cache
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", variables.lpId], context.previousComments);
      }
      alert("댓글 등록에 실패했습니다.");
    },
    onSettled: (_data, _error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["comments", variables.lpId] });
    },
  });
};