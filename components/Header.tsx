import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <nav className="w-full flex justify-around py-9 border-b border-[#E1E1E1]">
      <Link
        className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-br from-teal-500 via-gray-600 to-blue-800"
        href="/"
      >
        ZERONE
      </Link>
      <div className="lg:block hidden" />
    </nav>
  );
};

export default Header;
