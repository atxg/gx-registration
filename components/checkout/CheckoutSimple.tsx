"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

import { useCheckoutCountdown } from "@/lib/hooks";
import SidebarSwitch from "./SidebarSwitch";
import { MaterialInput } from "./MaterialInput";
import { useAccentColor } from "./InputStyleContext";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

type JoinType = "solo" | "team" | null;

interface Teammate {
  id: string;
  name: string;
  email: string;
}

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

/* ── Solo / Team picker ── */
function SoloSvg({ active, size = 24 }: { active: boolean; size?: number }) {
  const c = active ? "#fff" : "rgba(255,255,255,0.35)";
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="9" r="4.5" stroke={c} strokeWidth="1.5" style={{ transition: "stroke 0.2s ease" }} />
      <path d="M6 24c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke={c} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.2s ease" }} />
    </svg>
  );
}

function TeamSvg({ active, size = 24 }: { active: boolean; size?: number }) {
  const c1 = active ? "#fff" : "rgba(255,255,255,0.35)";
  const c2 = active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)";
  const w = Math.round(size * 34 / 28);
  return (
    <svg width={w} height={size} viewBox="0 0 34 28" fill="none">
      <circle cx="12" cy="9" r="4.5" stroke={c1} strokeWidth="1.5" style={{ transition: "stroke 0.2s ease" }} />
      <path d="M4 24c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke={c1} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.2s ease" }} />
      <circle cx="22.5" cy="10.5" r="3.5" stroke={c2} strokeWidth="1.5" style={{ transition: "stroke 0.2s ease" }} />
      <path d="M22.5 16c3.31 0 6 2.69 6 6" stroke={c2} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.2s ease" }} />
    </svg>
  );
}

function JoinPicker({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "20px", minHeight: "160px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
    boxShadow: a ? "inset 0 0 0 1.5px rgba(255,255,255,0.5)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }}>
      <button onClick={() => onSelect("solo")} className="press-scale" style={card(s)}>
        <SoloSvg active={s} />
        <div style={{ width: "100%", height: "1px", background: s ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", margin: "16px 0 14px" }} />
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)", marginTop: "5px" }}>Just you.</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", color: s ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", marginTop: "auto", paddingTop: "14px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" style={card(t)}>
        <TeamSvg active={t} />
        <div style={{ width: "100%", height: "1px", background: t ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", margin: "16px 0 14px" }} />
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)", marginTop: "5px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", color: t ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", marginTop: "auto", paddingTop: "14px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)" }}> / person</span></span>
      </button>
    </div>
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
      x: c.width / 2,
      y: c.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 4,
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
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= 0.012;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
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

/* ── Completion ── */
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
      <p style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: "320px" }}>
        Registration complete. Check your email for confirmation details.
      </p>
    </div>
  );
}

/* ── CTA button style ── */
function ctaStyle(enabled: boolean, BLUE: string, BLUE_RGB: string): React.CSSProperties {
  if (!enabled) {
    return {
      background: "rgba(255,255,255,0.06)",
      boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)",
      border: "none",
    };
  }
  return {
    background: `linear-gradient(180deg, #5198ff 0%, #3272d9 100%)`,
    boxShadow: [
      "inset 0 1px 0 0 rgba(255,255,255,0.18)",
      "0 1px 0 0 rgba(0,20,60,0.5)",
      "0 2px 4px 0 rgba(0,10,40,0.25)",
      `0 4px 16px -2px rgba(${BLUE_RGB},0.3)`,
    ].join(", "),
    border: "none",
  };
}

/* ════════════════════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════════════════════ */

export default function CheckoutSimple({ sidebarVariant = "v11" }: { sidebarVariant?: string }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const countdown = useCheckoutCountdown();

  // Form state
  const [joinType, setJoinType] = useState<JoinType>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [completed, setCompleted] = useState(false);

  // Steps
  type StepId = "type" | "info" | "phone" | "team";
  const steps: StepId[] = joinType === "team"
    ? ["type", "info", "phone", "team"]
    : ["type", "info", "phone"];

  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const isLastStep = stepIdx === steps.length - 1;
  const progress = steps.length <= 1 ? 5 : Math.max(5, (stepIdx / (steps.length - 1)) * 100);
  const memberCount = joinType === "team" ? teammates.length + 1 : 1;

  const canContinue = (() => {
    if (currentStep === "type") return joinType !== null;
    if (currentStep === "info") return name.trim().length > 0 && email.trim().length > 0 && email.includes("@");
    if (currentStep === "phone") return phone.trim().length >= 10;
    if (currentStep === "team") return true; // can skip adding teammates
    return false;
  })();

  const goBack = () => setStepIdx(prev => Math.max(0, prev - 1));
  const goForward = () => {
    if (isLastStep) setCompleted(true);
    else setStepIdx(prev => prev + 1);
  };

  const addTeammate = () => {
    if (!newName.trim() || !newEmail.trim() || !newEmail.includes("@")) return;
    setTeammates(prev => [...prev, { id: crypto.randomUUID(), name: newName.trim(), email: newEmail.trim() }]);
    setNewName("");
    setNewEmail("");
  };

  const removeTeammate = (id: string) => {
    setTeammates(prev => prev.filter(t => t.id !== id));
  };

  // Enter key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && canContinue && !completed) {
      e.preventDefault();
      goForward();
    }
  }, [canContinue, completed, isLastStep]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden flex items-start justify-center">
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

      <div className="relative z-10 w-full max-w-[1000px] px-[40px]">
        <div className="relative flex items-start justify-between w-full overflow-hidden"
          style={{ minHeight: "450px", height: "720px", padding: "32px 16px 16px" }}>

          <ConfettiCanvas active={completed} />

          {/* Progress bar + close */}
          <div className="absolute left-0 right-0 flex items-center gap-[12px] px-[16px] pb-[32px] z-10" style={{ top: "40px" }}>
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

          {/* Sidebar */}
          <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={memberCount} className="mt-[80px]" />

          {/* Form column */}
          <div className="flex flex-col items-start shrink-0 overflow-auto pt-[80px] px-[8px]"
            style={{ width: "493px", height: "680px" }}>
            <div className="flex flex-col w-full h-full">

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

                    {/* Step: Join type */}
                    {currentStep === "type" && (
                      <div className="flex flex-col gap-[20px]">
                        <QLabel>How are you joining?</QLabel>
                        <JoinPicker selected={joinType} onSelect={setJoinType} />
                      </div>
                    )}

                    {/* Step: Name + Email */}
                    {currentStep === "info" && (
                      <div className="flex flex-col gap-[20px]">
                        <QLabel>What&apos;s your name and email?</QLabel>
                        <div className="flex flex-col gap-[12px]">
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

                    {/* Step: Add team members */}
                    {currentStep === "team" && (
                      <div className="flex flex-col gap-[20px]">
                        <QLabel>Add your teammates</QLabel>
                        <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "-8px" }}>
                          You can add up to 5 more people. They&apos;ll get an invite email.
                        </p>

                        {/* Existing teammates */}
                        {teammates.length > 0 && (
                          <div className="flex flex-col gap-[8px]">
                            {teammates.map((tm) => (
                              <div key={tm.id}
                                className="flex items-center justify-between px-[16px] py-[12px] rounded-[10px]"
                                style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
                                <div className="flex flex-col gap-[2px]">
                                  <span style={{ fontFamily: gilroy, fontSize: "14px", fontWeight: 600, color: "#fff" }}>{tm.name}</span>
                                  <span style={{ fontFamily: gilroy, fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{tm.email}</span>
                                </div>
                                <button onClick={() => removeTeammate(tm.id)}
                                  className="flex items-center justify-center size-[32px] rounded-[8px]"
                                  style={{ background: "rgba(255,255,255,0.04)", border: "none", cursor: "pointer" }}>
                                  <Trash2 size={14} color="rgba(255,255,255,0.4)" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add new teammate */}
                        {teammates.length < 5 && (
                          <div className="flex flex-col gap-[10px]">
                            <div className="flex gap-[8px]">
                              <div className="flex-1">
                                <MaterialInput label="Name" value={newName} onChange={setNewName}
                                  onEnter={() => { if (newName.trim() && newEmail.trim()) addTeammate(); }} />
                              </div>
                              <div className="flex-1">
                                <MaterialInput label="Email" value={newEmail} onChange={setNewEmail}
                                  onEnter={() => { if (newName.trim() && newEmail.trim()) addTeammate(); }}
                                  type="email" />
                              </div>
                            </div>
                            <button onClick={addTeammate}
                              disabled={!newName.trim() || !newEmail.trim() || !newEmail.includes("@")}
                              className="flex items-center gap-[6px] self-start px-[14px] py-[8px] rounded-[8px]"
                              style={{
                                background: newName.trim() && newEmail.trim() ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                                border: "none", cursor: newName.trim() && newEmail.trim() ? "pointer" : "default",
                                transition: "all 0.15s ease",
                              }}>
                              <Plus size={14} color="rgba(255,255,255,0.5)" />
                              <span style={{ fontFamily: gilroy, fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>Add</span>
                            </button>
                          </div>
                        )}
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
                    style={{ ...ctaStyle(canContinue, BLUE, BLUE_RGB), transition: "all 0.2s ease" }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                      color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {isLastStep ? "Complete Registration" : "Continue"}
                    </span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
