import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { recordSignupTraffic } from "@/services/signups";

const schema = z
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

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignupModal({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { acceptTerms: false as unknown as true },
  });

  const onSubmit = async (values: FormValues) => {
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

      // Keep only checkout display details in this tab. Passwords are sent directly
      // to Supabase Auth and are never persisted by the application.
      sessionStorage.setItem(
        "mira.signupDraft",
        JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          organization: values.organization ?? "",
        }),
      );

      onOpenChange(false);
      reset();
      navigate({ to: "/checkout" });
    } catch (error) {
      setSubmitError(toSignupErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

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
                Start your MIRA trial
              </div>
              <h2 className="mt-2 font-display text-3xl leading-tight text-foreground">
                Create your account
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                48 hours of guided access for ₹49.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Field label="Full name" error={errors.fullName?.message}>
                <input {...register("fullName")} className={inputCls} placeholder="Priya Sharma" />
              </Field>
              <Field label="Work email" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={inputCls}
                  placeholder="priya@company.com"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Password" error={errors.password?.message}>
                  <input
                    {...register("password")}
                    type="password"
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </Field>
                <Field label="Confirm" error={errors.confirmPassword?.message}>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Organization (optional)">
                <input {...register("organization")} className={inputCls} placeholder="Acme Inc." />
              </Field>

              <label className="flex items-start gap-2 pt-1 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                  className="mt-0.5 accent-[var(--brand)]"
                />
                <span>I accept the Terms of Service and acknowledge MIRA's Privacy Policy.</span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
              )}
              {submitError && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-xs text-destructive"
                >
                  {submitError}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Creating account..." : "Create account & continue"}
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-full py-2 text-center text-xs text-muted-foreground transition hover:text-foreground"
              >
                I already have an account
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function toSignupErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return "We couldn't create your account. Please try again.";

  const message = error.message.toLowerCase();
  if (message.includes("already registered") || message.includes("already exists")) {
    return "An account with this email already exists. Sign in instead.";
  }
  if (message.includes("password")) return error.message;
  if (message.includes("rate limit")) {
    return "Too many signup attempts. Please wait a moment and try again.";
  }
  if (message.includes("missing supabase environment")) {
    return "Account creation is not configured yet. Please contact support.";
  }

  return error.message || "We couldn't create your account. Please try again.";
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
