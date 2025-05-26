// src/apis/user.ts
import { axiosInstance } from "./axios";

export const updateProfile = async ({
  name,
  bio,
}: {
  name: string;
  bio?: string;
}) => {
  return axiosInstance.patch("/v1/users", { name, bio });
};