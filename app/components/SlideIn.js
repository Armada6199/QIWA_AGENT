"use client";
import React from "react";
import { useSpring, animated } from "react-spring";

const SlideIn = ({ children }) => {
  const props = useSpring({
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0%)" },
    config: { duration: 500 }, // Adjust the duration as needed
  });

  return <animated.div style={props}>{children}</animated.div>;
};

export default SlideIn;
