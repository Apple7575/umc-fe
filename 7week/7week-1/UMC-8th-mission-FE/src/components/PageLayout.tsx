import React from "react";

const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-purple-100">
    <div className="w-full max-w-7xl mx-auto mt-12 p-8 rounded-3xl shadow-2xl bg-white/90 backdrop-blur-md border border-gray-200 flex flex-col items-center">
      {children}
    </div>
  </div>
);

export default PageLayout;
