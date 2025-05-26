import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useUpdateProfile } from "../hooks/mutations/useUpdateProfile";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useState, useEffect } from 'react';
import PageLayout from "../components/PageLayout";

const Mypage = () => {
    const { logout, accessToken } = useAuth();
    const navigate = useNavigate();
    const updateProfileMutation = useUpdateProfile();
    const { data: myInfo } = useGetMyInfo(accessToken);

    // 1. 로컬 상태로 관리
    const [name, setName] = useState(myInfo?.data?.name ?? "");
    const [bio, setBio] = useState(myInfo?.data?.bio ?? "");

    // 2. 쿼리 데이터가 바뀌면 로컬 상태도 동기화
    useEffect(() => {
        setName(myInfo?.data?.name ?? "");
        setBio(myInfo?.data?.bio ?? "");
    }, [myInfo]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const formatDate = (dateString?: string | Date | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // 4. 저장 버튼에서만 mutation 실행
    const handleSave = () => {
        updateProfileMutation.mutate({ name, bio });
    };

    return (
        <PageLayout>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight drop-shadow-sm">
                My Profile{myInfo?.data?.name ? ` (${myInfo.data.name})` : ''}
            </h2>
            {/* 프로필 이미지 */}
            <label className="relative group mb-8 cursor-pointer">
                <img
                    src={myInfo?.data?.avatar || "/images/google.png"}
                    alt="프로필"
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 group-hover:ring-4 group-hover:ring-pink-300 transition-all duration-300 bg-gray-200"
                />
                <div className="absolute bottom-2 right-2 bg-pink-500 text-white text-xs px-3 py-1 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                    이미지 변경
                </div>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    // onChange={handleImageChange} // 이미지 업로드는 별도 구현 필요
                />
            </label>
            {/* 이름 */}
            <div className="flex items-center mb-4 w-full">
                <input
                    className="w-full bg-white border border-gray-300 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-xl text-gray-800 px-4 py-3 text-lg placeholder-gray-400 shadow-sm transition-all duration-200 outline-none"
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
            </div>
            {/* bio */}
            <div className="mb-4 w-full">
                <input
                    className="w-full bg-white border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl text-gray-800 px-4 py-3 text-lg placeholder-gray-400 shadow-sm transition-all duration-200 outline-none"
                    placeholder="자기소개를 입력하세요"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                />
            </div>
            {/* 이메일 */}
            <div className="text-gray-600 text-base font-medium mb-2">{myInfo?.data?.email}</div>
            <div className="text-gray-500 text-sm mb-1"><strong>Created At:</strong> {formatDate(myInfo?.data?.createdAt)}</div>
            <div className="text-gray-500 text-sm mb-4"><strong>Updated At:</strong> {formatDate(myInfo?.data?.updatedAt)}</div>
            <button
                className="mt-2 w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl shadow-md hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg mb-2"
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
            >
                저장
            </button>
            <button
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-md hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 mt-1 text-lg"
                onClick={handleLogout}
            >
                로그아웃
            </button>
        </PageLayout>
    );
}

export default Mypage;
