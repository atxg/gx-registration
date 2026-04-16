"use client";

/**
 * V4 — Split Screen
 * Left half: constant sidebar.
 * Right half: multi-step form.
 */

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, Plus, ChevronLeft, Trash2 } from "lucide-react";

import { useCheckoutCountdown } from "@/lib/hooks";
import SidebarSwitch from "./SidebarSwitch";
import { MaterialInput, MaterialTextarea } from "./MaterialInput";
import { useAccentColor } from "./InputStyleContext";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

const ROLES = ["Builder", "Designer", "PM", "Marketer", "Investor", "Other"];

type JoinType = "solo" | "team" | null;
type StepId = "type" | "team" | "personal" | "project";
interface Teammate { id: string; email: string; role: string; }

/* #1-A: Step transition with exit animation */
function StepTransition({ children, stepKey }: { children: React.ReactNode; stepKey: string }) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const [displayKey, setDisplayKey] = useState(stepKey);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (stepKey !== displayKey) {
      setPhase("exit");
      const exitTimer = setTimeout(() => {
        setDisplayKey(stepKey);
        setDisplayChildren(children);
        setPhase("enter");
        requestAnimationFrame(() => { requestAnimationFrame(() => setPhase("visible")); });
      }, 150);
      return () => clearTimeout(exitTimer);
    } else {
      setDisplayChildren(children);
    }
  }, [stepKey, children, displayKey]);

  useEffect(() => {
    if (phase === "enter") {
      requestAnimationFrame(() => { requestAnimationFrame(() => setPhase("visible")); });
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

/* #2-A: Animated teammate chip */
function TeammateChip({ email, onRemove }: { email: string; onRemove: () => void }) {
  const [visible, setVisible] = useState(false);
  const [removing, setRemoving] = useState(false);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, []);
  const handleRemove = () => { setRemoving(true); setTimeout(onRemove, 150); };
  return (
    <div style={{
      padding: "6px 12px", borderRadius: "100px",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", gap: "8px",
      opacity: visible && !removing ? 1 : 0,
      transform: visible && !removing ? "scale(1)" : "scale(0.9)",
      transition: removing
        ? `opacity 150ms ${EASE_OUT_QUINT}, transform 150ms ${EASE_OUT_QUINT}`
        : `opacity 200ms ${EASE_OUT_QUINT}, transform 200ms ${EASE_OUT_QUINT}`,
    }}>
      <span style={{ fontFamily: gilroy, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.9)" }}>{email}</span>
      <button onClick={handleRemove}
        className="hover-bright"
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "8px", margin: "-6px", borderRadius: "50%" }}>
        <X size={14} color="rgba(255,255,255,0.6)" />
      </button>
    </div>
  );
}

function QLabel({ children, required, sub }: { children: React.ReactNode; required?: boolean; sub?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
      <h3 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "17px", color: "#fff", margin: 0, textWrap: "balance" }}>
        {children}
        {required && <span style={{ fontFamily: monoFont, fontWeight: 400, fontSize: "14px", marginLeft: "4px", color: "rgba(255,255,255,0.6)" }}>*</span>}
      </h3>
      {sub && <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.65)", margin: 0, fontWeight: 400, textWrap: "pretty" }}>{sub}</p>}
    </div>
  );
}

function RolePills({ selected, onSelect, small }: { selected: string; onSelect: (r: string) => void; small?: boolean }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const handleSelect = (r: string) => { onSelect(r); setJustSelected(r); setTimeout(() => setJustSelected(null), 200); };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: small ? "6px" : "8px" }}>
      {ROLES.map((r) => {
        const active = r === selected;
        const popping = r === justSelected;
        return (
          <button key={r} onClick={() => handleSelect(r)} className="press-scale" style={{
            padding: small ? "5px 13px" : "7px 18px", borderRadius: "100px", border: "none",
            boxShadow: active ? "0 0 0 1px " + BLUE + ", 0 1px 3px rgba(0,0,0,0.2)" : "inset 0 0 0 1px rgba(255,255,255,0.12)",
            background: active ? `rgba(${BLUE_RGB},0.15)` : "transparent",
            color: active ? BLUE : "rgba(255,255,255,0.65)",
            fontSize: small ? "12px" : "13px", fontFamily: gilroy, fontWeight: active ? 600 : 400,
            cursor: "pointer",
            transition: `background 0.12s ease, box-shadow 0.12s ease, color 0.12s ease, transform 200ms ${EASE_OUT_QUINT}`,
            transform: popping ? "scale(1.04)" : "scale(1)", minHeight: "40px",
          }}>{r}</button>
        );
      })}
    </div>
  );
}

function StepType({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  return (
    <div>
      <QLabel>How are you joining?</QLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {([["solo", "Going solo", "₹974"], ["team", "Building a team", "₹974 per member"]] as const).map(([id, label, price]) => {
          const active = selected === id;
          return (
            <button key={id} onClick={() => onSelect(id)} className="press-scale" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", borderRadius: "10px", textAlign: "left", border: "none",
              boxShadow: active ? `0 0 0 1px rgba(${BLUE_RGB},0.4), 0 2px 8px rgba(0,0,0,0.2)` : "inset 0 0 0 1px rgba(255,255,255,0.1)",
              background: active ? `rgba(${BLUE_RGB},0.1)` : "rgba(255,255,255,0.03)",
              cursor: "pointer", transition: "background 0.15s ease, box-shadow 0.15s ease",
            }}>
              <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px", color: active ? "#fff" : "rgba(255,255,255,0.9)" }}>{label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontFamily: monoFont, fontSize: "11px", color: active ? "#ffbc35" : "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>{price}</span>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%",
                  border: `2px solid ${active ? BLUE : "rgba(255,255,255,0.2)"}`,
                  background: active ? BLUE : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 0.15s ease, background 0.15s ease" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff",
                    transform: active ? "scale(1)" : "scale(0)",
                    transition: `transform 200ms ${EASE_OUT_QUINT}` }} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepTeam({ teamName, setTeamName, myRole, setMyRole, teammates, setTeammates, buttonStyle }: {
  teamName: string; setTeamName: (v: string) => void;
  myRole: string; setMyRole: (v: string) => void;
  teammates: Teammate[]; setTeammates: React.Dispatch<React.SetStateAction<Teammate[]>>;
  buttonStyle: string;
}) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const [emailInput, setEmailInput] = useState("");
  const add = () => {
    if (!emailInput.trim().includes("@") || teammates.length >= 6) return;
    setTeammates((prev) => [...prev, { id: Date.now().toString(), email: emailInput.trim(), role: "" }]);
    setEmailInput("");
  };

  const getButtonStyle = () => {
    if (buttonStyle === "secondary") {
      return { background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)", color: "#fff" };
    }
    if (buttonStyle === "ghost") {
      return { background: "transparent", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)" };
    }
    return { background: `rgba(${BLUE_RGB},0.15)`, boxShadow: `inset 0 0 0 1px rgba(${BLUE_RGB},0.4)`, color: BLUE };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <MaterialInput label="Team name" required value={teamName} onChange={setTeamName} />
      <div><QLabel required>Your role</QLabel><RolePills selected={myRole} onSelect={setMyRole} /></div>
      <div>
        <QLabel sub="Max 6 teammates allowed. Each member adds ₹974 to the total.">Invite teammates</QLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
          {/* Teammate list (now above input) */}
          {teammates.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
              {teammates.map((t) => (
                <TeammateChip key={t.id} email={t.email}
                  onRemove={() => setTeammates((prev) => prev.filter((x) => x.id !== t.id))} />
              ))}
            </div>
          )}

          <MaterialInput label="Teammate email" type="email" value={emailInput}
            onChange={setEmailInput} onEnter={add} disabled={teammates.length >= 6} />

          <button onClick={add}
            disabled={!emailInput.trim().includes("@") || teammates.length >= 6}
            className="press-scale"
            style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "none", ...getButtonStyle(),
              fontFamily: gilroy, fontSize: "14px", fontWeight: 600,
              cursor: emailInput.trim().includes("@") && teammates.length < 6 ? "pointer" : "default",
              transition: "background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              opacity: emailInput.trim().includes("@") && teammates.length < 6 ? 1 : 0.4,
            }}>
            <Plus size={16} />
            Add Teammate
          </button>
        </div>
      </div>
    </div>
  );
}

function StepPersonal({ name, setName, email, setEmail, phone, setPhone, role, setRole }: {
  name: string; setName: (v: string) => void; email: string; setEmail: (v: string) => void;
  phone: string; setPhone: (v: string) => void; role: string; setRole: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <MaterialInput label="Your name" required value={name} onChange={setName} />
      <MaterialInput label="Email address" required type="email" value={email} onChange={setEmail} />
      <MaterialInput label="Phone number" required type="tel" value={phone} onChange={setPhone} />
      <div><QLabel required>What best describes you?</QLabel><RolePills selected={role} onSelect={setRole} /></div>
    </div>
  );
}

const PROJECT_QS = [
  { id: "q1", label: "Any side project or buildathon you've worked on? What did you build?", sub: "Share a link.", required: true },
  { id: "q2", label: "What's one problem you think should have already been solved using AI – but still hasn't?", sub: "", required: true },
];

function StepProject({ answers, setAnswers }: { answers: Record<string, string>; setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {PROJECT_QS.map((q) => (
        <MaterialTextarea
          key={q.id}
          label={q.label}
          required={q.required}
          helper={q.sub}
          value={answers[q.id] ?? ""}
          onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
        />
      ))}
    </div>
  );
}

/* #9-C: Completion + Confetti */
function CompletionScreen() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, []);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "16px", padding: "60px 20px", textAlign: "center", flex: 1,
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

function ConfettiCanvas({ active }: { active: boolean }) {
  const { hex: BLUE } = useAccentColor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2, 2);
    const colors = [BLUE, "#ffbc35", "#8bc68a", "#ff6b8a", "#a78bfa", "#fff"];
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; rotation: number; vr: number; opacity: number }[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({ x: canvas.offsetWidth / 2, y: canvas.offsetHeight / 2,
        vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.8) * 10,
        size: Math.random() * 6 + 3, color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360, vr: (Math.random() - 0.5) * 10, opacity: 1 });
    }
    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx; p.vy += 0.3; p.y += p.vy; p.vx *= 0.98; p.rotation += p.vr; p.opacity -= 0.008;
        if (p.opacity <= 0) continue; alive = true;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity); ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); ctx.restore();
      }
      if (alive) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }} />;
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function CheckoutV4Split({ teammateButtonStyle = "primary", sidebarVariant = "v1" }: { teammateButtonStyle?: string; sidebarVariant?: string }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const countdown = useCheckoutCountdown();
  const [joinType, setJoinType] = useState<JoinType>(null);
  const [teamName, setTeamName] = useState("");
  const [myRole, setMyRole] = useState("");
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({ q1: "", q2: "" });
  const [completed, setCompleted] = useState(false);

  const steps: StepId[] = joinType === "team" ? ["type", "team", "personal", "project"] : ["type", "personal", "project"];
  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const isLast = stepIdx === steps.length - 1;

  const memberCount = joinType === "team" ? teammates.length + 1 : 1;

  const canContinue = (() => {
    if (currentStep === "type") return joinType !== null;
    if (currentStep === "team") return teamName.trim().length > 0 && myRole.length > 0;
    if (currentStep === "personal") return !!(name.trim() && email.trim().includes("@") && phone.trim() && role);
    if (currentStep === "project") return PROJECT_QS.every((q) => answers[q.id]?.trim().length > 0);
    return false;
  })();

  const goBack = () => setStepIdx(p => Math.max(0, p - 1));
  const goForward = () => isLast ? setCompleted(true) : setStepIdx(p => p + 1);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000", position: "relative" }}>
      <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.65)}`}</style>

      <div style={{ flex: 1, display: "flex" }}>

        <div style={{ flex: "0 0 45%", background: "#050505",
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={memberCount} />
        </div>

        <div style={{ flex: "1", padding: "80px 100px", display: "flex", flexDirection: "column", position: "relative" }}>
          <ConfettiCanvas active={completed} />

          {completed ? (
            <CompletionScreen />
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "60px" }}>
                {stepIdx > 0 ? (
                  <button onClick={goBack} className="hover-bright" style={{ display: "flex", alignItems: "center", gap: "8px",
                    color: "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer",
                    fontFamily: monoFont, fontSize: "12px", padding: 0, minHeight: "40px" }}>
                    <ChevronLeft size={16} />
                    BACK
                  </button>
                ) : <div />}
                <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center",
                  width: "44px", height: "44px", borderRadius: "50%",
                  color: "rgba(255,255,255,0.4)", transition: "color 0.2s ease" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
                  onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                  <X size={24} />
                </Link>
              </div>

              <div style={{ flex: 1, maxWidth: "500px" }}>
                <StepTransition stepKey={currentStep}>
                  {currentStep === "type" && <StepType selected={joinType} onSelect={setJoinType} />}
                  {currentStep === "team" && <StepTeam teamName={teamName} setTeamName={setTeamName}
                    myRole={myRole} setMyRole={setMyRole} teammates={teammates} setTeammates={setTeammates}
                    buttonStyle={teammateButtonStyle} />}
                  {currentStep === "personal" && <StepPersonal name={name} setName={setName}
                    email={email} setEmail={setEmail} phone={phone} setPhone={setPhone} role={role} setRole={setRole} />}
                  {currentStep === "project" && <StepProject answers={answers} setAnswers={setAnswers} />}
                </StepTransition>
              </div>

              {/* #5-A: Progress bar with ease-out-quint */}
              <div style={{ marginTop: "60px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ height: "2px", background: "rgba(255,255,255,0.06)", width: "100%", position: "relative" }}>
                  <div style={{ position: "absolute", inset: "0 auto 0 0", background: BLUE,
                    width: `${((stepIdx + 1) / steps.length) * 100}%`, transition: `width 0.4s ${EASE_OUT_QUINT}` }} />
                </div>
                <button onClick={() => canContinue && goForward()}
                  disabled={!canContinue}
                  className="press-scale"
                  style={{
                    width: "100%", padding: "16px", borderRadius: "12px",
                    background: canContinue ? BLUE : "rgba(255,255,255,0.08)",
                    color: canContinue ? "#fff" : "rgba(255,255,255,0.4)",
                    border: "none", cursor: canContinue ? "pointer" : "default",
                    fontFamily: gilroy, fontWeight: 700, fontSize: "16px",
                    transition: "background 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: canContinue ? `0 4px 32px rgba(${BLUE_RGB},0.3)` : "none"
                  }}>
                  {isLast ? "Complete Registration" : "Continue"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
