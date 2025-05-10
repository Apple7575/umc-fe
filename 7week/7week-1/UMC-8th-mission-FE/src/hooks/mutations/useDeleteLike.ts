import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp.ts";
import { queryClient } from "../../App.tsx";
import { QUERY_KEY } from "../../constants/key.ts";
import { Likes, ResponseLpDto } from "../../types/lp.ts";
import { ResponseMyInfoDto } from "../../types/auth.ts";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    // onMutate -> API 요청 이전에 호출되는 함수.
    // UI에 바로 변경을 보여주기 위해 Cache 업데이트
    onMutate: async (lp) => {
      // 1. 이 캐시에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청)
      await queryClient.cancelQueries({
          queryKey: [QUERY_KEY.lps, lp.lpId],
      });

      // 2. 현재 게시글의 데이터를 캐시에서 가져와야.
      const previousLpPost: ResponseLpDto | undefined = queryClient.getQueryData<ResponseLpDto>([
        QUERY_KEY.lps,
        lp.lpId,
      ]);

      // 게시글 데이터를 복사해서 NewLpPost라는 새로운 객체를 만들지 않.
      // 복사하는 깊은 이유는 나중에 오류가 발생했을 때 이전 상태로 되돌리기 위해서다 라고 생각하면 됩니다.
      const newLpPost: { status?: boolean | undefined } = { ...previousLpPost };

      // 게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치를 찾아야합니다.
      const me = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);
      const userId: number = Number(me?.data.id);
      
      const likedIndex: number = 
        previousLpPost?.data.likes.findIndex(
          (like) => like.userId === userId,
        ) ?? -1;
      
      if (likedIndex >= 0) {
        previousLpPost?.data.likes.splice(likedIndex, 1);
      } else {
        const newLike = {userId, lpId:lp.lpId } as Likes;
        previousLpPost?.data.likes.push(newLike);
      }
      
      // 업데이트된 게시글 데이터를 캐시에 저장
      // 이렇게하면 UI가 바로 업데이트 됨, 사용자가 변화를 확인할 수 있다.
      queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);
      
      return { previousLpPost, newLpPost };
    },
    onError: (err, newLp, context) => {
      console.log(err, newLp);
      queryClient.setQueryData(
        [QUERY_KEY.lps, newLp.lpId],
        context?.previousLpPost?.data.id,
      );
    },
    
    // onSettled는 API 요청이 끝나후 (성공하든 실패하든 실행)
    onSettled: async (data, error, variables,context) => {
      await queryClient.invalidateQueries({
        queryKey:[QUERY_KEY.lps, variables.lpId],
      });
    },

  });
}

export default useDeleteLike