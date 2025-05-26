import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../../apis/auth";
import { LOCAL_STORAGE_KEY } from "../../constants/key";
import { useLocalStorage } from "../useLocalStorage";
import { useNavigate } from "react-router-dom";

export const useLogoutMutation = () => {
  const { removeItem: removeAccessTokenFromStorage } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const { removeItem: removeRefreshTokenFromStorage } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      alert("로그아웃 성공");
      navigate("/");
    },
    onError: (error) => {
      console.error("로그아웃 오류", error);
      alert("로그아웃 실패");
    },
  });
};