"use client";
import { useState, useEffect, useRef } from "react";
import { X, Check } from "lucide-react";

/* ─── Figma asset URLs ────────────────────────────────────────── */
const imgBg =
  "http://localhost:3845/assets/d2f347f45151909bbb592dc78120fe5d06e3da77.png";

/* ─── Font helpers ────────────────────────────────────────────── */
const SERIF = "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";
const SANS  = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO  = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

/* ─── Steps definition ───────────────────────────────────────── */
const TOTAL_STEPS = 4;

interface Step {
  id: number;
  questions: Question[];
}

interface Question {
  id: string;
  label: string;
  hint?: string;
  required: boolean;
  multiline?: boolean;
}

const STEPS: Step[] = [
  {
    id: 1,
    questions: [
      { id: "name",  label: "What's your full name?", required: true },
      { id: "email", label: "What's your email address?", hint: "We'll send your confirmation here.", required: true },
      { id: "phone", label: "And your phone number?", required: true },
    ],
  },
  {
    id: 2,
    questions: [
      { id: "role",    label: "What best describes your role?", hint: "Founder, PM, Engineer, Designer…", required: true },
      { id: "company", label: "Where do you work?", required: true },
    ],
  },
  {
    id: 3,
    questions: [
      {
        id: "project",
        label: "Any side project or buildathon you've worked on? What did you build?",
        hint: "Share link.",
        required: true,
        multiline: true,
      },
      {
        id: "aiProblem",
        label: "What's one problem you think should have already been solved using AI - but still hasn't?",
        required: true,
        multiline: true,
      },
    ],
  },
  {
    id: 4,
    questions: [
      { id: "source",  label: "How did you hear about this event?", required: true },
      { id: "regType", label: "Are you registering solo or as part of a team?", hint: "Solo, Team of 2–5.", required: true },
    ],
  },
];

/* ─── Countdown hook ─────────────────────────────────────────── */
function useCountdown(initialSeconds = 9 * 60 + 48) {
  const [secs, setSecs] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ─── AutoGrow textarea ──────────────────────────────────────── */
function AutoTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "0";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
        borderBottom: "0.8px solid rgba(255,255,255,0.15)",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "15px",
        color: "#fff",
        lineHeight: "21.56px",
        outline: "none",
        resize: "none",
        padding: "0 0 4px 0",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "block",
        caretColor: "#fff",
      }}
    />
  );
}

function UnderlineInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
        borderBottom: "0.8px solid rgba(255,255,255,0.15)",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: "15px",
        color: "#fff",
        lineHeight: "21.56px",
        outline: "none",
        padding: "0 0 4px 0",
        boxSizing: "border-box",
        caretColor: "#fff",
      }}
    />
  );
}

/* ─── Placeholder style override ─────────────────────────────── */
const placeholderCSS = `
  ::placeholder { color: rgba(255,255,255,0.5); font-weight: 600; }
`;

/* ─── Main component ─────────────────────────────────────────── */
export default function FormV4Checkout() {
  const countdown = useCountdown();
  const [currentStep, setCurrentStep] = useState(3); // Show step 3 matching Figma
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const step = STEPS[currentStep - 1];
  const progress = ((currentStep - 1) / TOTAL_STEPS) * 100;

  const setAnswer = (id: string, val: string) =>
    setAnswers(prev => ({ ...prev, [id]: val }));

  const stepComplete = step.questions
    .filter(q => q.required)
    .every(q => (answers[q.id] || "").trim().length > 0);

  const handleContinue = () => {
    if (!stepComplete) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(s => s + 1);
    } else {
      setDone(true);
    }
  };

  /* ── Done state ── */
  if (done) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "100px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(139,198,138,0.1)",
              border: "1px solid rgba(139,198,138,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Check size={28} style={{ color: "#8bc68a" }} />
          </div>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: "28px",
              color: "#fff",
              letterSpacing: "-0.3px",
              marginBottom: "10px",
            }}
          >
            You&apos;re registered!
          </p>
          <p
            style={{
              fontFamily: SANS,
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Confirmation sent to {answers.email || "your email"}.
          </p>
          <p
            style={{
              fontFamily: MONO,
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              marginTop: "6px",
              letterSpacing: "1px",
            }}
          >
            April 18 · Bengaluru
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{placeholderCSS}</style>

      {/* Force pure black behind this form — overrides the #060606 page wrapper */}
      <style>{`body { background: #000 !important; }`}</style>
      <div
        style={{
          background: "#000",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Blurred background image ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-25%",
            right: "-25%",
            height: "450px",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {/* Blurred layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              filter: "blur(90px)",
              transform: "scale(1.1)",
            }}
          >
            <img
              src={imgBg}
              alt=""
              style={{
                width: "100%",
                height: "585.23%",
                objectFit: "cover",
                position: "absolute",
                top: "-242.61%",
                left: 0,
              }}
            />
          </div>
          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
            }}
          />
          {/* Bottom fade to black */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "180px",
              background: "linear-gradient(to bottom, rgba(0,0,0,0), #000)",
            }}
          />
        </div>

        {/* ── Close button ── */}
        <button
          style={{
            position: "absolute",
            top: "27px",
            right: "80px",
            width: "40px",
            height: "40px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 20,
          }}
          aria-label="Close"
        >
          <X size={16} style={{ color: "rgba(255,255,255,0.7)" }} />
        </button>

        {/* ── Main layout ── */}
        <div
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "40px",
            paddingLeft: "80px",
            paddingRight: "80px",
            paddingBottom: "40px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "950px",
              minHeight: "450px",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "16px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* ── Progress bar ── */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                padding: "12px 16px",
                backdropFilter: "blur(5px)",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "9999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "#fff",
                    borderRadius: "9999px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            {/* ══════════════════════════════════════
                LEFT COLUMN — Event card
            ══════════════════════════════════════ */}
            <div
              style={{
                width: "345px",
                maxWidth: "345px",
                flexShrink: 0,
                position: "relative",
                height: "405px",
                maxHeight: "405px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "14.8px",
                  maxHeight: "345px",
                  maxWidth: "345px",
                }}
              >
                {/* Countdown pill */}
                <div
                  style={{
                    background: "rgba(0,0,0,0.23)",
                    border: "1px solid rgba(0,0,0,0.23)",
                    borderRadius: "10px",
                    padding: "1px",
                    height: "35.25px",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 24px",
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: SANS,
                        fontWeight: 600,
                        fontSize: "11.5px",
                        color: "rgba(255,255,255,0.65)",
                        letterSpacing: "0.115px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Complete your booking in
                    </span>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontWeight: 500,
                        fontSize: "11.5px",
                        color: "#ffbc35",
                        letterSpacing: "0.115px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {countdown}
                    </span>
                  </div>
                </div>

                {/* Event image */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "10px",
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={imgBg}
                    alt="AI + Hardware Buildathon"
                    style={{
                      position: "absolute",
                      top: "-10.96%",
                      left: 0,
                      width: "100%",
                      height: "121.92%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Event title */}
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "24px",
                    color: "#fff",
                    letterSpacing: "-0.24px",
                    lineHeight: "36px",
                    margin: 0,
                    flexShrink: 0,
                  }}
                >
                  AI + Hardware Buildathon
                </p>

                {/* Price details */}
                <div
                  style={{
                    paddingTop: "24px",
                    width: "100%",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <p
                      style={{
                        fontFamily: MONO,
                        fontSize: "12px",
                        color: "#fff",
                        letterSpacing: "2.4px",
                        textTransform: "uppercase",
                        margin: 0,
                      }}
                    >
                      PRICE DETAILS
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "40.8px" }}>
                      {/* General Admission row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: SANS,
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#fff",
                          }}
                        >
                          General Admission
                        </span>
                        <span
                          style={{
                            fontFamily: SANS,
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "#fff",
                          }}
                        >
                          ₹974
                        </span>
                      </div>

                      {/* To pay row */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: SANS,
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#fff",
                          }}
                        >
                          To pay
                        </span>
                        <span
                          style={{
                            fontFamily: SANS,
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "#fff",
                          }}
                        >
                          ₹974
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════
                RIGHT COLUMN — Form questions
            ══════════════════════════════════════ */}
            <div
              style={{
                width: "493px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                minHeight: "450px",
                justifyContent: "center",
                paddingTop: "38px",
                position: "relative",
              }}
            >
              <div
                style={{
                  flex: "1 0 0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 8px",
                  overflow: "visible",
                }}
              >
                <form
                  style={{
                    display: "flex",
                    flex: "1 0 0",
                    flexDirection: "column",
                    gap: "0",
                  }}
                  onSubmit={e => { e.preventDefault(); handleContinue(); }}
                >
                  {/* Questions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "30px",
                    }}
                  >
                    {step.questions.map(q => (
                      <div
                        key={q.id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {/* Question label */}
                        <p
                          style={{
                            fontFamily: SANS,
                            fontWeight: 700,
                            fontSize: "18px",
                            color: "#fff",
                            lineHeight: "27px",
                            margin: 0,
                          }}
                        >
                          {q.label}
                          {q.required && (
                            <span
                              style={{
                                fontFamily: MONO,
                                fontSize: "16px",
                                marginLeft: "4px",
                              }}
                            >
                              *
                            </span>
                          )}
                        </p>

                        {/* Optional hint */}
                        {q.hint && (
                          <p
                            style={{
                              fontFamily: SANS,
                              fontWeight: 500,
                              fontSize: "14px",
                              color: "rgba(255,255,255,0.6)",
                              letterSpacing: "-0.6px",
                              lineHeight: "21px",
                              margin: 0,
                              paddingBottom: "4px",
                            }}
                          >
                            {q.hint}
                          </p>
                        )}

                        {/* Input */}
                        <div
                          style={{
                            paddingTop: "4px",
                            paddingBottom: "5px",
                          }}
                        >
                          {q.multiline ? (
                            <AutoTextarea
                              value={answers[q.id] || ""}
                              onChange={v => setAnswer(q.id, v)}
                              placeholder="Answer here"
                            />
                          ) : (
                            <UnderlineInput
                              value={answers[q.id] || ""}
                              onChange={v => setAnswer(q.id, v)}
                              placeholder="Answer here"
                              type={
                                q.id === "email" ? "email" :
                                q.id === "phone" ? "tel" : "text"
                              }
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ── Continue button with gradient fade ── */}
                  <div
                    style={{
                      marginTop: "32px",
                      display: "flex",
                      alignItems: "flex-start",
                      paddingTop: "32px",
                      paddingBottom: "32px",
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 20%)",
                    }}
                  >
                    <button
                      type="submit"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 52px",
                        minWidth: "64px",
                        cursor: stepComplete ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: SANS,
                          fontWeight: 700,
                          fontSize: "16px",
                          color: stepComplete
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(255,255,255,0.3)",
                          lineHeight: "28px",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {currentStep === TOTAL_STEPS ? "Complete Registration" : "Continue"}
                      </span>
                    </button>

                    {/* Step indicator */}
                    <div
                      style={{
                        marginLeft: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        paddingTop: "10px",
                      }}
                    >
                      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentStep(i + 1)}
                          style={{
                            width: i + 1 === currentStep ? "20px" : "6px",
                            height: "6px",
                            borderRadius: "3px",
                            background:
                              i + 1 === currentStep
                                ? "#fff"
                                : i + 1 < currentStep
                                ? "rgba(255,255,255,0.5)"
                                : "rgba(255,255,255,0.2)",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            transition: "all 0.2s ease",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
