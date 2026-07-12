import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { recordSignupTraffic } from "@/services/signups";

export type AuthMode = "signup" | "signin";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid work email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
    organization: z.string().optional(),
    acceptTerms: z.literal(true, { message: "Accept the terms to continue" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

const signinSchema = z.object({
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(1, "Enter your password"),
});

type SignupValues = z.infer<typeof signupSchema>;
type SigninValues = z.infer<typeof signinSchema>;

interface Props {
  open: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onOpenChange: (open: boolean) => void;
}

export function SignupModal({ open, mode, onModeChange, onOpenChange }: Props) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { acceptTerms: false as unknown as true },
  });

  const signinForm = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
  });

  useEffect(() => {
    if (!open) setSubmitError(null);
  }, [open, mode]);

  const onSignup = async (values: SignupValues) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/checkout`,
          data: {
            full_name: values.fullName,
            organization: values.organization?.trim() || null,
            signup_source_path: window.location.pathname,
            signup_referrer: document.referrer || null,
            signup_user_agent: navigator.userAgent,
          },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Supabase did not return a user after signup.");

      recordSignupTraffic({
        data: {
          userId: data.user.id,
          email: values.email,
          fullName: values.fullName,
          organization: values.organization,
          sourcePath: window.location.pathname,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
        },
      }).catch((error) => {
        console.error("[Signup] Could not record signup traffic", error);
      });

      saveDraft({
        fullName: values.fullName,
        email: values.email,
        organization: values.organization ?? "",
      });

      onOpenChange(false);
      signupForm.reset();
      navigate({ to: "/checkout" });
    } catch (error) {
      setSubmitError(toAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const onSignin = async (values: SigninValues) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Supabase did not return a user after sign in.");

      saveDraft({
        fullName: readUserName(data.user.user_metadata),
        email: values.email,
        organization: readOrganization(data.user.user_metadata),
      });

      onOpenChange(false);
      signinForm.reset();
      navigate({ to: "/checkout" });
    } catch (error) {
      setSubmitError(toAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-xl"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            className="hairline relative w-full max-w-md overflow-hidden rounded-3xl bg-surface p-8 shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {isSignup ? "Start your MIRA trial" : "Welcome back"}
              </div>
              <h2 className="mt-2 font-display text-3xl leading-tight text-foreground">
                {isSignup ? "Create your account" : "Sign in to MIRA"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isSignup ? "48 hours of guided access for INR 49." : "Continue to your checkout."}
              </p>
            </div>

            {isSignup ? (
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                <Field label="Full name" error={signupForm.formState.errors.fullName?.message}>
                  <input {...signupForm.register("fullName")} className={inputCls} placeholder="Priya Sharma" />
                </Field>
                <Field label="Work email" error={signupForm.formState.errors.email?.message}>
                  <input
                    {...signupForm.register("email")}
                    type="email"
                    autoComplete="email"
                    className={inputCls}
                    placeholder="priya@company.com"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Password" error={signupForm.formState.errors.password?.message}>
                    <input
                      {...signupForm.register("password")}
                      type="password"
                      autoComplete="new-password"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Confirm" error={signupForm.formState.errors.confirmPassword?.message}>
                    <input
                      {...signupForm.register("confirmPassword")}
                      type="password"
                      autoComplete="new-password"
                      className={inputCls}
                    />
                  </Field>
                </div>
                <Field label="Organization (optional)">
                  <input {...signupForm.register("organization")} className={inputCls} placeholder="Acme Inc." />
                </Field>
                <label className="flex items-start gap-2 pt-1 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    {...signupForm.register("acceptTerms")}
                    className="mt-0.5 accent-[var(--brand)]"
                  />
                  <span>I accept the Terms of Service and acknowledge MIRA's Privacy Policy.</span>
                </label>
                {signupForm.formState.errors.acceptTerms && (
                  <p className="text-xs text-destructive">
                    {signupForm.formState.errors.acceptTerms.message}
                  </p>
                )}
                <AuthError message={submitError} />
                <SubmitButton submitting={submitting} label="Create account & continue" busyLabel="Creating account..." />
                <ModeButton onClick={() => onModeChange("signin")}>I already have an account</ModeButton>
              </form>
            ) : (
              <form onSubmit={signinForm.handleSubmit(onSignin)} className="space-y-4">
                <Field label="Work email" error={signinForm.formState.errors.email?.message}>
                  <input
                    {...signinForm.register("email")}
                    type="email"
                    autoComplete="email"
                    className={inputCls}
                    placeholder="priya@company.com"
                  />
                </Field>
                <Field label="Password" error={signinForm.formState.errors.password?.message}>
                  <input
                    {...signinForm.register("password")}
                    type="password"
                    autoComplete="current-password"
                    className={inputCls}
                  />
                </Field>
                <AuthError message={submitError} />
                <SubmitButton submitting={submitting} label="Sign in & continue" busyLabel="Signing in..." />
                <ModeButton onClick={() => onModeChange("signup")}>Create a new account</ModeButton>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function saveDraft(draft: { fullName?: string; email: string; organization?: string }) {
  sessionStorage.setItem("mira.signupDraft", JSON.stringify(draft));
}

function readUserName(metadata: Record<string, unknown>) {
  return typeof metadata.full_name === "string" ? metadata.full_name : "";
}

function readOrganization(metadata: Record<string, unknown>) {
  return typeof metadata.organization === "string" ? metadata.organization : "";
}

function toAuthErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return "We couldn't complete that request. Please try again.";

  const message = error.message.toLowerCase();
  if (message.includes("already registered") || message.includes("already exists")) {
    return "An account with this email already exists. Sign in instead.";
  }
  if (message.includes("invalid login credentials")) return "Invalid email or password.";
  if (message.includes("email not confirmed")) return "Please confirm your email before signing in.";
  if (message.includes("password")) return error.message;
  if (message.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  if (message.includes("missing supabase environment")) {
    return "Authentication is not configured yet. Please contact support.";
  }

  return error.message || "We couldn't complete that request. Please try again.";
}

function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-xs text-destructive"
    >
      {message}
    </div>
  );
}

function SubmitButton({
  submitting,
  label,
  busyLabel,
}: {
  submitting: boolean;
  label: string;
  busyLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="mt-2 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
    >
      {submitting ? busyLabel : label}
    </button>
  );
}

function ModeButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-2 text-center text-xs text-muted-foreground transition hover:text-foreground"
    >
      {children}
    </button>
  );
}

const inputCls =
  "w-full rounded-xl border border-hairline bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-[var(--brand)]/60 focus:ring-2 focus:ring-[var(--brand)]/20";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
