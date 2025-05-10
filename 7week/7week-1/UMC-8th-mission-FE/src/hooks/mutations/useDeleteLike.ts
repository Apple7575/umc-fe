import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp.ts";
import { queryClient } from "../../App.tsx";
import { QUERY_KEY } from "../../constants/key.ts";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    onSuccess: (data) => {
      // This will refresh (invalidate) the query for the liked item,
      // so the UI shows the updated like count or status.
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,

        
      });
    }
  });
}

export default useDeleteLike;