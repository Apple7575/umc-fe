import React, { useState, useRef, useEffect } from "react";
import { getMinutesAgo } from "../apis/lp";
import { useInfiniteComments } from "../hooks/queries/useInfiniteComments";
import { useInView } from "react-intersection-observer";
import CommentSkeleton from "./CommentSkeleton";
import { useParams } from "react-router-dom";
import { postComment } from "../apis/lp";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDeleteComment } from "../hooks/mutations/useDeleteComment";
import { useEditComment } from "../hooks/mutations/useEditComment";

interface CommentListProps {
  order: "asc" | "desc";
  onOrderChange: (order: "asc" | "desc") => void;
}

const CommentList: React.FC<CommentListProps> = ({
  order,
  onOrderChange,
}) => {
  const [input, setInput] = useState("");
  const { lpId } = useParams();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteComments(Number(lpId), order);

  const { ref, inView } = useInView();

  const { accessToken } = useAuth();
  const { data: me } = useGetMyInfo(accessToken);

  const deleteCommentMutation = useDeleteComment();
  const editCommentMutation = useEditComment();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // 무한 스크롤 트리거
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 모든 댓글 평탄화
  const comments = data?.pages.flatMap(page => page.data.data) ?? [];

  const handleSubmit = async () => {
    if (!input.trim() || !lpId) return;
    try {
      await postComment({ lpId: Number(lpId), content: input });
      setInput("");
      // 필요하다면 댓글 목록 refetch도 추가
    } catch (error) {
      console.error("댓글 등록에 실패했습니다.", error);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white mr-2"
          placeholder="댓글을 입력해주세요"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
          disabled={!input.trim()}
        >
          작성
        </button>
        <div className="ml-2 flex gap-1">
          <button
            className={`px-2 py-1 rounded ${order === "asc" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
            onClick={() => onOrderChange("asc")}
          >
            오래된순
          </button>
          <button
            className={`px-2 py-1 rounded ${order === "desc" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
            onClick={() => onOrderChange("desc")}
          >
            최신순
          </button>
        </div>
      </div>
      {isLoading ? (
        <>
          {[...Array(5)].map((_, i) => <CommentSkeleton key={i} />)}
        </>
      ) : comments.length === 0 ? (
        <div className="text-gray-400">아직 댓글이 없습니다.</div>
      ) : (
        <div>
          {comments.map((comment: any) => (
            <div key={comment.id} className="bg-gray-700 p-4 rounded-lg mb-2">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-semibold">{comment.author.name}</span>
                <span className="text-gray-400 text-sm">
                  {getMinutesAgo(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-200">{comment.content}</p>
              {/* 내가 쓴 댓글에만 수정/삭제 버튼 */}
              {me?.data.id === comment.author.id && (
                <div className="flex gap-2 justify-end mt-2">
                  {editingId === comment.id ? (
                    <>
                      <input
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="bg-gray-600 text-white rounded px-2 py-1"
                      />
                      <button
                        className="text-pink-400"
                        onClick={() => {
                          editCommentMutation.mutate({
                            lpId: Number(lpId),
                            commentId: comment.id,
                            content: editContent,
                          });
                          setEditingId(null);
                        }}
                      >
                        저장
                      </button>
                      <button
                        className="text-gray-400"
                        onClick={() => setEditingId(null)}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-gray-400 hover:text-pink-400"
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-pink-400"
                        onClick={() => {
                          if (window.confirm("댓글을 삭제하시겠습니까?")) {
                            deleteCommentMutation.mutate({
                              lpId: Number(lpId),
                              commentId: comment.id,
                            });
                          }
                        }}
                      >
                        <FaRegTrashAlt className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          {/* 무한 스크롤 트리거 */}
          <div ref={ref} />
          {isFetchingNextPage &&
            [...Array(3)].map((_, i) => <CommentSkeleton key={i} />)}
        </div>
      )}
    </div>
  );
};

export default CommentList;