// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Check } = Icons;

const REGISTERED_EMAILS = [
  "bob@example.com",
  "maya.okafor@example.com",
  "jonas.lindqvist@example.com",
  "priya.raman@example.com",
];

const PREVIEW_TASKS = [
  { title: "Book dentist for the 3rd", done: false },
  { title: "Send invoice to Harbor & Pine", done: false },
  { title: "Renew passport photos", done: true },
  { title: "Pick up sourdough starter", done: true },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState("idle"); // idle | submitting | done
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const canvas =
    "color-mix(in srgb, " +
    brand.backgroundColor +
    " 20%, color-mix(in srgb, " +
    brand.accentColor +
    " 28%, black))";
  const glass = "color-mix(in srgb, white 8%, transparent)";
  const hairline = "1px solid color-mix(in srgb, white 14%, transparent)";
  const textMain = "white";
  const textSoft = "color-mix(in srgb, " + brand.neutralColor + " 70%, white)";
  const errColor = "color-mix(in srgb, crimson 55%, white)";
  const onNeon = "color-mix(in srgb, " + brand.backgroundColor + " 12%, black)";
  const neonGradient =
    "linear-gradient(120deg, " + brand.primaryColor + ", " + brand.accentColor + ")";

  const submitting = status === "submitting";
  const done = status === "done";
  const locked = submitting || done;

  function validate() {
    const next = {};
    const e = email.trim();
    if (!e) next.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(e))
      next.email =
        "That email address format is invalid. Check for an @ sign and a domain, like name@example.com.";
    else if (REGISTERED_EMAILS.includes(e.toLowerCase())) next.registered = true;
    if (!password) next.password = "Password is required.";
    else if (password.length < 8) next.password = "Password must be at least 8 characters long.";
    return next;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (locked) return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setStatus("submitting");
    timerRef.current = setTimeout(() => {
      setStatus("done");
      timerRef.current = setTimeout(() => navigate("tasks"), 600);
    }, 700);
  }

  const emailInvalid = !!(errors.email || errors.registered);
  const passwordInvalid = !!errors.password;
  const remaining = Math.max(0, 8 - password.length);

  const inputStyle = (invalid) => ({
    backgroundColor: "color-mix(in srgb, white 7%, transparent)",
    border: invalid ? "1px solid " + errColor : hairline,
    color: textMain,
    borderRadius: brand.radius,
    minHeight: 48,
    transition: "border-color .2s, background-color .2s",
  });

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: canvas, color: textMain, fontFamily: brand.fontBody }}
    >
      <style>{`
        .su-field:focus-visible, .su-btn:focus-visible, .su-link:focus-visible { outline: 2px solid ${brand.primaryColor}; outline-offset: 3px; }
        .su-field::placeholder { color: color-mix(in srgb, ${brand.neutralColor} 60%, transparent); }
        .su-field:hover:not(:disabled) { background-color: color-mix(in srgb, white 10%, transparent); }
        .su-btn { transition: transform .2s, filter .2s, box-shadow .2s; }
        .su-btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.08); }
        .su-btn:active:not(:disabled) { transform: translateY(0); filter: brightness(.96); }
        .su-btn:disabled { cursor: progress; opacity: .85; }
        .su-link { transition: color .2s; }
        .su-link:hover { color: ${brand.primaryColor}; }
        .su-rise { animation: su-rise .35s ease-out both; }
        .su-trace { stroke-dasharray: 340; stroke-dashoffset: 340; animation: su-trace 2.8s ease-in-out infinite; }
        .su-spin { animation: su-spin .8s linear infinite; }
        @keyframes su-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes su-trace { 0% { stroke-dashoffset: 340; } 55% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -340; } }
        @keyframes su-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .su-rise, .su-trace, .su-spin { animation: none !important; }
          .su-trace { stroke-dashoffset: 0; }
          .su-btn, .su-link, .su-field { transition: none !important; }
          .su-btn:hover:not(:disabled) { transform: none; }
        }
      `}</style>

      {/* wide soft glows */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: -160,
          right: -120,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, color-mix(in srgb, " +
            brand.accentColor +
            " 45%, transparent), transparent)",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          bottom: -200,
          left: -160,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, color-mix(in srgb, " +
            brand.primaryColor +
            " 32%, transparent), transparent)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="relative mx-auto w-full px-4 py-8 md:px-8 md:py-12"
        style={{ maxWidth: 1120 }}
      >
        <div className="grid grid-cols-12 gap-x-8 gap-y-8">
          {/* Row 1 */}
          <header className="col-span-12" data-wf="b-0-0">
            <p
              className="text-sm font-semibold uppercase mb-3"
              style={{ color: brand.primaryColor, letterSpacing: "0.14em" }}
            >
              To-do-app · free, start to finish
            </p>
            <h1
              className="font-extrabold"
              style={{
                fontFamily: brand.fontHeading,
                fontSize: "clamp(2.25rem, 6vw, 3.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Create your{" "}
              <span
                style={{
                  backgroundImage: neonGradient,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                account
              </span>
            </h1>
            <p
              className="mt-3 text-base"
              style={{ color: textSoft, maxWidth: 520, lineHeight: 1.5 }}
            >
              One email, one password, and a private task list that is saved for you on the server.
            </p>
          </header>

          {/* Form column */}
          <div className="col-span-12 lg:col-span-6">
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Sign up"
              className="p-6 md:p-8 flex flex-col gap-6"
              style={{
                backgroundColor: glass,
                border: hairline,
                borderRadius: brand.radius,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow:
                  "0 24px 80px color-mix(in srgb, " + brand.accentColor + " 22%, transparent)",
              }}
            >
              {/* Row 2 */}
              <div data-wf="b-1-0" className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="su-email" className="text-sm font-semibold">
                    Email
                  </label>
                  <input
                    id="su-email"
                    data-wf="i-1-0-0"
                    className="su-field w-full px-4 text-base"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    disabled={locked}
                    aria-invalid={emailInvalid}
                    aria-describedby={
                      errors.email ? "su-email-error" : errors.registered ? "su-notice" : undefined
                    }
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email || errors.registered)
                        setErrors({ ...errors, email: undefined, registered: undefined });
                    }}
                    style={inputStyle(emailInvalid)}
                  />
                  {errors.email && (
                    <p
                      id="su-email-error"
                      className="su-rise flex items-start gap-2 text-sm"
                      style={{ color: errColor, lineHeight: 1.45 }}
                    >
                      <Icons.AlertCircle
                        aria-hidden="true"
                        className="w-4 h-4 shrink-0"
                        style={{ marginTop: 2 }}
                      />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="su-password" className="text-sm font-semibold">
                    Password (at least 8 characters)
                  </label>
                  <input
                    id="su-password"
                    data-wf="i-1-0-1"
                    className="su-field w-full px-4 text-base"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    disabled={locked}
                    aria-invalid={passwordInvalid}
                    aria-describedby={errors.password ? "su-password-error" : "su-password-hint"}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    style={inputStyle(passwordInvalid)}
                  />
                  {errors.password ? (
                    <p
                      id="su-password-error"
                      className="su-rise flex items-start gap-2 text-sm"
                      style={{ color: errColor, lineHeight: 1.45 }}
                    >
                      <Icons.AlertCircle
                        aria-hidden="true"
                        className="w-4 h-4 shrink-0"
                        style={{ marginTop: 2 }}
                      />
                      <span>{errors.password}</span>
                    </p>
                  ) : (
                    <p
                      id="su-password-hint"
                      className="text-sm flex items-center justify-between gap-3"
                      style={{ color: textSoft }}
                    >
                      <span>Stored only as a salted hash, never as readable text.</span>
                      <span
                        style={{
                          fontVariantNumeric: "tabular-nums",
                          color: password.length >= 8 ? brand.primaryColor : textSoft,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {password.length >= 8 ? "8+ ✓" : password.length + " / 8"}
                      </span>
                    </p>
                  )}
                  <span className="sr-only" aria-live="polite">
                    {password.length > 0 && remaining > 0
                      ? remaining + " more characters needed"
                      : ""}
                  </span>
                </div>
              </div>

              {/* Row 3 */}
              <div data-wf="b-2-0" id="su-notice" aria-live="polite">
                {errors.registered ? (
                  <p
                    className="su-rise flex items-start gap-3 text-sm p-4"
                    style={{
                      color: textMain,
                      border: "1px solid " + errColor,
                      backgroundColor: "color-mix(in srgb, crimson 18%, transparent)",
                      borderRadius: brand.radius,
                      lineHeight: 1.5,
                    }}
                  >
                    <Icons.AlertCircle
                      aria-hidden="true"
                      className="w-5 h-5 shrink-0"
                      style={{ color: errColor }}
                    />
                    <span>This email address is already registered. Please log in instead.</span>
                  </p>
                ) : done ? (
                  <p
                    className="su-rise flex items-start gap-3 text-sm p-4"
                    style={{
                      border: "1px solid " + brand.primaryColor,
                      backgroundColor:
                        "color-mix(in srgb, " + brand.primaryColor + " 14%, transparent)",
                      borderRadius: brand.radius,
                      lineHeight: 1.5,
                    }}
                  >
                    <Icons.CheckCircle
                      aria-hidden="true"
                      className="w-5 h-5 shrink-0"
                      style={{ color: brand.primaryColor }}
                    />
                    <span>Account created. Taking you to your empty task list…</span>
                  </p>
                ) : (
                  <p
                    className="flex items-start gap-3 text-sm"
                    style={{ color: textSoft, lineHeight: 1.5 }}
                  >
                    <Icons.CheckCircle
                      aria-hidden="true"
                      className="w-4 h-4 shrink-0"
                      style={{ marginTop: 2, color: brand.primaryColor }}
                    />
                    <span>Free to use. No plan to pick and no card details, ever.</span>
                  </p>
                )}
              </div>

              {/* Row 4 */}
              <div data-wf="b-3-0">
                <button
                  type="submit"
                  data-wf="b-3-0-btn"
                  className="su-btn w-full inline-flex items-center justify-center gap-2 px-6 text-base font-bold"
                  disabled={locked}
                  style={{
                    minHeight: 52,
                    borderRadius: brand.radius,
                    border: "none",
                    backgroundImage: neonGradient,
                    color: onNeon,
                    boxShadow:
                      "0 12px 48px color-mix(in srgb, " + brand.accentColor + " 45%, transparent)",
                    cursor: locked ? "progress" : "pointer",
                  }}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="su-spin w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="3"
                          opacity=".25"
                        />
                        <path
                          d="M21 12a9 9 0 0 0-9-9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Creating account…
                    </>
                  ) : done ? (
                    <>
                      <Icons.Check aria-hidden="true" className="w-5 h-5" />
                      Account created
                    </>
                  ) : (
                    <>
                      Create account
                      <Icons.ArrowRight aria-hidden="true" className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Row 5 */}
              <div data-wf="b-4-0" className="text-sm">
                <button
                  type="button"
                  data-wf="b-4-0-link"
                  className="su-link inline-flex items-center gap-2 font-semibold"
                  onClick={() => navigate("login")}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "12px 0",
                    color: textMain,
                    cursor: "pointer",
                    minHeight: 44,
                    borderRadius: 8,
                  }}
                >
                  <span style={{ color: textSoft, fontWeight: 400 }}>Already have an account?</span>
                  <span
                    style={{
                      textDecoration: "underline",
                      textUnderlineOffset: 4,
                      textDecorationColor: brand.accentColor,
                    }}
                  >
                    Log in
                  </span>
                  <Icons.ChevronRight aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Signature: the pulse list preview */}
          <aside
            aria-hidden="true"
            className="hidden lg:flex col-span-6 items-center justify-center"
          >
            <div className="relative w-full" style={{ maxWidth: 440, transform: "rotate(-2deg)" }}>
              <div
                className="p-6"
                style={{
                  backgroundColor: glass,
                  border: hairline,
                  borderRadius: brand.radius,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow:
                    "0 32px 96px color-mix(in srgb, " + brand.primaryColor + " 28%, transparent)",
                }}
              >
                <svg viewBox="0 0 340 48" className="w-full" style={{ height: 48 }} fill="none">
                  <defs>
                    <linearGradient id="su-pulse-grad" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0" style={{ stopColor: brand.primaryColor }} />
                      <stop offset="1" style={{ stopColor: brand.accentColor }} />
                    </linearGradient>
                  </defs>
                  <path
                    className="su-trace"
                    d="M0 28 H96 L112 28 L126 6 L142 42 L156 20 L166 28 H340"
                    stroke="url(#su-pulse-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex items-end justify-between mt-4 mb-4">
                  <div>
                    <p className="text-sm" style={{ color: textSoft }}>
                      Your list, newest first
                    </p>
                    <p
                      className="font-extrabold"
                      style={{ fontSize: 48, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
                    >
                      2{" "}
                      <span className="text-base font-semibold" style={{ color: textSoft }}>
                        left to do
                      </span>
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 text-sm font-semibold"
                    style={{
                      borderRadius: 999,
                      border: "1px solid " + brand.accentColor,
                      color: textMain,
                    }}
                  >
                    Active
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {PREVIEW_TASKS.map((t) => (
                    <li
                      key={t.title}
                      className="flex items-center gap-3 px-4 py-3 text-sm"
                      style={{
                        borderRadius: brand.radius,
                        border: hairline,
                        backgroundColor: "color-mix(in srgb, white 5%, transparent)",
                      }}
                    >
                      <span
                        className="inline-flex items-center justify-center shrink-0"
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          border: "1px solid " + (t.done ? brand.primaryColor : textSoft),
                          backgroundColor: t.done ? brand.primaryColor : "transparent",
                          color: onNeon,
                        }}
                      >
                        {t.done && <Icons.Check className="w-3 h-3" />}
                      </span>
                      <span
                        style={{
                          textDecoration: t.done ? "line-through" : "none",
                          color: t.done ? textSoft : textMain,
                        }}
                      >
                        {t.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
