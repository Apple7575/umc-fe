import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useLogoutMutation } from "../hooks/mutations/useLogout";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

interface NavBarProps {
  setSidebarOpen: (open: boolean) => void;
}

const NavBar = ({ setSidebarOpen }: NavBarProps) => {
  const { accessToken } = useAuth();
  const { data: myInfo } = useGetMyInfo(accessToken);
  // const { logout } = useAuth(); // 기존 코드 주석처리

  // useMutation for logout
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-blue-100/80 shadow-md fixed w-full z-10 backdrop-blur-md">
      <div className="flex items-center justify-between p-7">
        <div className="flex items-center gap-4">
          {/* Hamburger menu for sidebar */}
          <button
            className="p-2 rounded bg-blue-50 hover:bg-blue-200 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="사이드바 열기"
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="9" x2="23" y2="9" />
              <line x1="5" y1="15" x2="23" y2="15" />
              <line x1="5" y1="21" x2="23" y2="21" />
            </svg>
          </button>
          <Link
            to="/"
            className="text-xl font-bold text-blue-700"
          >
            SpinningSpinning Dolimpan
          </Link>
        </div>
        <div className="space-x-6 flex items-center">
          {!accessToken && (
            <>
              <Link
                to="/login"
                className="text-blue-700 hover:text-blue-500"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="text-blue-700 hover:text-blue-500"
              >
                회원가입
              </Link>
            </>
          )}
          {accessToken && (
            <>
              <span className="text-blue-700">
                {myInfo?.data?.name}님 반갑습니다
              </span>
              <Link
                to="/my"
                className="text-blue-700 hover:text-blue-500"
              >
                마이 페이지
              </Link>
              <button className='cursor-pointer mt-3 bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors' onClick={handleLogout}>
            로그아웃
            </button>
            </>
          )}
          <Link
            to="/search"
            className="text-blue-700 hover:text-blue-500"
          >
            검색
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;