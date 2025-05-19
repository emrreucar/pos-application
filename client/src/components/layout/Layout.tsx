import React from "react";
import Sidebar from "./Sidebar";
import Header from "../../pages/home-page/_components/Header";
import { useLocation } from "react-router-dom";

const Layout = ({
  children,
  showSidebar,
  setShowSidebar,
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <section className="flex h-screen bg-[#f6f6f6]">
      {/* sidebar */}
      <Sidebar showSidebar={showSidebar} />

      {/* main content + cart wrapper */}
      <div className="flex flex-1 h-full">
        {/* main content + (header + page) */}
        <div className="flex flex-col flex-1">
          <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <div className="flex-1 overflow-y-auto bg-[#f6f6f6] p-4">
            {children}
          </div>
        </div>

        {/* cart section only show home page */}
        {isHomePage && (
          <div className="w-[400px] bg-[#fff] p-4 h-full border-l border-gray-300 rounded-l-2xl">
            <span>cart section</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default Layout;
