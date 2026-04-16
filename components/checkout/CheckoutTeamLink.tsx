"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, Copy, Check, Clock, ExternalLink, Lock, Info } from "lucide-react";

import { useCheckoutCountdown } from "@/lib/hooks";
import SidebarSwitch from "./SidebarSwitch";
import { MaterialInput } from "./MaterialInput";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

const PRICE_PER_SEAT = 974;

type JoinType = "solo" | "team" | null;

/* ── generate a unique link token ── */
function generateLinkToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 12; i++) token += chars[Math.floor(Math.random() * chars.length)];
  return token;
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

/* ── Expiry countdown ── */
function ExpiryTimer({ hours = 48 }: { hours?: number }) {
  const [secsLeft, setSecsLeft] = useState(hours * 3600);

  useEffect(() => {
    const interval = setInterval(() => setSecsLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(secsLeft / 3600);
  const m = Math.floor((secsLeft % 3600) / 60);
  const s = secsLeft % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
      padding: "10px 14px", borderRadius: "10px",
      background: "rgba(251,191,36,0.06)",
      boxShadow: "inset 0 0 0 1px rgba(251,191,36,0.15)",
    }}>
      <Clock size={14} color="rgba(251,191,36,0.8)" />
      <span style={{ fontFamily: monoFont, fontSize: "13px", fontWeight: 600, color: "rgba(251,191,36,0.9)", fontVariantNumeric: "tabular-nums" }}>
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
      <span style={{ fontFamily: gilroy, fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
        before this link expires
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Checkout Team Link — Main Component
   ════════════════════════════════════════════════════════════════════════ */

export default function CheckoutTeamLink({ sidebarVariant = "v11" }: { sidebarVariant?: string }) {
  const countdown = useCheckoutCountdown();

  // Form state
  const [joinType, setJoinType] = useState<JoinType>(null);
  const [typeStepRevisited, setTypeStepRevisited] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [completed, setCompleted] = useState(false);
  const [linkToken, setLinkToken] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Steps
  type StepId = "type" | "info" | "phone" | "share-link";
  const steps: StepId[] = joinType === "team"
    ? ["type", "info", "phone", "share-link"]
    : ["type", "info", "phone"];

  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const isLastStep = stepIdx === steps.length - 1;
  const progress = steps.length <= 1 ? 5 : Math.max(5, (stepIdx / (steps.length - 1)) * 100);
  const memberCount = joinType === "team" ? 2 : 1;

  const canContinue = (() => {
    if (currentStep === "type") return joinType !== null;
    if (currentStep === "info") return name.trim().length > 0 && email.trim().length > 0 && email.includes("@");
    if (currentStep === "phone") return phone.trim().length >= 10;
    if (currentStep === "share-link") return true;
    return false;
  })();

  const goBack = () => {
    const next = Math.max(0, stepIdx - 1);
    if (next === 0) setTypeStepRevisited(true);
    setStepIdx(next);
  };
  const goForward = () => {
    // Phone step triggers payment for both solo and team
    if (currentStep === "phone") {
      setShowPaymentModal(true);
      return;
    }
    // share-link "Complete Registration" completes
    if (isLastStep) {
      setCompleted(true);
    } else {
      setStepIdx(prev => prev + 1);
    }
  };

  const onPaymentDone = () => {
    setShowPaymentModal(false);
    if (joinType === "team") {
      // After payment, show the share-link step
      setStepIdx(prev => prev + 1);
    } else {
      // Solo: payment completes registration
      setCompleted(true);
    }
  };

  // Generate link token when reaching share-link step
  useEffect(() => {
    if (currentStep === "share-link" && !linkToken) {
      setLinkToken(generateLinkToken());
    }
  }, [currentStep, linkToken]);

  const teamLink = linkToken ? `${typeof window !== "undefined" ? window.location.origin : ""}/join/${linkToken}` : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(teamLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
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
  }, [canContinue, completed, isLastStep, showPaymentModal]);

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
        <p style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: "320px" }}>
          Registration complete. Check your email for confirmation details.
        </p>
      </div>
    );
  }

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

      <div className="relative z-10 w-full max-w-[1000px] px-[16px] lg:px-[40px]">
        <div className="relative flex flex-col lg:flex-row items-stretch lg:items-start lg:justify-between w-full lg:overflow-hidden lg:h-[720px]"
          style={{ minHeight: "450px", padding: "32px 0 16px" }}>

          {/* Progress bar row: [back (mobile)] [progress] [close] */}
          <div className="absolute left-0 right-0 flex items-center gap-[12px] px-[16px] pb-[32px] z-10" style={{ top: "40px" }}>
            {/* Back icon — mobile only, inline with progress bar */}
            {stepIdx > 0 && !completed ? (
              <button onClick={goBack} className="flex lg:hidden items-center justify-center shrink-0"
                style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)", border: "none", cursor: "pointer" }}
                aria-label="Back">
                <ChevronLeft className="size-[14px] text-white" />
              </button>
            ) : null}
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

          {/* Sidebar — hidden on mobile to keep the form focal */}
          <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={memberCount} className="hidden lg:block mt-[80px]" />

          {/* Form column */}
          <div className="flex flex-col items-start shrink-0 lg:overflow-auto pt-[80px] px-0 lg:px-[8px] w-full lg:w-[493px] lg:h-[680px]">
            <div className="flex flex-col w-full h-full">

              {/* Back button — desktop only (mobile uses icon in progress bar row) */}
              {stepIdx > 0 && !completed && (
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

                    {/* Step: Join type */}
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

                    {/* Step: Share team link */}
                    {currentStep === "share-link" && (
                      <div className="flex flex-col gap-[20px]">
                        <QLabel>Share this link with your teammates</QLabel>

                        {/* Team identity — left-aligned, no container */}
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
                            background: "rgba(180,190,200,0.18)",
                            boxShadow: "0 0 0 1px rgba(200,210,220,0.14)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Image src="/images/silver01.png" alt="" width={34} height={34} style={{ objectFit: "contain", borderRadius: "50%" }} />
                          </div>
                          <div>
                            <p style={{ fontFamily: gilroy, fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 2px" }}>Your team</p>
                            <h3 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "17px", color: "#fff", margin: 0 }}>
                              {name.trim() || "Your"}&apos;s Team
                            </h3>
                          </div>
                        </div>

                        {/* Link field with inline copy icon button */}
                        <div style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "12px 12px 12px 16px", borderRadius: "12px", width: "100%",
                          background: "rgba(255,255,255,0.04)",
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                        }}>
                          <ExternalLink size={14} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
                          <span style={{
                            fontFamily: monoFont, fontSize: "12px", color: "rgba(255,255,255,0.65)",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
                            userSelect: "all",
                          }}>
                            {teamLink}
                          </span>
                          {/* Inline copy icon button with animated icon swap */}
                          <button onClick={copyLink}
                            style={{
                              width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0,
                              background: linkCopied ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.06)",
                              boxShadow: linkCopied ? "inset 0 0 0 1px rgba(52,211,153,0.25)" : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                              border: "none", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              position: "relative", overflow: "hidden",
                              transition: "background 0.2s ease, box-shadow 0.2s ease",
                            }}>
                            {/* Copy icon — exits with scale-down + blur */}
                            <Copy size={15} color="rgba(255,255,255,0.55)" style={{
                              position: "absolute",
                              opacity: linkCopied ? 0 : 1,
                              transform: linkCopied ? "scale(0.25)" : "scale(1)",
                              filter: linkCopied ? "blur(4px)" : "blur(0px)",
                              transition: `opacity 200ms cubic-bezier(0.2,0,0,1), transform 200ms cubic-bezier(0.2,0,0,1), filter 200ms cubic-bezier(0.2,0,0,1)`,
                            }} />
                            {/* Check icon — enters with scale-up + blur clear */}
                            <Check size={15} color="#34d399" style={{
                              position: "absolute",
                              opacity: linkCopied ? 1 : 0,
                              transform: linkCopied ? "scale(1)" : "scale(0.25)",
                              filter: linkCopied ? "blur(0px)" : "blur(4px)",
                              transition: `opacity 200ms cubic-bezier(0.2,0,0,1), transform 200ms cubic-bezier(0.2,0,0,1), filter 200ms cubic-bezier(0.2,0,0,1)`,
                            }} />
                          </button>
                        </div>

                        {/* Copied confirmation — appears below the field */}
                        <div style={{
                          height: "20px",
                          opacity: linkCopied ? 1 : 0,
                          transform: linkCopied ? "translateY(0)" : "translateY(-4px)",
                          transition: `opacity 200ms ${EASE_OUT_QUINT}, transform 200ms ${EASE_OUT_QUINT}`,
                        }}>
                          <span style={{ fontFamily: gilroy, fontSize: "12px", fontWeight: 600, color: "#34d399" }}>
                            Link copied to clipboard
                          </span>
                        </div>

                        {/* Expiry timer */}
                        <ExpiryTimer hours={48} />

                        {/* Share-now callout — neutral white theme with info icon */}
                        <div style={{
                          display: "flex", alignItems: "flex-start", gap: "12px",
                          padding: "16px 18px", borderRadius: "12px",
                          background: "rgba(255,255,255,0.04)",
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                        }}>
                          <Info size={16} color="rgba(255,255,255,0.5)" strokeWidth={2} style={{ flexShrink: 0, marginTop: "2px" }} />
                          <div>
                            <p style={{ fontFamily: gilroy, fontSize: "14px", fontWeight: 700, color: "#fff", margin: 0 }}>
                              Share this link now
                            </p>
                            <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.55)", margin: "4px 0 0", lineHeight: 1.5, textWrap: "pretty" as React.CSSProperties["textWrap"] }}>
                              Teammates open this link to register and automatically join your team.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  </StepTransition>
                </div>
              )}

              {/* Bottom nav — hidden on type step first visit (auto-advances) */}
              {!completed && !(currentStep === "type" && !typeStepRevisited) && (
                <div className="flex items-center py-[24px] lg:py-[32px] w-full sticky bottom-0 bg-transparent lg:bg-gradient-to-b lg:from-transparent lg:to-black">
                  <button onClick={() => canContinue && goForward()}
                    disabled={!canContinue}
                    className="press-scale flex items-center justify-center w-full py-[12px] rounded-[10px]"
                    style={{ ...ctaStyle(canContinue), transition: "background 0.2s ease, box-shadow 0.2s ease" }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                      color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {currentStep === "share-link"
                        ? "Complete Registration"
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
