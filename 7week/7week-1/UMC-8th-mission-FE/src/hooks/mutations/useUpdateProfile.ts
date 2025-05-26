// src/hooks/mutations/useUpdateProfile.ts
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
    // onMutate -> API 요청 이전에 호출되는 함수.
    // UI에 바로 변경을 보여주기 위해 Cache 업데이트
    onMutate: async (newProfile) => {
      // 1. 이 캐시에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청)
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      // 2. 현재 내 정보 데이터를 캐시에서 가져오기
      const previousProfile = queryClient.getQueryData([QUERY_KEY.myInfo]);

      // 3. 캐시를 optimistic하게 업데이트
      queryClient.setQueryData([QUERY_KEY.myInfo], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            name: newProfile.name,
            bio: newProfile.bio,
          },
        };
      });

      // 4. 롤백을 위해 이전 데이터 반환
      return { previousProfile };
    },
    // 실패 시 롤백
    onError: (err, newProfile, context) => {
      queryClient.setQueryData([QUERY_KEY.myInfo], context?.previousProfile);
    },
    // 성공/실패 후 서버 데이터로 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
}

