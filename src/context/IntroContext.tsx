"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

/**
 * Marks that the splash animation has already played in this tab. Session,
 * not local, storage: a returning visitor tomorrow should see the intro
 * again, but someone refreshing mid-visit should not sit through it a
 * second time.
 */
const SESSION_KEY = "intro-done";

// useLayoutEffect logs a warning when a client component is prerendered on
// the server, where it can't run. Falling back to useEffect there is the
// standard workaround, and the branch is fixed for the module's lifetime so
// hook order can never change between renders.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// sessionStorage can throw under strict privacy settings. A failure here
// should cost a repeat visitor the splash skip, never the whole page.
function readIntroDone(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function persistIntroDone() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Ignored — see above.
  }
}

type IntroContextType = {
  isIntroDone: boolean;
  setIsIntroDone: (val: boolean) => void;
};

const IntroContext = createContext<IntroContextType>({
  isIntroDone: false,
  setIsIntroDone: () => {},
});

export const IntroProvider = ({ children }: { children: React.ReactNode }) => {
  // Always false for the server render — sessionStorage doesn't exist there,
  // and seeding state from it would be a hydration mismatch. The layout
  // effect below corrects it before the browser paints, so a repeat visitor
  // never actually sees the splash.
  const [isIntroDone, setIsIntroDone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    // Setting state from an effect is the point here, not an oversight: the
    // value has to differ between the server render and the client, so it
    // cannot be derived at render without a hydration mismatch. Running
    // before paint is what keeps a repeat visitor from seeing the splash
    // flash. (set-state-in-effect doesn't fire here only because the hook is
    // aliased above and the rule can't follow it — the reasoning stands on
    // its own, not on the lint result.)
    if (readIntroDone()) setIsIntroDone(true);
  }, []);

  // Persistence lives with the setter rather than in SplashScreen, so there
  // is exactly one place that knows the intro has finished.
  const markIntroDone = useCallback((val: boolean) => {
    setIsIntroDone(val);
    if (val) persistIntroDone();
  }, []);

  const value = useMemo(
    () => ({ isIntroDone, setIsIntroDone: markIntroDone }),
    [isIntroDone, markIntroDone],
  );

  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
};

export const useIntro = () => useContext(IntroContext);
