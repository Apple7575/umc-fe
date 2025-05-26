import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList.ts";
import { PAGINATION_ORDER } from "../enums/common.ts";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/Lpcard/LpCard.tsx";
import LpCardSkeletonList from "../components/Lpcard/LpCardSkeletonList.tsx";
import useDebounce from "../hooks/useDebounce.ts";
import { useCreateLp } from "../hooks/mutations/useCreateLp.ts";
import React from "react";
import PageLayout from "../components/PageLayout.tsx";

const HomePage = () => {
  // State management for search functionality
  const [search, setSearch] = useState("");

  // Debounce search input to prevent excessive API calls
  // Waits 900ms after the last keystroke before triggering the search
  const debouncedValue = useDebounce(search, 900);

  // State for sorting order (ascending/descending)
  const [order, setOrder] = useState(PAGINATION_ORDER.asc);

  // State for modal visibility
  const [modalOpen, setModalOpen] = useState(false);

  // States for LP creation form
  const [lpName, setLpName] = useState("");
  const [lpContent, setLpContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [lpImage, setLpImage] = useState<File | null>(null);
  const [lpImagePreview, setLpImagePreview] = useState<string>("/images/lp.thumbnail.jpeg");

  // Custom hook for fetching LP list with infinite scroll
  // Parameters: page size, debounced search value, and sort order
  const {
    data: lps, // InfiniteData<ResponseLpListDto>
    isFetching, // boolean - indicates if data is currently being fetched
    hasNextPage, // boolean - indicates if there are more pages to load
    isPending, // boolean - indicates if initial data is being loaded
    fetchNextPage, // function - loads the next page of data
    isError, // boolean - indicates if an error occurred
  } = useGetInfiniteLpList(10, debouncedValue, order);

  // Intersection Observer hook for infinite scroll
  // Triggers when the observed element comes into view
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Mutation hook for creating new LP
  const lpMutation = useCreateLp();

  // 태그 추가
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  // 태그 삭제
  const handleRemoveTag = (removeTag: string) => {
    setTags(tags.filter(tag => tag !== removeTag));
  };

  // 엔터로 태그 추가
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddTag();
  };

  // LP 등록
  const handleAddLp = () => {
    lpMutation.mutate({
      title: lpName,
      content: lpContent,
      tags,
      published: true,
      thumbnail: lpImage || "기본 이미지 url"
    });
    // 초기화
    setLpName("");
    setLpContent("");
    setTags([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLpImage(file);
      setLpImagePreview(URL.createObjectURL(file));
    }
  };

  // Effect hook for infinite scroll
  // Fetches next page when the bottom element comes into view
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
    <>
      {/* +버튼(FAB) */}
      <button
        className="fixed bottom-20 right-8 z-50 bg-blue-400 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl hover:bg-blue-500 transition-colors"
        onClick={() => setModalOpen(true)}
      >
        +
      </button>
      {/* LP 작성 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 오버레이 */}
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setModalOpen(false)}
          />
          {/* 모달 내용 */}
          <div className="relative bg-white rounded-2xl p-8 w-full max-w-md mx-auto flex flex-col items-center z-10 shadow-xl">
            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 text-blue-300 text-2xl hover:text-blue-500"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            {/* LP 이미지 (클릭 시 파일 선택) */}
            <label className="cursor-pointer">
              <img
                src={lpImagePreview}
                alt="LP"
                className="w-32 h-32 mb-6 rounded-full object-cover border-2 border-blue-200 bg-blue-50"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {/* 입력 폼 */}
            <input className="w-full mb-3 p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 placeholder-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all" placeholder="LP Name" value={lpName} onChange={e => setLpName(e.target.value)} />
            <input className="w-full mb-3 p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 placeholder-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all" placeholder="LP Content" value={lpContent} onChange={e => setLpContent(e.target.value)} />
            <div className="flex w-full mb-3">
              <input
                className="flex-1 p-2 rounded-l-xl bg-blue-50 border border-blue-200 text-blue-800 placeholder-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                placeholder="LP Tag"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <button
                className="ml-2 px-4 rounded-r-xl bg-blue-200 text-blue-800 font-semibold hover:bg-blue-300 transition-colors"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    className="ml-2 text-blue-300 hover:text-blue-500"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label={`${tag} 태그 삭제`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <button className="w-full mt-2 p-2 rounded-xl bg-blue-400 text-white font-bold cursor-pointer hover:bg-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleAddLp} disabled={lpMutation.isPending}>
              {lpMutation.isPending ? "등록 중..." : "Add LP"}
            </button>
          </div>
        </div>
      )}
      {/* 기존 메인 컨텐츠 */}
      <PageLayout>
        <main className="flex-1 container mx-auto px-4 py-6">
          {/* 정렬 버튼 */}
          <div className="flex gap-2 mb-4">
            <button
              className={`cursor-pointer px-4 py-2 rounded-xl border border-blue-200 bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-colors ${order === PAGINATION_ORDER.asc ? 'ring-2 ring-blue-300' : ''}`}
              onClick={() => setOrder(PAGINATION_ORDER.asc)}
            >
              오래된순
            </button>
            <button
              className={`cursor-pointer px-4 py-2 rounded-xl border border-blue-200 bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-colors ${order === PAGINATION_ORDER.desc ? 'ring-2 ring-blue-300' : ''}`}
              onClick={() => setOrder(PAGINATION_ORDER.desc)}
            >
              최신순
            </button>
          </div>
          {/* Search input component */}
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 mb-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 placeholder-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
            placeholder="검색어를 입력하세요"
          />
          {/* Grid layout for displaying LP cards */}
          {/* Responsive grid that adjusts columns based on screen size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Map through all pages of LP data */}
            {lps?.pages
              ?.map((page) => page.data.data)
              ?.flat()
              ?.map((lp) => (
                <LpCard key={lp.id} lp={lp} />
              ))}
            {/* Show skeleton loading state while fetching */}
            {isFetching && <LpCardSkeletonList count={20} />}
          </div>
          {/* Intersection observer target for infinite scroll */}
          <div ref={ref} className="h-2"></div>
        </main>
      </PageLayout>
    </>
  );
};

export default HomePage;
