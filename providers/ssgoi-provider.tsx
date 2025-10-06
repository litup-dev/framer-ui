"use client";

import { Ssgoi } from "@ssgoi/react";
import { pinterest, film, hero } from "@ssgoi/react/view-transitions";
import { PropsWithChildren } from "react";

const ssgoiConfig = {
  transitions: [
    {
      from: "/home",
      to: "/home/detail/*",
      transition: hero({
        spring: {
          stiffness: 300,
          damping: 30,
        },
        timeout: 300,
      }),
      symmetric: true,
    },
  ],
};

const SsgoiProvider = ({ children }: PropsWithChildren) => {
  return (
    <Ssgoi config={ssgoiConfig}>
      <div style={{ position: "relative", minHeight: "100vh" }}>{children}</div>
    </Ssgoi>
  );
};

export default SsgoiProvider;
