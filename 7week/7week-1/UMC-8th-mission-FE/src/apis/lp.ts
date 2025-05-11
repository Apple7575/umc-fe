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
  
  export const postLike = async ({
    lpId,
  }: RequestLpDto): Promise<ResponseLikeLpDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
    
    return data;
  };
  
  export const deleteLike = async ({
    lpId,
  }: RequestLpDto): Promise<ResponseLikeLpDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
    
    return data;
  };