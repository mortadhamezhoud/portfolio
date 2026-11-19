"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
const MAX = 1000;
const TYPES = ["job", "freelance", "internship", "other"] as const;
const BUDGETS = ["lt500", "b1", "b2", "gt5000", "unsure"] as const;

interface FormValues {
  name: string;
  email: string;
  company: string;
  type: string;
  message: string;
  budget: string;
  timeline: string;
  _gotcha: string;
}

const fieldClass =
  "w-full rounded-lg border border-border bg-bg px-3.5 py-2.5 text-text outline-none transition-colors placeholder:text-muted/60 focus:border-accent aria-[invalid=true]:border-red-400";
const labelClass = "mb-1.5 block font-mono text-xs text-muted";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({ email }: { email: string }) {
  const t = useTranslations("contact.form");
  const reduced = usePrefersReducedMotion();
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { type: "" } });

  const type = watch("type");
  const length = watch("message")?.length ?? 0;
  const isFreelance = type === "freelance";

  const aria = (name: keyof FormValues) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const required = { required: t("errors.required") };

  const onSubmit = async (values: FormValues) => {
    if (!ENDPOINT) {
      setStatus("error");
      return;
    }
    const payload = {
      ...values,
      type: t(`types.${values.type as (typeof TYPES)[number]}`),
      budget:
        isFreelance && values.budget
          ? t(`budgets.${values.budget as (typeof BUDGETS)[number]}`)
          : undefined,
      timeline: isFreelance ? values.timeline : undefined,
    };
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="flex min-h-[28rem] flex-col items-center justify-center gap-6 rounded-2xl border border-border bg-surface p-8 text-center"
      >
        <svg viewBox="0 0 52 52" className="h-20 w-20" fill="none" aria-hidden="true">
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            stroke="#3ee6c1"
            strokeWidth="2"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M15 27l8 8 15-17"
            stroke="#3ee6c1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </svg>
        <p className="font-display text-xl text-text">{t("success")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="relative flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <h3 className="font-display text-xl font-bold text-text">{t("title")}</h3>

      {/* Honeypot: hidden from people and screen readers, bots fill it in */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("_gotcha")}
      />

      <Field id="name" label={t("name")} error={errors.name?.message}>
        <input
          id="name"
          autoComplete="name"
          className={fieldClass}
          {...aria("name")}
          {...register("name", required)}
        />
      </Field>

      <Field id="email" label={t("email")} error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={fieldClass}
          {...aria("email")}
          {...register("email", {
            ...required,
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: t("errors.email") },
          })}
        />
      </Field>

      <Field id="company" label={t("company")}>
        <input
          id="company"
          autoComplete="organization"
          className={fieldClass}
          {...register("company")}
        />
      </Field>

      <Field id="type" label={t("type")} error={errors.type?.message}>
        <select id="type" className={fieldClass} {...aria("type")} {...register("type", required)}>
          <option value="">{t("typePlaceholder")}</option>
          {TYPES.map((k) => (
            <option key={k} value={k}>
              {t(`types.${k}`)}
            </option>
          ))}
        </select>
      </Field>

      <AnimatePresence initial={false}>
        {isFreelance && (
          <motion.div
            key="freelance"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="budget" label={t("budget")}>
                <select id="budget" className={fieldClass} {...register("budget")}>
                  <option value="">{t("budgetPlaceholder")}</option>
                  {BUDGETS.map((k) => (
                    <option key={k} value={k}>
                      {t(`budgets.${k}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="timeline" label={t("timeline")}>
                <input
                  id="timeline"
                  placeholder={t("timelinePlaceholder")}
                  className={fieldClass}
                  {...register("timeline")}
                />
              </Field>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Field id="message" label={t("message")} error={errors.message?.message}>
        <textarea
          id="message"
          rows={5}
          maxLength={MAX}
          className={`${fieldClass} resize-y`}
          {...aria("message")}
          {...register("message", {
            ...required,
            minLength: { value: 20, message: t("errors.minMessage") },
            maxLength: { value: MAX, message: t("errors.maxMessage") },
          })}
        />
        <p className="mt-1 text-right font-mono text-xs text-muted">
          {length}/{MAX}
        </p>
      </Field>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-400/10 p-3 text-sm text-red-300"
        >
          {ENDPOINT ? t("error") : t("noEndpoint")} {t("errorFallback")}{" "}
          <a href={`mailto:${email}`} className="underline hover:text-white">
            {email}
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-display font-bold text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {isSubmitting ? t("sending") : t("send")}
      </button>
    </form>
  );
}
