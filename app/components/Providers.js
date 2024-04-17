"use client";
import TranslationWrapper from "../../utils/ThemeRegistry";
import React from "react";
function Providers({ children }) {
  return <TranslationWrapper>{children}</TranslationWrapper>;
}

export default Providers;
