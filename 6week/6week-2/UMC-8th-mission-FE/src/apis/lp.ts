import { PaginationDTO } from "../types/common";
import { axiosInstance } from "../apis/axios";
import { ResponseLpListDto } from "../types/lp";

export const getLpList = async (
    pagination: PaginationDTO,
): Promise<ResponseLpListDto> => {
    const {data} = await axiosInstance.get('/v1/lps', {
        params: pagination
    });
    console.log(pagination)
    return data;
}

