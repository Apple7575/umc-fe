import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    setModalOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <>
      {/* 사이드바 */}
      <div
        className={`fixed top-27 left-0 h-[calc(100%-6.25rem)] w-64 bg-blue-50/90 text-blue-800 z-40 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            <div className="text-2xl font-bold mb-8 text-blue-400">DOLIGO</div>
            <nav className="space-y-4">
              <div className="flex items-center gap-2 text-blue-700 hover:text-blue-500 cursor-pointer"> 찾기</div>
              <div className="flex items-center gap-2 text-blue-700 hover:text-blue-500 cursor-pointer"> 마이페이지</div>
            </nav>
          </div>
          <button className="text-blue-400 text-sm cursor-pointer hover:text-blue-600" onClick={() => setModalOpen(true)}>탈퇴하기</button>
        </div>
      </div>
      {/* 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={onClose}
        />
      )}
      {/* 탈퇴 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-xl p-8 w-full max-w-md mx-auto flex flex-col items-center z-10">
            <button className="absolute top-4 right-4 text-blue-400 text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <div className="mb-8 text-lg text-blue-800">정말 탈퇴하시겠습니까?</div>
            <div className="flex gap-4">
              <button className="px-6 py-2 rounded bg-blue-100 text-blue-800" onClick={handleConfirm}>예</button>
              <button className="px-6 py-2 rounded bg-blue-400 text-white" onClick={() => setModalOpen(false)}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar; 