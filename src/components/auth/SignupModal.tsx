import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { acceptTerms: false as unknown as true },
  });

  const onSubmit = (values: FormValues) => {
    setSubmitting(true);
    // Frontend-only draft. Password is intentionally NOT persisted.
    try {
      sessionStorage.setItem(
        "mira.signupDraft",
        JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          organization: values.organization ?? "",
        }),
      );
    } catch {
      // sessionStorage may be unavailable during SSR/preview — ignore.
    }
    onOpenChange(false);
    reset();
    setSubmitting(false);
    navigate({ to: "/checkout" });
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
                  className={inputCls}
                  placeholder="priya@company.com"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Password" error={errors.password?.message}>
                  <input {...register("password")} type="password" className={inputCls} />
                </Field>
                <Field label="Confirm" error={errors.confirmPassword?.message}>
                  <input {...register("confirmPassword")} type="password" className={inputCls} />
                </Field>
              </div>
              <Field label="Organization (optional)">
                <input {...register("organization")} className={inputCls} placeholder="Acme Inc." />
              </Field>

              <label className="flex items-start gap-2 pt-1 text-xs text-muted-foreground">
                <input type="checkbox" {...register("acceptTerms")} className="mt-0.5 accent-[var(--brand)]" />
                <span>I accept the Terms of Service and acknowledge MIRA's Privacy Policy.</span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
              >
                Create account & continue
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
