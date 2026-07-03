"use client";

import { createContext, useContext, useState } from "react";

type IntroContextType = {
  isIntroDone: boolean;
  setIsIntroDone: (val: boolean) => void;
};

const IntroContext = createContext<IntroContextType>({
  isIntroDone: false,
  setIsIntroDone: () => {},
});

export const IntroProvider = ({ children }: { children: React.ReactNode }) => {
  const [isIntroDone, setIsIntroDone] = useState(false);
  return (
    <IntroContext.Provider value={{ isIntroDone, setIsIntroDone }}>
      {children}
    </IntroContext.Provider>
  );
};

export const useIntro = () => useContext(IntroContext);