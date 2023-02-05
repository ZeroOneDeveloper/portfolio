import React from "react";

import { AiOutlineInstagram } from "react-icons/ai";
import { FiMail } from "react-icons/fi";
import FadeIn from "react-fade-in";

const Index = () => {
  return (
    <div className="min-h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-orange-900 via-amber-100 to-orange-900">
      <div className="flex justify-center items-center min-h-screen">
        <div className="grid gap-8 text-center">
          <div className="text-center grid gap-8 align-middle">
            <FadeIn transitionDuration={1000}>
              <h1 className="md:text-5xl text-3xl font-thin">
                CODENAME : ZERONE
              </h1>
            </FadeIn>
            <FadeIn delay={1000} transitionDuration={1000}>
              <h1 className="blacksword text-6xl md:w-fit w-4/5 mx-auto">
                Give Up? Just Try Hard.
              </h1>
            </FadeIn>
          </div>
          <div className="flex justify-center items-center gap-4">
            <FadeIn delay={2000} transitionDuration={500}>
              <a
                href="https://instagram.com/zerone.ed"
                target="_blank"
                rel="noreferrer"
              >
                <AiOutlineInstagram size={36} />
              </a>
            </FadeIn>
            <FadeIn delay={2500} transitionDuration={500}>
              <a href="mailto:me@zero0ne.dev" target="_blank" rel="noreferrer">
                <FiMail size={32} />
              </a>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
