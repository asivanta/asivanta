import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageMeta } from "@/lib/page-meta";

const initialForm = { fullName: "", company: "", email: "", evaluation: "", message: "", website: "" };
const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100";
const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";
const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const CHALLENGE_UNAVAILABLE = "The abuse-prevention check is unavailable, so this form cannot be submitted.";
const CHALLENGE_EXPIRED = "The abuse-prevention check expired. Please complete it again.";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        "error-callback": () => void;
        "expired-callback": () => void;
      }) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challengeError, setChallengeError] = useState("");
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const markUnavailable = () => {
    setTurnstileToken("");
    setChallengeError(CHALLENGE_UNAVAILABLE);
  };

  useEffect(() => {
    if (submitted) return;

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      markUnavailable();
      return;
    }

    let cancelled = false;
    const renderTurnstile = () => {
      const container = turnstileContainerRef.current;
      if (cancelled || !container || !window.turnstile || turnstileWidgetIdRef.current) return;

      try {
        turnstileWidgetIdRef.current = window.turnstile.render(container, {
          sitekey: siteKey,
          callback: (token) => {
            if (cancelled) return;
            setTurnstileToken(token);
            setChallengeError("");
          },
          "error-callback": () => {
            if (cancelled) return;
            markUnavailable();
          },
          "expired-callback": () => {
            if (cancelled) return;
            setTurnstileToken("");
            setChallengeError(CHALLENGE_EXPIRED);
          },
        });
      } catch {
        markUnavailable();
      }
    };

    let script = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    const handleScriptError = () => {
      if (script) script.dataset.turnstileFailed = "true";
      if (!cancelled) markUnavailable();
    };
    const handleScriptLoad = () => {
      if (!window.turnstile) {
        handleScriptError();
        return;
      }
      renderTurnstile();
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = TURNSTILE_SCRIPT_URL;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      if (script.dataset.turnstileFailed === "true") {
        handleScriptError();
      } else {
        script.addEventListener("load", handleScriptLoad);
        script.addEventListener("error", handleScriptError);
      }
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", handleScriptLoad);
      script?.removeEventListener("error", handleScriptError);
      const widgetId = turnstileWidgetIdRef.current;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      turnstileWidgetIdRef.current = null;
    };
  }, [submitted]);

  const resetTurnstile = () => {
    setTurnstileToken("");
    const widgetId = turnstileWidgetIdRef.current;
    if (!widgetId || !window.turnstile) return;
    try {
      window.turnstile.reset(widgetId);
    } catch {
      markUnavailable();
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!turnstileToken) {
      setError("Please complete the abuse-prevention check before sending your inquiry.");
      return;
    }
    setError("");
    setSubmitting(true);

    const payload = new FormData();
    payload.append("fullName", form.fullName.trim());
    payload.append("company", form.company.trim());
    payload.append("email", form.email.trim());
    payload.append("evaluation", form.evaluation.trim());
    payload.append("message", form.message.trim());
    payload.append("_hp_field", form.website);
    payload.append("turnstileToken", turnstileToken);

    try {
      const response = await fetch("/api/contact", { method: "POST", body: payload });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Your inquiry could not be sent. Please email hello@asivanta.com instead.");
      setForm(initialForm);
      setSubmitted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your inquiry could not be sent. Please email hello@asivanta.com instead.");
    } finally {
      resetTurnstile();
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta page="contact" />
      <Navbar />
      <main className="pt-20">
        <section className="bg-slate-50 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Contact</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Send a sourcing inquiry</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">Tell us the part, product, supplier, RFQ, or question you are evaluating. We will review whether it fits and reply if we can help.</p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.4fr_.6fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
              {submitted ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
                  <CheckCircle2 className="h-12 w-12 text-emerald-700" />
                  <h2 className="mt-5 text-2xl font-semibold">Received. We will reply if we can help.</h2>
                  <p className="mt-3 max-w-md text-slate-600">Your inquiry was sent to Asivanta.</p>
                  <button type="button" onClick={() => setSubmitted(false)} className="mt-7 rounded-full border border-slate-300 px-5 py-2.5 font-semibold hover:bg-slate-50">Send another inquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="text-sm font-semibold">Name
                      <input className={inputClass} type="text" name="fullName" required maxLength={120} autoComplete="name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} />
                    </label>
                    <label className="text-sm font-semibold">Company
                      <input className={inputClass} type="text" name="company" required maxLength={160} autoComplete="organization" value={form.company} onChange={(event) => update("company", event.target.value)} />
                    </label>
                  </div>

                  <label className="block text-sm font-semibold">Email
                    <input className={inputClass} type="email" name="email" required maxLength={254} autoComplete="email" inputMode="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
                  </label>

                  <label className="block text-sm font-semibold">What are you evaluating?
                    <textarea className={`${inputClass} min-h-28 resize-y`} name="evaluation" required minLength={10} maxLength={1000} value={form.evaluation} onChange={(event) => update("evaluation", event.target.value)} placeholder="A part, product, supplier, RFQ, document set, or sourcing question" />
                  </label>

                  <label className="block text-sm font-semibold">What do you need clarified?
                    <textarea className={`${inputClass} min-h-36 resize-y`} name="message" required minLength={10} maxLength={2000} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell us the decision ahead and the open questions you want reviewed" />
                  </label>

                  <div>
                    <div ref={turnstileContainerRef} aria-label="Abuse-prevention check" />
                    {!challengeError && !turnstileToken && <p className="mt-2 text-sm text-slate-600" aria-live="polite">Complete the abuse-prevention check to enable sending.</p>}
                    {challengeError && (
                      <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
                        {challengeError} Please email <a className="font-semibold underline" href="mailto:hello@asivanta.com">hello@asivanta.com</a> instead.
                      </div>
                    )}
                  </div>

                  {error && <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>}

                  <button type="submit" disabled={submitting || !turnstileToken} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#081226] px-6 py-3.5 font-semibold text-white transition hover:bg-[#102b52] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                    {submitting ? "Sending…" : "Send inquiry"} {!submitting && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>
              )}
            </div>

            <aside className="space-y-5 lg:pt-4">
              <div className="rounded-3xl bg-[#081226] p-7 text-white">
                <h2 className="text-xl font-semibold">Prefer email?</h2>
                <a href="mailto:hello@asivanta.com" className="mt-5 flex items-center gap-3 text-blue-200 hover:text-white"><Mail className="h-5 w-5" /> hello@asivanta.com</a>
                <p className="mt-5 text-sm leading-6 text-slate-400">Submitting an inquiry does not create an advisory engagement. Please avoid sending sensitive information until a scope is agreed.</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-5 text-sm text-slate-600"><MapPin className="h-5 w-5 text-blue-700" /> Seoul, South Korea</div>
              <Link href="/privacy" className="block text-sm font-semibold text-blue-700 hover:text-blue-900">How inquiry information is handled</Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
