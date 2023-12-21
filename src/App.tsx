import React from "react";

import Profile from "./assets/Profile.jpg";
import FreeAI from "./assets/FreeAI.png";
import UniqueBots from "./assets/UniqueBots.png";
import UniqueCode from "./assets/UniqueCode.png";
import NeulBom from "./assets/NeulBom.png";

const App: React.FC = () => {
  return (
    <div className="w-1/2 mx-auto">
      <div className="py-16 w-full flex items-center gap-24 border-b-2 border-[#CFCFCF]">
        <img
          src={Profile}
          alt=""
          className="object-cover w-[200px] h-[200px] mx-auto rounded-full"
        />
        <div className="grid gap-y-8 w-fit mx-auto">
          <div className="flex items-center gap-2.5">
            <h1 className="font-normal text-[32px]">zerone.ed</h1>
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="#000"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21C11.6989 20.9996 11.4049 20.9086 11.1562 20.7389C7.47232 18.2381 5.87716 16.5234 4.99731 15.4514C3.12231 13.1663 2.22466 10.8202 2.24997 8.27953C2.2795 5.36813 4.61528 3 7.45685 3C9.5231 3 10.9542 4.16391 11.7876 5.13328C11.814 5.16368 11.8466 5.18805 11.8833 5.20476C11.9199 5.22146 11.9597 5.23011 12 5.23011C12.0402 5.23011 12.08 5.22146 12.1167 5.20476C12.1533 5.18805 12.1859 5.16368 12.2123 5.13328C13.0458 4.16297 14.4768 3 16.5431 3C19.3847 3 21.7204 5.36812 21.75 8.28C21.7753 10.8211 20.8767 13.1672 19.0026 15.4519C18.1228 16.5239 16.5276 18.2386 12.8437 20.7394C12.595 20.9089 12.301 20.9998 12 21Z"
                fill="black"
              />
            </svg>
            <a href="https://github.com/ZeroOneDeveloper">
              <div className="bg-[#D9D9D9] rounded-lg font-semibold text-xl px-8 py-2">
                Follow
              </div>
            </a>
          </div>
          <div className="flex gap-10">
            <h1 className="text-xl font-medium">
              <span className="font-bold">06</span> posts
            </h1>
            <h1 className="text-xl font-medium">
              <span className="font-bold">12.16K</span> followers
            </h1>
            <h1 className="text-xl font-medium">
              <span className="font-bold">9.02K</span> following
            </h1>
          </div>
          <div className="text-xl font-medium">
            <p>
              <a
                href="https://instagram.com/UniqueCode.biz/"
                className="text-[#00376B]"
              >
                @UniqueCode.biz
              </a>{" "}
              CEO
            </p>
            <p>
              <a
                href="https://www.kyungheeboy.hs.kr/"
                className="text-[#00376B]"
              >
                @KyungheeHighSchool
              </a>{" "}
              63’
            </p>
            <p>
              <a
                href="https://github.com/ZeroOneDeveloper/"
                className="text-[#00376B]"
              >
                @ZeroOneDeveloper
              </a>{" "}
            </p>
            <p>세상을 바꾸는 데 0과 1만으로도 충분하다.</p>
          </div>
        </div>
      </div>
      <div className="mt-[50px] grid grid-cols-3 gap-5">
        <img src={FreeAI} alt="FreeAI" width={320} height={320} />
        <img src={UniqueBots} alt="UniqueBots" width={320} height={320} />
        <img src={UniqueCode} alt="UniqueCode" width={320} height={320} />
        <img src={NeulBom} alt="NeulBom" width={320} height={320} />
      </div>
    </div>
  );
};

export default App;
