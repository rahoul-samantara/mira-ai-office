import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { SignupModal, type AuthMode } from "./SignupModal";

type Ctx = { open: () => void; openSignin: () => void; close: () => void };
const SignupModalContext = createContext<Ctx | null>(null);

export function SignupModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signup");

  const open = useCallback(() => {
    setMode("signup");
    setIsOpen(true);
  }, []);

  const openSignin = useCallback(() => {
    setMode("signin");
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <SignupModalContext.Provider value={{ open, openSignin, close }}>
      {children}
      <SignupModal open={isOpen} mode={mode} onModeChange={setMode} onOpenChange={setIsOpen} />
    </SignupModalContext.Provider>
  );
}

export function useSignupModal() {
  const ctx = useContext(SignupModalContext);
  if (!ctx) throw new Error("useSignupModal must be used inside SignupModalProvider");
  return ctx;
}
