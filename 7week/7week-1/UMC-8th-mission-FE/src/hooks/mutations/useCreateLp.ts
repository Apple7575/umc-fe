import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../../apis/lp";

interface CreateLpParams {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export const useCreateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateLpParams) => postLp(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
    },
    onError: () => {
      alert("LP 등록에 실패했습니다.");
    }
  });
};
