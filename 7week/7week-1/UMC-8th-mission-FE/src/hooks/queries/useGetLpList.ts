import { useQuery } from "@tanstack/react-query";
import { PaginationDTO } from "../../types/common.ts";
import { getLpList } from "../../apis/lp.ts";
import { QUERY_KEY } from "../../constants/key.ts";
//import { ResponseLpListDto } from "../../types/lp.ts";

// const initialLpListData:ResponseLpListDto = {
//   status: true,
//   statusCode: 200,
//   message: "",
//   data: {
//     data: [],
//     nextCursor: null,
//     hasNext: false
//   }
// }

function useGetLpList({ cursor, search, order, limit }: PaginationDTO) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: () =>
      getLpList( {
          cursor,
          search,
          order,
          limit,
      }),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      //enabled: Boolean(search),
      //refetchInterval: 1000*5
      //retry: 3,
    //initialData: initialLpListData
  });
}

export default useGetLpList;