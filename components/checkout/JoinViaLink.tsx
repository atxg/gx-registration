"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, UserCheck } from "lucide-react";

import { MaterialInput } from "./MaterialInput";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

/* ── Step transition ── */
function StepTransition({ children, stepKey }: { children: React.ReactNode; stepKey: string }) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const [displayKey, setDisplayKey] = useState(stepKey);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (stepKey !== displayKey) {
      setPhase("exit");
      const t = setTimeout(() => {
        setDisplayKey(stepKey);
        setDisplayChildren(children);
        setPhase("enter");
        requestAnimationFrame(() => requestAnimationFrame(() => setPhase("visible")));
      }, 150);
      return () => clearTimeout(t);
    } else {
      setDisplayChildren(children);
    }
  }, [stepKey, children, displayKey]);

  useEffect(() => {
    if (phase === "enter") {
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase("visible")));
    }
  }, [phase]);

  const style: React.CSSProperties = {
    opacity: phase === "visible" ? 1 : 0,
    transform: phase === "exit" ? "translateY(-4px)" : phase === "enter" ? "translateY(8px)" : "translateY(0)",
    transition: phase === "exit"
      ? `opacity 150ms ${EASE_OUT_QUINT}, transform 150ms ${EASE_OUT_QUINT}`
      : `opacity 250ms ${EASE_OUT_QUINT}, transform 250ms ${EASE_OUT_QUINT}`,
    willChange: "transform, opacity",
  };

  return <div style={style}>{displayChildren}</div>;
}

/* ── Question label ── */
function QLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[18px] text-white leading-[27px] w-full" style={{ fontFamily: gilroy, fontWeight: 700, textWrap: "balance" }}>
      {children}
    </h3>
  );
}

/* ── Confetti ── */
function ConfettiCanvas({ active }: { active: boolean }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const c = ref.current;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = c.offsetWidth;
    c.height = c.offsetHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: c.width / 2, y: c.height / 2,
      vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12 - 4,
      size: Math.random() * 6 + 2,
      color: ["#408cff", "#5b9eff", "#fff", "#a78bfa", "#34d399"][Math.floor(Math.random() * 5)],
      life: 1,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.012;
        ctx.globalAlpha = p.life; ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      if (alive) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none z-20" />;
}

/* ── CTA button style (matches checkout-simple / V3) ── */
function ctaStyle(enabled: boolean): React.CSSProperties {
  if (!enabled) {
    return { background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)", border: "none" };
  }
  return {
    background: "linear-gradient(180deg, #1a75ff 0%, #0058e0 100%)",
    boxShadow: "0 1px 1px 0 rgba(0,0,0,0.24), 0 2px 3px 0 rgba(34,42,53,0.20), 0 1px 1px 0 rgba(255,255,255,0.07) inset, 0 0 0 1px #0064FF",
    border: "none",
  };
}

/* ── Simulated existing team members ── */
const SIMULATED_MEMBERS = [
  { name: "Anshul Ghorse", role: "Team Leader" },
];

/* ════════════════════════════════════════════════════════════════════════
   Join via Link — Main Component
   ════════════════════════════════════════════════════════════════════════ */

export default function JoinViaLink({ code }: { code: string; sidebarVariant?: string }) {
  void code;
  // Simulated team data
  const teamLeader = "Anshul Ghorse";
  const teamName = `${teamLeader}'s Team`;

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [completed, setCompleted] = useState(false);

  // Steps
  type StepId = "welcome" | "info" | "phone";
  const steps: StepId[] = ["welcome", "info", "phone"];

  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const isLastStep = stepIdx === steps.length - 1;
  const progress = steps.length <= 1 ? 5 : Math.max(5, (stepIdx / (steps.length - 1)) * 100);

  const canContinue = (() => {
    if (currentStep === "welcome") return true;
    if (currentStep === "info") return name.trim().length > 0 && email.trim().length > 0 && email.includes("@");
    if (currentStep === "phone") return phone.trim().length >= 10;
    return false;
  })();

  const goBack = () => setStepIdx(prev => Math.max(0, prev - 1));
  const goForward = () => {
    if (isLastStep) {
      setCompleted(true);
      return;
    }
    setStepIdx(prev => prev + 1);
  };

  // Enter key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && canContinue && !completed) {
      e.preventDefault();
      goForward();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canContinue, completed, isLastStep]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* ── Completion screen ── */
  function CompletionScreen() {
    const [visible, setVisible] = useState(false);
    useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, []);
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "16px", padding: "60px 20px", textAlign: "center",
        opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.98)",
        transition: `opacity 300ms ${EASE_OUT_QUINT}, transform 300ms ${EASE_OUT_QUINT}`,
      }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎉</div>
        <h2 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "24px", color: "#fff", margin: 0 }}>You&apos;re in!</h2>
        <p style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: "340px" }}>
          You&apos;ve joined <strong style={{ color: "#fff" }}>{teamName}</strong>. Check your email for confirmation and event details.
        </p>

        {/* Team members */}
        <div style={{
          marginTop: "12px", padding: "16px 20px", borderRadius: "12px", width: "100%", maxWidth: "320px",
          background: "rgba(255,255,255,0.04)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}>
          <p style={{ fontFamily: gilroy, fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Team Members</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[...SIMULATED_MEMBERS, { name: name.trim() || "You", role: "Member" }].map((m, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "10px",
                opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(6px)",
                transition: `opacity 200ms ${EASE_OUT_QUINT} ${150 + i * 60}ms, transform 200ms ${EASE_OUT_QUINT} ${150 + i * 60}ms`,
              }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: i === 0 ? "rgba(91,158,255,0.15)" : "rgba(52,211,153,0.15)",
                  boxShadow: `inset 0 0 0 1px ${i === 0 ? "rgba(91,158,255,0.2)" : "rgba(52,211,153,0.2)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 700, color: i === 0 ? "rgba(91,158,255,0.8)" : "rgba(52,211,153,0.8)",
                  fontFamily: gilroy,
                }}>
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: gilroy, fontSize: "13px", fontWeight: 600, color: "#fff" }}>{m.name}</span>
                  <span style={{ fontFamily: gilroy, fontSize: "11px", color: "rgba(255,255,255,0.35)", marginLeft: "6px" }}>{m.role}</span>
                </div>
                <UserCheck size={14} color="rgba(52,211,153,0.6)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.65)}`}</style>

      {/* Background blur */}
      <div className="absolute h-[450px] inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-[-675px_-3240px]" style={{ filter: "blur(90px)" }}>
          <Image src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1600&h=900&fit=crop"
            alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[180px]"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), black)" }} />
      </div>

      <div className="relative z-10 w-full" style={{ padding: "32px 56px 40px", maxWidth: "640px" }}>
        <ConfettiCanvas active={completed} />

        {/* Progress bar + close */}
        <div className="flex items-center gap-[12px] mb-[56px]">
          <div className="relative h-[4px] flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${completed ? 100 : progress}%`, transition: `width 0.4s ${EASE_OUT_QUINT}` }} />
          </div>
          <Link href="/" className="flex items-center justify-center shrink-0"
            style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-label="Close">
            <span className="flex items-center justify-center size-[28px] rounded-full"
              style={{ background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}>
              <X className="size-[14px] text-white" />
            </span>
          </Link>
        </div>

        {/* Content column — left anchored, no sidebar */}
        <div className="flex flex-col items-start">
          <div className="flex flex-col w-full">

              {/* Back button */}
              {stepIdx > 0 && !completed && (
                <button onClick={goBack}
                  className="flex items-center gap-1 mb-6 text-[12px] text-white/60 hover:text-white transition-colors"
                  style={{ fontFamily: monoFont, minHeight: "40px" }}>
                  <ChevronLeft size={14} />
                  <span>BACK</span>
                </button>
              )}

              {/* Steps */}
              {completed ? (
                <div className="flex flex-col gap-[30px] w-full flex-1 items-center justify-center">
                  <CompletionScreen />
                </div>
              ) : (
                <div className="flex flex-col gap-[30px] w-full flex-1">
                  <StepTransition stepKey={currentStep}>

                    {/* Step: Welcome / Team info */}
                    {currentStep === "welcome" && (
                      <div className="flex flex-col items-start gap-[24px]">
                        {/* 3D silver team icon (matches Team picker in CheckoutTeamCode) */}
                        <div style={{
                          width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden",
                          background: "rgba(180,190,200,0.18)",
                          boxShadow: "0 0 0 1px rgba(200,210,220,0.18)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Image src="/images/silver01.png" alt="" width={52} height={52} style={{ objectFit: "contain", borderRadius: "50%" }} />
                        </div>

                        <div>
                          <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "0 0 6px", letterSpacing: "0.2px" }}>
                            You&apos;re joining
                          </p>
                          <h2 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "32px", lineHeight: 1.1, color: "#fff", margin: 0, textWrap: "balance" }}>
                            {teamName}
                          </h2>
                        </div>

                        {/* Members — flat list, no nested card */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                          {SIMULATED_MEMBERS.map((m, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{
                                width: "28px", height: "28px", borderRadius: "50%",
                                background: "rgba(255,255,255,0.06)",
                                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: gilroy, fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.85)",
                              }}>
                                {m.name.charAt(0)}
                              </div>
                              <span style={{ fontFamily: gilroy, fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.88)" }}>
                                {m.name}
                              </span>
                              <span style={{ fontFamily: gilroy, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                                · {m.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step: Name + Email */}
                    {currentStep === "info" && (
                      <div className="flex flex-col gap-[20px]">
                        <QLabel>What&apos;s your name and email?</QLabel>
                        <div className="flex flex-col gap-[20px]">
                          <MaterialInput label="Full name" value={name} onChange={setName} autoFocus />
                          <MaterialInput label="Email address" value={email} onChange={setEmail} type="email" />
                        </div>
                      </div>
                    )}

                    {/* Step: Phone */}
                    {currentStep === "phone" && (
                      <div className="flex flex-col gap-[20px]">
                        <QLabel>Your mobile number</QLabel>
                        <MaterialInput label="Phone number" value={phone} onChange={setPhone} type="tel" autoFocus />
                        <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
                          We&apos;ll send event updates and your ticket here.
                        </p>
                      </div>
                    )}

                  </StepTransition>
                </div>
              )}

              {/* Bottom nav */}
              {!completed && (
                <div className="flex items-center gap-[12px] py-[32px] w-full sticky bottom-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 30%)" }}>
                  <button onClick={() => canContinue && goForward()}
                    disabled={!canContinue}
                    className="press-scale flex items-center justify-center w-full py-[12px] rounded-[10px]"
                    style={{ ...ctaStyle(canContinue), transition: "background 0.2s ease, box-shadow 0.2s ease" }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                      color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {currentStep === "welcome"
                        ? "Join Team & Register"
                        : isLastStep
                          ? "Complete Registration"
                          : "Continue"}
                    </span>
                  </button>
                </div>
              )}

          </div>
        </div>
      </div>

    </div>
  );
}
