import { Heart } from "lucide-react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetMyInfo from "../hooks/queries/useGetMyInfo.ts";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import { Likes } from "../types/lp";




const LpDetailPage = () => {
    const { lpId} = useParams();
    const { accessToken} = useAuth();
    const {
      data: lp,
      isPending,
      isError
    } = useGetLpDetail({ lpId: Number(lpId) });
  
    const { data: me} = useGetMyInfo(accessToken);
  
    const isLiked: boolean | undefined = lp?.data.likes
      .map((like: Likes) => like.userId)
      .includes(me?.data.id as number);
  
    const { mutateAsync: postLike } = usePostLike();
    const { mutateAsync: deleteLike } = useDeleteLike();
  
    const handleLikeLp = async () => {
      await postLike({  lpId: Number(lpId) });
    };
  
    const handleDislikeLp = async () => {
      await deleteLike({  lpId: Number(lpId) });
    };
  
    if (isPending && isError) {
      return <></>;
    }

    return (
        <div className="mt-12">
          <h1>{lp?.data.id}</h1>
          <h1>{lp?.data.title}</h1>
          <img src={lp?.data.thumbnail} alt={lp?.data.title} />
          <p>{lp?.data.content}</p>
          
          <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
            <Heart 
              color={isLiked ? "red" : "black"}
              fill={isLiked ? "red" : "transparent"}
            />
          </button>
        </div>
      );
};

export default LpDetailPage;