import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList.ts";
import { PAGINATION_ORDER } from "../enums/common.ts";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/Lpcard/LpCard.tsx";
import LpCardSkeletonList from "../components/Lpcard/LpCardSkeletonList.tsx";
import useDebounce from "../hooks/useDebounce.ts";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 300)

  const {
    data: lps, // InfiniteData<ResponseLpListDto>
    isFetching, // boolean
    hasNextPage, // boolean
    isPending, // boolean
    fetchNextPage,
    isError, // boolean
  } = useGetInfiniteLpList(10, debouncedValue, PAGINATION_ORDER.asc);



  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);
  
  if (isPending) {
    return <div className="mt-20">Loading...</div>;
  }
  
  if (isError) {
    return <div className="mt-20">Error...</div>;
  }
  
  console.log("search:", search, "debouncedValue:", debouncedValue);

  return (
    <div className="container mx-auto px-4 py-6">
      <input 
        value={search} 
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        placeholder="검색어를 입력하세요"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
          {isFetching && <LpCardSkeletonList count={20} />}
      </div>
      <div ref={ref} className="h-2"></div>
      </div>
  );
};

export default HomePage;
