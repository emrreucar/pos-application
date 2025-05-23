import React from "react";
import Sidebar from "./Sidebar";
import Header from "../../pages/home-page/_components/Header";
import { useLocation } from "react-router-dom";
import OrdersSummary from "../cart/OrdersSummary";
import Navigation from "./Navigation";

const Layout = ({
  children,
  showSidebar,
  setShowSidebar,
  showCart,
  setShowCart,
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
  showCart?: boolean;
  setShowCart?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <section className="flex h-screen w-full overflow-hidden bg-[#f6f6f6]">
      {/* sidebar */}
      <Sidebar showSidebar={showSidebar} />

      <Navigation />

      {/* main content + cart wrapper */}
      <div className="flex flex-1 h-full">
        {/* main content + (header + page) */}
        <div className="flex flex-col flex-1">
          <Header
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            showCart={showCart}
            setShowCart={setShowCart}
          />
          <div className="flex-1 overflow-y-auto bg-[#f6f6f6] p-4">
            {children}
          </div>
        </div>

        {/* cart section only show home page */}
        {isHomePage && <OrdersSummary showCart={showCart} />}
      </div>
    </section>
  );
};

export default Layout;
