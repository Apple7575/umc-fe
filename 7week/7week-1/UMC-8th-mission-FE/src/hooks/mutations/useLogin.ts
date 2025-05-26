// src/hooks/mutations/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../apis/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
  });
};