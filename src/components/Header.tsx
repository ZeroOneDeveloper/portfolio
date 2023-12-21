import React from "react";

const Header: React.FC = () => {
  return (
    <nav className="w-full flex justify-around py-9 border-b border-[#E1E1E1]">
      <a
        className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-br from-teal-500 via-gray-600 to-blue-800"
        href="/public"
      >
        ZERONE
      </a>
      <div className="lg:block hidden" />
    </nav>
  );
};

export default Header;
