import { PaginationDTO } from "../types/common";
import { axiosInstance } from "../apis/axios";
import { RequestLpDto, ResponseLikeLpDto, ResponseLpDto, ResponseLpListDto } from "../types/lp";

export const getLpList = async (
    pagination: PaginationDTO,
): Promise<ResponseLpListDto> => {
  console.log("getLpList 호출됨, pagination:", pagination);
    const {data} = await axiosInstance.get('/v1/lps', {
        params: pagination
    });

    return data;   
}

export const getLpDetail = async ({
    lpId,
  }: RequestLpDto): Promise<ResponseLpDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
    
    return data;
  };
  

  // 좋아요 추가
  export const postLike = async ({
    lpId,
  }: RequestLpDto): Promise<ResponseLikeLpDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
    
    return data;
  };

  // 좋아요 삭제
  export const deleteLike = async ({
    lpId,
  }: RequestLpDto): Promise<ResponseLikeLpDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
    
    return data;
  };

export const postLp = async (lpData: any) => {
  const { data } = await axiosInstance.post('/v1/lps', lpData);
  return data;
};

export const getComments = async (lpId: number, order: "asc" | "desc" = "desc", cursor = 0) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { order, cursor }
  });
  return data;
};

export const getMinutesAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) {
    return '방금 전';
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
};


// 댓글 작성
export const postComment = async ({
  lpId,
  content,
}: {
  lpId: number;
  content: string;
}) => {
  const { data } = await axiosInstance.post(
    `/v1/lps/${lpId}/comments`,
    { content }
  );
  return data;
};

export const deleteComment = async (lpId: number, commentId: number) => {
  return axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};

export const editComment = async (lpId: number, commentId: number, content: string) => {
  return axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
};


export const updateProfile = async (profileData: any) => {
  return axiosInstance.patch('/v1/users', profileData);
};