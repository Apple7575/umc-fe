import { Heart } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetMyInfo from "../hooks/queries/useGetMyInfo.ts";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import { Likes } from "../types/lp";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useGetComments } from "../hooks/queries/useGetComments";
import { getMinutesAgo } from "../apis/lp";
import CommentList from "../components/CommentList";
import React, { useState } from "react";
import PageLayout from "../components/PageLayout";


const LpDetailPage = () => {
    const { lpId } = useParams();
    console.log("lpId:", lpId);
    const { accessToken } = useAuth();
    const {
      data: lp,
      isPending,
      isError
    } = useGetLpDetail({ lpId: Number(lpId) });
  
    const { data: me } = useGetMyInfo(accessToken);
  
    const isLiked: boolean | undefined = lp?.data.likes
      .map((like: Likes) => like.userId)
      .includes(me?.data.id as number);
  
    const { mutateAsync: postLike } = usePostLike();
    const { mutateAsync: deleteLike } = useDeleteLike();
  
    const handleLikeLp = async () => {
      await postLike({ lpId: Number(lpId) });
    };
  
    const handleDislikeLp = async () => {
      await deleteLike({ lpId: Number(lpId) });
    };
  
    const [order, setOrder] = useState<"asc" | "desc">("desc");
  
    const {
      data: comments,
      isPending: isCommentsPending
    } = useGetComments(Number(lpId));
    console.log("comments:", comments);
  
    if (isPending && isError) {
      return <></>;
    }

    return (
        <PageLayout>
            <div className="min-h-screen flex justify-center items-center bg-gray-900">
              <div className="bg-[#232428] rounded-2xl shadow-2xl px-10 py-8 max-w-2xl w-full relative">
                {/* 상단: 유저, 제목, 작성일, 아이콘 */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-base text-white font-semibold">{me?.data.name}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-gray-400 text-xs">
                      {lp?.data.createdAt ? getMinutesAgo(lp.data.createdAt) : "오늘"}
                    </span>
                    <div className="flex gap-2">
                      <MdEdit className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" /> 
                      <FaRegTrashAlt className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* 제목 */}
                <h2 className="text-2xl font-semibold text-white mb-4">{lp?.data.title}</h2>
                {/* CD 이미지 */}
                <div className="flex justify-center mb-6 relative">
                  <img
                    src={lp?.data.thumbnail}
                    alt={lp?.data.title}
                    className="animate-[spin_10s_linear_infinite] w-80 h-80 rounded-full shadow-2xl object-cover border-[6px] border-gray-700"
                    style={{
                      boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                      background: "#222",
                    }}
                  />
                  {/* CD 중앙 구멍 */}
                  <div
                    className="absolute top-1/2 left-1/2 w-14 h-14 bg-gray-800 rounded-full border-4 border-gray-700"
                    style={{ transform: "translate(-50%, -50%)" }}
                  />
                </div>

                {/* 설명 */}
                <p className="text-gray-200 text-center mb-6 italic">
                  {lp?.data.content}
                </p>

                {/* 태그 */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {lp?.data.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>

                {/* 좋아요 */}
                <div className="flex justify-center items-center gap-1">
                  <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
                    <Heart 
                      className="cursor-pointer w-6 h-6"
                      color={isLiked ? "#ec4899" : "#9ca3af"}
                      fill={isLiked ? "#ec4899" : "transparent"}
                    />
                  </button>
                  <span className="text-white">{lp?.data.likes.length}</span>
                </div>

                {/* 댓글 목록 */}
                <div className="mt-8 border-t border-gray-700 pt-6">
                  <h3 className="text-lg text-white mb-4">댓글</h3>
                  <CommentList
                    comments={comments}
                    isLoading={isCommentsPending}
                    onOrderChange={setOrder}
                    order={order}
                  />
                </div>
              </div>
            </div>
        </PageLayout>
    );
};

export default LpDetailPage;