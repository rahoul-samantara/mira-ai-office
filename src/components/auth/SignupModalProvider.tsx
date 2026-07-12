import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { SignupModal } from "./SignupModal";

type Ctx = { open: () => void; close: () => void };
const SignupModalContext = createContext<Ctx | null>(null);

export function SignupModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <SignupModalContext.Provider value={{ open, close }}>
      {children}
      <SignupModal open={isOpen} onOpenChange={setIsOpen} />
    </SignupModalContext.Provider>
  );
}

export function useSignupModal() {
  const ctx = useContext(SignupModalContext);
  if (!ctx) throw new Error("useSignupModal must be used inside SignupModalProvider");
  return ctx;
}
