import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp.ts";
import { queryClient } from "../../App.tsx";
import { QUERY_KEY } from "../../constants/key.ts";

// This custom hook allows you to "like" an item (such as a post or product) by calling the postLike API.
// It uses React Query's useMutation to handle the API request and manage the UI state.
function usePostLike() {
  return useMutation({
    // mutationFn is the function that will be called to perform the mutation (the API call).
    mutationFn: postLike,
    // onSuccess runs when the API call is successful.
    // data: the response from the API
    // variables: the arguments you passed to mutate/mutateAsync
    // context: the value returned from onMutate (if used)
    onSuccess: (data) => {
      // This will refresh (invalidate) the query for the liked item,
      // so the UI shows the updated like count or status.
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,

        
      });
    },
    // onError runs if the API call fails.
    // error: the error object
    // variables: the arguments you passed to mutate/mutateAsync
    // context: the value returned from onMutate (if used)
    // onMutate runs just before the mutation function is called.
  }
  );
}

// Export the custom hook so you can use it in your components.
export default usePostLike;