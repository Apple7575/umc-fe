import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Lp } from "../../types/lp.ts";
import { useAuth } from "../../context/AuthContext";
import useGetMyInfo from "../../hooks/queries/useGetMyInfo";

interface LpCardProps {
  lp: Lp;
}

function formatDate(dateValue: any) {
  const d = new Date(String(dateValue));
  return d.toLocaleDateString();
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { data: me } = useGetMyInfo(accessToken);

  // 현재 로그인한 사용자가 이 LP를 좋아요 했는지 확인
  const isLiked = lp.likes
    .map((like: Likes) => like.userId)
    .includes(me?.data.id as number);

  const handleClick = () => {
    if (!accessToken) {
      if (window.confirm("로그인이 필요한 서비스입니다. 로그인하시겠습니까?")) {
        navigate('/login');
      }
      return;
    }
    navigate(`/lps/${lp.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer transform transition-transform hover:scale-105 group"
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="object-cover w-full h-48"
      />
      <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center hover:bg-black/60 transition-all duration-200">
        <h3 className="text-white text-lg font-bold mb-2 text-center px-2 break-words opacity-0 group-hover:opacity-100 transition-opacity duration-200">{lp.title}</h3>
        <div className="text-gray-200 text-sm mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">{formatDate(lp.createdAt)}</div>
        <div className="text-pink-400 text-base opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
          <Heart 
            className="w-4 h-4"
            color={isLiked ? "#ec4899" : "#ec4899"}
            fill={isLiked ? "#ec4899" : "transparent"}
          /> 
          <span>{isLiked ? 1 : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default LpCard;