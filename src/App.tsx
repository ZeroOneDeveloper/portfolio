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
              <span className="font-bold">12K</span> followers
            </h1>
            <h1 className="text-xl font-medium">
              <span className="font-bold">16K</span> following
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
