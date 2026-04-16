"use client";

/**
 * New simplified checkout flow.
 *
 * Everyone registers solo first (name + email + phone),
 * then gets the option to join a team via code or create one.
 *
 * Supports two layouts:
 *   - "card"      → sidebar left, step-by-step form right (Card Flow)
 *   - "immersive" → full-screen centered, one question at a time
 */

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, Copy, Check, Users, Plus } from "lucide-react";

import { useCheckoutCountdown } from "@/lib/hooks";
import SidebarSwitch from "./SidebarSwitch";
import { MaterialInput } from "./MaterialInput";
import { useAccentColor } from "./InputStyleContext";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

type StepId = "info" | "phone" | "team";
type Layout = "card" | "immersive";

/* ── Shared helpers ────────────────────────────────────────────────────── */

function generateTeamCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `GX-${code}`;
}

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

  return (
    <div style={{
      opacity: phase === "visible" ? 1 : 0,
      transform: phase === "exit" ? "translateY(-4px)" : phase === "enter" ? "translateY(8px)" : "translateY(0)",
      transition: phase === "exit"
        ? `opacity 150ms ${EASE_OUT_QUINT}, transform 150ms ${EASE_OUT_QUINT}`
        : `opacity 250ms ${EASE_OUT_QUINT}, transform 250ms ${EASE_OUT_QUINT}`,
      willChange: "transform, opacity",
    }}>{displayChildren}</div>
  );
}

function QLabel({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col gap-[6px] mb-[4px]">
      <h3 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "18px", color: "#fff", lineHeight: "27px", margin: 0 }}>{children}</h3>
      {sub && <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

function ctaStyle(enabled: boolean, _BLUE_RGB: string): React.CSSProperties {
  if (!enabled) {
    return { background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)", border: "none" };
  }
  return {
    background: "linear-gradient(180deg, #1a75ff 0%, #0058e0 100%)",
    boxShadow: [
      "0 1px 1px 0 rgba(0,0,0,0.24)",
      "0 2px 3px 0 rgba(34,42,53,0.20)",
      "0 1px 1px 0 rgba(255,255,255,0.07) inset",
      "0 0 0 1px #0064FF",
    ].join(", "),
    border: "none",
  };
}

/* ── Confetti ── */
function ConfettiCanvas({ active }: { active: boolean }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const c = ref.current;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
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

/* ════════════════════════════════════════════════════════════════════════
   Step content (shared between both layouts)
   ════════════════════════════════════════════════════════════════════════ */

function StepInfo({ name, setName, email, setEmail, onEnter }: {
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  onEnter?: () => void;
}) {
  return (
    <div className="flex flex-col gap-[20px]">
      <QLabel>Let&apos;s get you registered</QLabel>
      <div className="flex flex-col gap-[12px]">
        <MaterialInput label="Full name" value={name} onChange={setName} autoFocus />
        <MaterialInput label="Email address" value={email} onChange={setEmail} type="email" onEnter={onEnter} />
      </div>
    </div>
  );
}

function StepPhone({ phone, setPhone, onEnter }: {
  phone: string; setPhone: (v: string) => void; onEnter?: () => void;
}) {
  return (
    <div className="flex flex-col gap-[20px]">
      <QLabel sub="We'll send event updates and your ticket here.">Your mobile number</QLabel>
      <MaterialInput label="Phone number" value={phone} onChange={setPhone} type="tel" autoFocus onEnter={onEnter} />
    </div>
  );
}

function StepTeam({ teamCode, setTeamCode, createdCode, onCreateTeam, joinedTeam, onEnter }: {
  teamCode: string; setTeamCode: (v: string) => void;
  createdCode: string | null; onCreateTeam: () => void;
  joinedTeam: boolean; onEnter?: () => void;
}) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!createdCode) return;
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Already created a team — show the code
  if (createdCode) {
    return (
      <div className="flex flex-col gap-[24px]">
        <QLabel sub="Share this code with your teammates so they can join.">Your team is ready</QLabel>

        {/* Code display */}
        <div className="flex items-center justify-between px-[20px] py-[18px] rounded-[12px]"
          style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
          <span style={{ fontFamily: monoFont, fontSize: "24px", fontWeight: 700, color: "#fff", letterSpacing: "2px" }}>
            {createdCode}
          </span>
          <button onClick={handleCopy}
            className="press-scale flex items-center gap-[6px] px-[14px] py-[8px] rounded-[8px]"
            style={{
              background: copied ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.08)",
              boxShadow: `inset 0 0 0 1px ${copied ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)"}`,
              border: "none", cursor: "pointer", transition: "all 0.2s ease",
            }}>
            {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} color="rgba(255,255,255,0.6)" />}
            <span style={{ fontFamily: gilroy, fontSize: "13px", fontWeight: 500, color: copied ? "#34d399" : "rgba(255,255,255,0.6)" }}>
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>

        <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: 1.5, margin: 0 }}>
          Your teammates will enter this code after they register to join your team.
        </p>
      </div>
    );
  }

  // Already joined — show confirmation
  if (joinedTeam) {
    return (
      <div className="flex flex-col gap-[20px]">
        <QLabel>You&apos;ve joined a team</QLabel>
        <div className="flex items-center gap-[12px] px-[20px] py-[16px] rounded-[12px]"
          style={{ background: "rgba(52,211,153,0.08)", boxShadow: "inset 0 0 0 1px rgba(52,211,153,0.2)" }}>
          <Users size={18} color="#34d399" />
          <span style={{ fontFamily: gilroy, fontSize: "15px", fontWeight: 600, color: "#34d399" }}>
            Team code: {teamCode.toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  // Default: choice between join or create
  return (
    <div className="flex flex-col gap-[24px]">
      <QLabel sub="Join an existing team or start a new one. Max 5 teammates per team. You can also skip this.">Team up?</QLabel>

      {/* Join with code */}
      <div className="flex flex-col gap-[10px]">
        <span style={{ fontFamily: gilroy, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Join a team
        </span>
        <div className="flex gap-[8px]">
          <div className="flex-1">
            <MaterialInput label="Enter team code" value={teamCode} onChange={setTeamCode} onEnter={onEnter} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-[16px]">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        <span style={{ fontFamily: gilroy, fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.2)" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Create team */}
      <button onClick={onCreateTeam}
        className="press-scale flex items-center justify-center gap-[8px] w-full py-[14px] rounded-[12px]"
        style={{
          background: "rgba(255,255,255,0.04)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
          border: "none", cursor: "pointer", transition: "all 0.15s ease",
        }}>
        <Plus size={16} color="rgba(255,255,255,0.6)" />
        <span style={{ fontFamily: gilroy, fontWeight: 600, fontSize: "15px", color: "rgba(255,255,255,0.7)" }}>
          Create a new team
        </span>
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════════════════════ */

export default function CheckoutNew({ layout = "card", sidebarVariant = "v11" }: {
  layout?: Layout; sidebarVariant?: string;
}) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const countdown = useCheckoutCountdown();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [joinedTeam, setJoinedTeam] = useState(false);
  const [completed, setCompleted] = useState(false);

  const steps: StepId[] = ["info", "phone", "team"];
  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const isLastStep = stepIdx === steps.length - 1;
  const progress = steps.length <= 1 ? 5 : Math.max(5, (stepIdx / (steps.length - 1)) * 100);

  const canContinue = (() => {
    if (currentStep === "info") return name.trim().length > 0 && email.trim().length > 0 && email.includes("@");
    if (currentStep === "phone") return phone.trim().length >= 10;
    if (currentStep === "team") return true; // always can continue (skip or after action)
    return false;
  })();

  const goBack = () => setStepIdx(prev => Math.max(0, prev - 1));
  const goForward = () => {
    if (currentStep === "team" && teamCode.trim().length > 0 && !joinedTeam && !createdCode) {
      setJoinedTeam(true);
      return;
    }
    if (isLastStep) setCompleted(true);
    else setStepIdx(prev => prev + 1);
  };

  const handleCreateTeam = () => {
    setCreatedCode(generateTeamCode());
  };

  // Enter key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && canContinue && !completed) {
      e.preventDefault();
      goForward();
    }
  }, [canContinue, completed, currentStep, teamCode, joinedTeam, createdCode, isLastStep]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const ctaLabel = currentStep === "team"
    ? (createdCode || joinedTeam ? "Complete Registration" : (teamCode.trim().length > 0 ? "Join Team" : "Skip & Complete"))
    : "Continue";

  /* ──────────────────── Card Flow Layout ──────────────────── */
  if (layout === "card") {
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
          <div className="relative flex items-start justify-between w-full"
            style={{ minHeight: "450px", height: "720px", padding: "32px 16px 16px" }}>

            <ConfettiCanvas active={completed} />

            {/* Progress bar + close */}
            <div className="absolute left-0 right-0 flex items-center gap-[12px] px-[16px] pb-[32px] z-10" style={{ top: "40px" }}>
              <div className="relative h-[4px] flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="absolute inset-y-0 left-0 rounded-full bg-white"
                  style={{ width: `${completed ? 100 : progress}%`, transition: `width 0.4s ${EASE_OUT_QUINT}` }} />
              </div>
              <Link href="/" className="flex items-center justify-center shrink-0"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }} aria-label="Close">
                <span className="flex items-center justify-center size-[28px] rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}>
                  <X className="size-[14px] text-white" />
                </span>
              </Link>
            </div>

            {/* Sidebar */}
            <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={1} className="mt-[80px]" />

            {/* Form column */}
            <div className="flex flex-col items-start shrink-0 overflow-auto pt-[80px] px-[8px]"
              style={{ width: "493px", height: "680px" }}>
              <div className="flex flex-col w-full h-full">

                {/* Back */}
                {stepIdx > 0 && !completed && (
                  <button onClick={goBack}
                    className="flex items-center gap-1 mb-6 text-[12px] text-white/60 hover:text-white transition-colors"
                    style={{ fontFamily: monoFont, minHeight: "40px", background: "none", border: "none", cursor: "pointer" }}>
                    <ChevronLeft size={14} />
                    <span>BACK</span>
                  </button>
                )}

                {completed ? (
                  <div className="flex flex-col gap-[30px] w-full flex-1 items-center justify-center">
                    <CompletionScreen />
                  </div>
                ) : (
                  <div className="flex flex-col gap-[30px] w-full flex-1">
                    <StepTransition stepKey={currentStep}>
                      {currentStep === "info" && <StepInfo name={name} setName={setName} email={email} setEmail={setEmail} />}
                      {currentStep === "phone" && <StepPhone phone={phone} setPhone={setPhone} />}
                      {currentStep === "team" && (
                        <StepTeam teamCode={teamCode} setTeamCode={setTeamCode}
                          createdCode={createdCode} onCreateTeam={handleCreateTeam}
                          joinedTeam={joinedTeam} />
                      )}
                    </StepTransition>
                  </div>
                )}

                {/* Bottom CTA */}
                {!completed && (
                  <div className="flex items-center gap-[12px] py-[32px] w-full sticky bottom-0"
                    style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 30%)" }}>
                    <button onClick={() => canContinue && goForward()}
                      disabled={!canContinue}
                      className="press-scale flex items-center justify-center w-full py-[12px] rounded-[10px]"
                      style={{ ...ctaStyle(canContinue, BLUE_RGB), transition: "all 0.2s ease" }}>
                      <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                        color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                        {ctaLabel}
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

  /* ──────────────────── Immersive Layout ──────────────────── */
  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", background: "#000", overflow: "hidden" }}>
      <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.45)} * { box-sizing: border-box; }`}</style>

      {/* Subtle gradient bg */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "300px",
        background: "radial-gradient(ellipse at 30% 0%, rgba(0,60,200,0.15) 0%, transparent 70%)",
        pointerEvents: "none" }} />

      {/* Top bar: progress + close */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px",
        boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
          <span style={{ fontFamily: monoFont, fontSize: "11px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
            {completed ? steps.length : stepIdx + 1} / {steps.length}
          </span>
          <div style={{ flex: 1, height: "2px", borderRadius: "1px", background: "rgba(255,255,255,0.1)", position: "relative" }}>
            <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${completed ? 100 : Math.max(3, progress)}%`,
              background: BLUE, borderRadius: "1px", transition: `width 0.4s ${EASE_OUT_QUINT}` }} />
          </div>
        </div>
        <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "32px",
          width: "44px", height: "44px", borderRadius: "50%" }} aria-label="Close">
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center",
            width: "36px", height: "36px", borderRadius: "50%",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)", color: "white" }}>
            <X size={16} />
          </span>
        </Link>
      </div>

      {/* Main content */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", padding: "120px 48px", maxWidth: "1200px", margin: "0 auto", gap: "80px", position: "relative" }}>

        <ConfettiCanvas active={completed} />
        <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={1} />

        <div style={{ flex: 1, maxWidth: "520px" }}>
          {completed ? (
            <CompletionScreen />
          ) : (
            <>
              {stepIdx > 0 && (
                <button onClick={goBack}
                  className="flex items-center gap-1 mb-10 text-[12px] text-white/60 hover:text-white transition-colors"
                  style={{ fontFamily: monoFont, background: "none", border: "none", cursor: "pointer", minHeight: "40px" }}>
                  <ChevronLeft size={14} />
                  <span>BACK</span>
                </button>
              )}

              <StepTransition stepKey={currentStep}>
                {currentStep === "info" && <StepInfo name={name} setName={setName} email={email} setEmail={setEmail} />}
                {currentStep === "phone" && <StepPhone phone={phone} setPhone={setPhone} />}
                {currentStep === "team" && (
                  <StepTeam teamCode={teamCode} setTeamCode={setTeamCode}
                    createdCode={createdCode} onCreateTeam={handleCreateTeam}
                    joinedTeam={joinedTeam} />
                )}
              </StepTransition>

              {/* Bottom CTA */}
              <div style={{ marginTop: "40px" }}>
                <button onClick={() => canContinue && goForward()}
                  disabled={!canContinue}
                  className="press-scale flex items-center justify-center w-full py-[14px] rounded-[12px]"
                  style={{ ...ctaStyle(canContinue, BLUE_RGB), transition: "all 0.2s ease" }}>
                  <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                    color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                    {ctaLabel}
                  </span>
                </button>
                <div className="flex items-center justify-center mt-[12px]">
                  <span style={{ fontFamily: monoFont, fontSize: "11px", color: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", gap: "4px" }}>
                    press <kbd style={{
                      padding: "1px 5px", borderRadius: "4px", fontSize: "10px",
                      background: "rgba(255,255,255,0.06)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 1px 0 rgba(255,255,255,0.04)",
                    }}>Enter &crarr;</kbd>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
