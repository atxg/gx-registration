"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, Copy, Check, Plus, Lock } from "lucide-react";

import { useCheckoutCountdown } from "@/lib/hooks";
import SidebarSwitch from "./SidebarSwitch";
import { MaterialInput } from "./MaterialInput";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_ICON = "cubic-bezier(0.2, 0, 0, 1)";

type JoinType = "solo" | "team" | null;
type TeamAction = "join" | "create" | null;
const PRICE_PER_SEAT = 974;

/* ── generate a readable team code ── */
function generateTeamCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
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

/* ── 3D Silver Solo / Team picker (matches checkout-simple v6) ── */
const ICON_BG_SZ = 64;
function iconBg(a: boolean): React.CSSProperties {
  return {
    width: ICON_BG_SZ, height: ICON_BG_SZ, borderRadius: "50%", overflow: "hidden",
    background: a ? "rgba(180,190,200,0.22)" : "rgba(180,190,200,0.12)",
    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px",
    boxShadow: a ? "0 0 0 1px rgba(200,210,220,0.18)" : "0 0 0 1px rgba(200,210,220,0.08)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  };
}
function choice3DCard(a: boolean): React.CSSProperties {
  return {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "22px", minHeight: "200px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
    boxShadow: a ? "inset 0 0 0 1.5px rgba(255,255,255,0.85)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  };
}

function JoinPicker({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const s = selected === "solo", t = selected === "team";
  return (
    <div className="flex flex-col sm:flex-row w-full gap-[16px] sm:gap-[24px]">
      <button onClick={() => onSelect("solo")} className="press-scale" style={choice3DCard(s)}>
        <div style={iconBg(s)}>
          <Image src="/images/silver02.png" alt="" width={38} height={38} style={{ objectFit: "contain", borderRadius: "50%" }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Just you.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>&#8377;974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" style={choice3DCard(t)}>
        <div style={iconBg(t)}>
          <Image src="/images/silver01.png" alt="" width={44} height={44} style={{ objectFit: "contain", borderRadius: "50%" }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>&#8377;974<span style={{ color: t ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}> / person</span></span>
      </button>
    </div>
  );
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

/* ── Copy → Check icon button (cross-fade with scale + blur) ── */
function CopyIconButton({ copied, onClick }: { copied: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={copied ? "Copied" : "Copy code"}
      className="press-scale copy-icon-btn"
      style={{
        position: "relative",
        width: "44px", height: "44px",
        borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: copied ? "rgba(52,211,153,0.14)" : "rgba(255,255,255,0.06)",
        boxShadow: copied
          ? "inset 0 0 0 1px rgba(52,211,153,0.30)"
          : "inset 0 0 0 1px rgba(255,255,255,0.10)",
        border: "none", cursor: "pointer",
        transitionProperty: "background, box-shadow",
        transitionDuration: "260ms",
        transitionTimingFunction: EASE_OUT_QUINT,
      }}
    >
      {/* Copy icon — fades & scales out on copy */}
      <span style={{
        position: "absolute", display: "flex", alignItems: "center", justifyContent: "center",
        opacity: copied ? 0 : 1,
        transform: copied ? "scale(0.25)" : "scale(1)",
        filter: copied ? "blur(4px)" : "blur(0px)",
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "220ms",
        transitionTimingFunction: EASE_ICON,
        willChange: "transform, opacity, filter",
      }}>
        <Copy size={16} color="rgba(255,255,255,0.72)" strokeWidth={2} />
      </span>
      {/* Check icon — fades & scales in on copy */}
      <span style={{
        position: "absolute", display: "flex", alignItems: "center", justifyContent: "center",
        opacity: copied ? 1 : 0,
        transform: copied ? "scale(1)" : "scale(0.25)",
        filter: copied ? "blur(0px)" : "blur(4px)",
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "280ms",
        transitionTimingFunction: EASE_ICON,
        willChange: "transform, opacity, filter",
      }}>
        <Check size={18} color="#34d399" strokeWidth={2.75} />
      </span>
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Checkout Team Code — Main Component
   ════════════════════════════════════════════════════════════════════════ */

export default function CheckoutTeamCode({ sidebarVariant = "v11" }: { sidebarVariant?: string }) {
  const countdown = useCheckoutCountdown();

  // Form state
  const [joinType, setJoinType] = useState<JoinType>(null);
  const [teamAction, setTeamAction] = useState<TeamAction>(null);
  const [typeStepRevisited, setTypeStepRevisited] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [completed, setCompleted] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Simulated team leader name for join flow
  const [joinedTeamLeader] = useState("Anshul Ghorse");

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Unified simpler flow: team step collects code OR creates a team.
  // Payment is handled via a modal overlay — not an inline step.
  type StepId = "type" | "info" | "phone" | "team-entry" | "join-confirm" | "create-code";
  const steps: StepId[] = (() => {
    if (joinType === "solo") return ["type", "info", "phone"];
    if (joinType === "team" && teamAction === "join") return ["type", "info", "phone", "team-entry", "join-confirm"];
    if (joinType === "team" && teamAction === "create") return ["type", "info", "phone", "team-entry", "create-code"];
    if (joinType === "team") return ["type", "info", "phone", "team-entry"];
    return ["type"];
  })();

  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const isLastStep = stepIdx === steps.length - 1;
  const progress = steps.length <= 1 ? 5 : Math.max(5, (stepIdx / (steps.length - 1)) * 100);
  const memberCount = joinType === "team" ? 2 : 1;
  // Post-payment final screen (create-code) — no back, no CTA, progress at 100%
  const isFinalScreen = (currentStep as string) === "create-code";

  const canContinue = (() => {
    if (currentStep === "type") return joinType !== null;
    if (currentStep === "info") return name.trim().length > 0 && email.trim().length > 0 && email.includes("@");
    if (currentStep === "phone") return phone.trim().length >= 10;
    if (currentStep === "team-entry") return teamCode.trim().length >= 4;
    if (currentStep === "join-confirm") return true;
    if (currentStep === "create-code") return true;
    return false;
  })();

  const goBack = () => {
    if (currentStep === "create-code" || currentStep === "join-confirm") {
      setTeamAction(null);
    }
    const next = Math.max(0, stepIdx - 1);
    if (next === 0) setTypeStepRevisited(true);
    setStepIdx(next);
  };

  const goForward = () => {
    // Team entry with a code typed: route to join-confirm
    if (currentStep === "team-entry" && teamCode.trim().length >= 4 && teamAction !== "create") {
      setTeamAction("join");
      setStepIdx(prev => prev + 1);
      return;
    }
    // Solo: after phone → payment modal
    if (joinType === "solo" && currentStep === "phone") {
      setShowPaymentModal(true);
      return;
    }
    // Team Join: after join-confirm → complete (no payment for joiner)
    if (joinType === "team" && teamAction === "join" && currentStep === "join-confirm") {
      setCompleted(true);
      return;
    }
    // create-code is the final view after payment — "Done" completes
    if (currentStep === "create-code") {
      setCompleted(true);
      return;
    }
    if (isLastStep) {
      setCompleted(true);
    } else {
      setStepIdx(prev => prev + 1);
    }
  };

  // Called when user clicks "Payment Done" in the modal
  const onPaymentDone = () => {
    setShowPaymentModal(false);
    if (joinType === "team" && teamAction === "create") {
      // After payment, show the team code
      if (!generatedCode) setGeneratedCode(generateTeamCode());
      setStepIdx(prev => prev + 1); // advance to create-code step
    } else {
      // Solo: payment completes registration
      setCompleted(true);
    }
  };

  // "Create a team" — leader pays first, then gets the code
  const createTeam = () => {
    setTeamAction("create");
    setShowPaymentModal(true);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 1800);
    } catch {
      // fallback
    }
  };

  // Enter key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && canContinue && !completed && !showPaymentModal) {
      e.preventDefault();
      goForward();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canContinue, completed, isLastStep, currentStep]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* ── Completion screens ── */
  function CompletionScreen() {
    const [visible, setVisible] = useState(false);
    useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, []);

    const subtitle = joinType === "team" && teamAction === "join"
      ? <>You&apos;ve joined <strong style={{ color: "#fff" }}>{joinedTeamLeader}&apos;s team</strong>.</>
      : <>Registration complete. Check your email for details.</>;

    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "16px", padding: "60px 20px", textAlign: "center",
        opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.98)",
        transition: `opacity 300ms ${EASE_OUT_QUINT}, transform 300ms ${EASE_OUT_QUINT}`,
      }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎉</div>
        <h2 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "24px", color: "#fff", margin: 0 }}>You&apos;re in!</h2>
        <p style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: "340px", textWrap: "pretty" as React.CSSProperties["textWrap"] }}>
          {subtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden flex items-start justify-center">
      <style>{`
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.65)}
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

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

      <div className="relative z-10 w-full max-w-[1000px] px-[16px] lg:px-[40px]">
        <div className="relative flex flex-col lg:flex-row items-stretch lg:items-start lg:justify-between w-full lg:overflow-hidden lg:h-[720px]"
          style={{ minHeight: "450px", padding: "32px 0 16px" }}>

          {/* Progress bar row: [back (mobile)] [progress] [close] */}
          <div className="absolute left-0 right-0 flex items-center gap-[12px] px-0 lg:px-[16px] pb-[32px] z-10" style={{ top: "40px" }}>
            {/* Back icon — mobile only, inline with progress bar */}
            {stepIdx > 0 && !completed && !isFinalScreen ? (
              <button onClick={goBack} className="flex lg:hidden items-center justify-center shrink-0"
                style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)", border: "none", cursor: "pointer" }}
                aria-label="Back">
                <ChevronLeft className="size-[14px] text-white" />
              </button>
            ) : null}
            <div className="relative h-[4px] flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{ width: `${completed || isFinalScreen ? 100 : progress}%`, transition: `width 0.4s ${EASE_OUT_QUINT}` }} />
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

          {/* Sidebar — hidden on mobile to keep the form focal */}
          <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={memberCount} className="hidden lg:block mt-[80px]" />

          {/* Form column */}
          <div className="flex flex-col items-start shrink-0 lg:overflow-auto pt-[80px] px-0 lg:px-[8px] w-full lg:w-[493px] lg:h-[680px]">
            <div className="flex flex-col w-full h-full">

              {/* Back button — desktop only (mobile uses icon in progress bar row) */}
              {stepIdx > 0 && !completed && !isFinalScreen && (
                <button onClick={goBack}
                  className="hidden lg:flex items-center gap-1 mb-6 text-[12px] text-white/60 hover:text-white transition-colors"
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

                    {/* Step: Join type — auto-advance on first pick, show Continue on revisit */}
                    {currentStep === "type" && (
                      <div className="flex flex-col gap-[20px]">
                        <QLabel>How are you joining?</QLabel>
                        <JoinPicker selected={joinType} onSelect={(t) => {
                          setJoinType(t);
                          if (!typeStepRevisited) {
                            setTimeout(() => setStepIdx(prev => prev + 1), 250);
                          }
                        }} />
                      </div>
                    )}

                    {/* Step: Name + Email */}
                    {currentStep === "info" && (
                      <div className="flex flex-col gap-[24px]">
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

                    {/* Step: Team entry — input a code OR create a team */}
                    {currentStep === "team-entry" && (
                      <div className="flex flex-col gap-[20px]">
                        <QLabel>Got a team code?</QLabel>
                        <MaterialInput
                          label="Team code"
                          value={teamCode}
                          onChange={(v) => setTeamCode(v.toUpperCase())}
                          autoFocus
                        />

                        {/* or divider */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "4px 0" }}>
                          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                          <span style={{ fontFamily: monoFont, fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "1px" }}>OR</span>
                          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                        </div>

                        {/* Create a team CTA */}
                        <button
                          onClick={createTeam}
                          className="press-scale"
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            width: "100%", padding: "14px 16px", borderRadius: "12px",
                            background: "rgba(255,255,255,0.04)",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
                            border: "none", cursor: "pointer",
                            transitionProperty: "background, box-shadow",
                            transitionDuration: "200ms",
                            transitionTimingFunction: EASE_OUT_QUINT,
                          }}
                        >
                          <Plus size={15} color="rgba(255,255,255,0.75)" strokeWidth={2.25} />
                          <span style={{ fontFamily: gilroy, fontWeight: 600, fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
                            Create a team
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Step: Join confirmation — whose team you joined */}
                    {currentStep === "join-confirm" && (
                      <div className="flex flex-col gap-[20px]">
                        <QLabel>You&apos;re joining a team</QLabel>
                        <div style={{
                          display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
                          padding: "36px 24px", borderRadius: "16px",
                          background: "rgba(255,255,255,0.04)",
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                        }}>
                          <div style={{
                            width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden",
                            background: "rgba(180,190,200,0.22)",
                            boxShadow: "0 0 0 1px rgba(200,210,220,0.18)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Image src="/images/silver01.png" alt="" width={40} height={40} style={{ objectFit: "contain", borderRadius: "50%" }} />
                          </div>
                          <div style={{ textAlign: "center" }}>
                            <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>You&apos;re joining</p>
                            <h3 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "20px", color: "#fff", margin: 0 }}>
                              {joinedTeamLeader}&apos;s Team
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step: Created team — final confirmation with code (post-payment) */}
                    {currentStep === "create-code" && (
                      <div className="flex flex-col gap-[24px]">
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <div style={{ fontSize: "36px" }}>🎉</div>
                          <h2 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "22px", color: "#fff", margin: 0 }}>
                            You&apos;re registered!
                          </h2>
                          <p style={{ fontFamily: gilroy, fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
                            Your team has been created. Share this code with your teammates so they can join.
                          </p>
                        </div>

                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
                          padding: "20px 22px", borderRadius: "16px",
                          background: "linear-gradient(180deg, rgba(91,158,255,0.10) 0%, rgba(91,158,255,0.04) 100%)",
                          boxShadow: "inset 0 0 0 1px rgba(91,158,255,0.22), 0 0 0 4px rgba(91,158,255,0.04)",
                        }}>
                          <div style={{
                            fontFamily: monoFont,
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#fff",
                            letterSpacing: "6px",
                            userSelect: "all",
                            fontVariantNumeric: "tabular-nums",
                          }}>
                            {generatedCode}
                          </div>
                          <CopyIconButton copied={codeCopied} onClick={copyCode} />
                        </div>

                        <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5, textWrap: "pretty" as React.CSSProperties["textWrap"] }}>
                          Your teammates will enter this code during their registration to join <strong style={{ color: "rgba(255,255,255,0.8)" }}>{name.trim()}&apos;s Team</strong>.
                        </p>
                      </div>
                    )}

                  </StepTransition>
                </div>
              )}

              {/* Bottom nav — hidden on type step first visit and on final screen */}
              {!completed && !(currentStep === "type" && !typeStepRevisited) && !isFinalScreen && (
                <div className="flex items-center py-[24px] lg:py-[32px] w-full sticky bottom-0 bg-transparent lg:bg-gradient-to-b lg:from-transparent lg:to-black">
                  <button onClick={() => canContinue && goForward()}
                    disabled={!canContinue}
                    className="press-scale flex items-center justify-center w-full py-[12px] rounded-[10px]"
                    style={{ ...ctaStyle(canContinue), transitionProperty: "background, box-shadow", transitionDuration: "200ms", transitionTimingFunction: EASE_OUT_QUINT }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                      color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      Continue
                    </span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Payment modal (Razorpay placeholder) ── */}
      {showPaymentModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          animation: "payFadeIn 200ms ease-out",
        }}>
          <div style={{
            width: "100%", maxWidth: "400px", padding: "40px 32px",
            borderRadius: "20px",
            background: "rgba(20,20,20,0.95)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.6)",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "24px", textAlign: "center",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px",
            }}>
              💳
            </div>
            <div className="flex flex-col gap-[8px]">
              <h3 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "20px", color: "#fff", margin: 0 }}>
                Complete Payment
              </h3>
              <p style={{ fontFamily: gilroy, fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
                ₹{PRICE_PER_SEAT} for {memberCount} {memberCount === 1 ? "attendee" : "attendees"}
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "4px" }}>
                <Lock size={11} color="rgba(255,255,255,0.3)" strokeWidth={2} />
                <span style={{ fontFamily: gilroy, fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                  Secured by Razorpay
                </span>
              </div>
            </div>
            <button
              onClick={onPaymentDone}
              className="press-scale flex items-center justify-center w-full py-[14px] rounded-[12px]"
              style={{ ...ctaStyle(true), cursor: "pointer", border: "none" }}>
              <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px", color: "#fff" }}>
                Payment Done &mdash; Continue
              </span>
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes payFadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}
