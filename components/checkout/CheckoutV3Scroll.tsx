"use client";

/**
 * V3 — Scroll Form
 * Refactored to include a constant sidebar for consistency.
 * All sections visible on one page. Scroll to complete.
 */

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, Plus, Trash2, Check, ChevronLeft } from "lucide-react";

import { useCheckoutCountdown } from "@/lib/hooks";
import SidebarSwitch from "./SidebarSwitch";
import { MaterialInput, MaterialTextarea } from "./MaterialInput";
import { useAccentColor } from "./InputStyleContext";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const serifFont = "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

const ROLES = ["Builder", "Designer", "PM", "Marketer", "Investor", "Other"];
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

type JoinType = "solo" | "team" | null;
interface Teammate { id: string; email: string; role: string; }

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

function SectionLabel({ n, label }: { n: string; label: string }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
      <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: `rgba(${BLUE_RGB},0.15)`,
        boxShadow: `inset 0 0 0 1px rgba(${BLUE_RGB},0.25)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: monoFont, fontSize: "10px", color: BLUE, fontWeight: 600 }}>{n}</span>
      </div>
      <span style={{ fontFamily: monoFont, fontSize: "11px", color: "rgba(255,255,255,0.6)",
        letterSpacing: "2px", textTransform: "uppercase" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <label style={{ fontFamily: gilroy, fontSize: "13px", fontWeight: 600,
        color: "rgba(255,255,255,0.65)", letterSpacing: "0.3px" }}>
        {label}{required && <span style={{ fontFamily: monoFont, fontWeight: 400, fontSize: "12px", marginLeft: "4px", color: "rgba(255,255,255,0.6)" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function QLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <h3 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px", color: "#fff", margin: 0, textWrap: "balance" }}>
      {children}
      {required && <span style={{ fontFamily: monoFont, fontWeight: 400, fontSize: "12px", marginLeft: "4px", color: "rgba(255,255,255,0.6)" }}>*</span>}
    </h3>
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
            padding: small ? "5px 14px" : "7px 18px", borderRadius: "100px", border: "none",
            boxShadow: active ? "0 0 0 1px " + BLUE + ", 0 1px 3px rgba(0,0,0,0.2)" : "inset 0 0 0 1px rgba(255,255,255,0.12)",
            background: active ? `rgba(${BLUE_RGB},0.15)` : "transparent",
            color: active ? BLUE : "rgba(255,255,255,0.6)",
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

/* #9-C: Completion + Confetti */
function CompletionScreen() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, []);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "16px", padding: "80px 20px", textAlign: "center",
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
      particles.push({ x: canvas.offsetWidth / 2, y: canvas.offsetHeight / 3,
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
  }, [active, BLUE]);
  if (!active) return null;
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 60 }} />;
}

export default function CheckoutV3Scroll({ teammateButtonStyle = "primary", sidebarVariant = "v1", headerStyle = "v1" }: { teammateButtonStyle?: string; sidebarVariant?: string; headerStyle?: string }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const countdown = useCheckoutCountdown();
  const [joinType, setJoinType] = useState<JoinType>(null);
  const [teamName, setTeamName] = useState("");
  const [myTeamRole, setMyTeamRole] = useState("");
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");

  const memberCount = joinType === "team" ? teammates.length + 1 : 1;

  const addTeammate = () => {
    const email = emailInput.trim();
    if (!email.includes("@") || teammates.length >= 6) return;
    setTeammates((prev) => [...prev, { id: Date.now().toString(), email, role: "" }]);
    setEmailInput("");
  };

  const getButtonStyle = () => {
    if (teammateButtonStyle === "secondary") {
      return { background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)", color: "#fff" };
    }
    if (teammateButtonStyle === "ghost") {
      return { background: "transparent", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.65)" };
    }
    return { background: `rgba(${BLUE_RGB},0.15)`, boxShadow: `inset 0 0 0 1px rgba(${BLUE_RGB},0.4)`, color: BLUE };
  };

  const [completed, setCompleted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allFilled =
    joinType !== null &&
    name.trim() && email.trim().includes("@") && phone.trim() && role &&
    q1.trim() && q2.trim() &&
    (joinType === "solo" || (teamName.trim() && myTeamRole));

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#000", color: "white" }}>
      <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.45)}`}</style>

      <ConfettiCanvas active={completed} />

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "200px",
        background: "radial-gradient(ellipse at 50% -20%, rgba(0,50,180,0.2) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0 }} />

      {/* ── Header V1: Minimal — just close button ── */}
      {headerStyle === "v1" && (
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(20px)",
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px",
            display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <Link href="/" className="hover-bright" style={{ display: "flex", alignItems: "center", justifyContent: "center",
              width: "44px", height: "44px", borderRadius: "50%", flexShrink: 0 }}
              aria-label="Close">
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center",
                width: "32px", height: "32px", borderRadius: "50%",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)", color: "white" }}>
                <X size={14} />
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* ── Header V2: Full-width progress bar + close ── */}
      {headerStyle === "v2" && (
        <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
          {/* Full viewport-width progress bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.06)" }}>
            <div style={{
              height: "100%", background: BLUE,
              width: `${scrollProgress * 100}%`,
              transition: "width 0.1s linear",
              boxShadow: `0 0 8px rgba(${BLUE_RGB},0.4)`,
            }} />
          </div>
          <div style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: monoFont, fontSize: "11px", color: "rgba(255,255,255,0.45)",
                letterSpacing: "1px", textTransform: "uppercase", fontVariantNumeric: "tabular-nums" }}>
                {Math.round(scrollProgress * 100)}% complete
              </span>
              <Link href="/" className="hover-bright" style={{ display: "flex", alignItems: "center", justifyContent: "center",
                width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0 }}
                aria-label="Close">
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center",
                  width: "32px", height: "32px", borderRadius: "50%",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)", color: "white" }}>
                  <X size={14} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 200px",
        display: "flex", gap: "80px", position: "relative", zIndex: 1 }}>

        <div style={{ position: "sticky", top: "100px", height: "fit-content" }}>
          <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={memberCount} />
        </div>

        <div style={{ flex: 1, maxWidth: "600px" }}>

          {completed ? (
            <CompletionScreen />
          ) : (
            <>
              {joinType !== null && (
                <button onClick={() => setJoinType(null)}
                  className="flex items-center gap-1 mb-10 text-[12px] text-white/60 hover:text-white transition-colors"
                  style={{ fontFamily: monoFont, background: "none", border: "none", cursor: "pointer", minHeight: "40px" }}>
                  <ChevronLeft size={14} />
                  <span>BACK TO TYPE</span>
                </button>
              )}

              {/* Section 1: Registration Type */}
              <div style={{ marginBottom: "52px" }}>
                <SectionLabel n="1" label="Registration type" />
                <div style={{ display: "flex", gap: "24px" }}>
                  {([["solo", "Solo", "₹974"] , ["team", "Team", "₹974 / person"]] as const).map(([id, label, price]) => {
                    const active = joinType === id;
                    return (
                      <button key={id} onClick={() => setJoinType(id)} className="press-scale" style={{
                        flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
                        gap: "6px", padding: "18px 20px", borderRadius: "12px", textAlign: "left",
                        border: "none",
                        boxShadow: active ? "0 0 0 1px " + BLUE + ", 0 2px 8px rgba(0,0,0,0.2)" : "inset 0 0 0 1px rgba(255,255,255,0.1)",
                        background: active ? `rgba(${BLUE_RGB},0.1)` : "rgba(255,255,255,0.03)",
                        cursor: "pointer", transition: "background 0.15s ease, box-shadow 0.15s ease",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                          <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px", color: active ? "#fff" : "rgba(255,255,255,0.9)" }}>{label}</span>
                          {/* #4-A: Check icon with scale */}
                          <Check size={14} color={BLUE} style={{
                            transform: active ? "scale(1)" : "scale(0)",
                            opacity: active ? 1 : 0,
                            transition: `transform 200ms ${EASE_OUT_QUINT}, opacity 200ms ${EASE_OUT_QUINT}`,
                          }} />
                        </div>
                        <span style={{ fontFamily: monoFont, fontSize: "11px", color: active ? "#ffbc35" : "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>
                          {price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* #7-A: Team section with grid-row height animation */}
              <div style={{
                display: "grid",
                gridTemplateRows: joinType === "team" ? "1fr" : "0fr",
                transition: `grid-template-rows 0.4s ${EASE_OUT_QUINT}`,
              }}>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ marginBottom: "52px" }}>
                    <SectionLabel n="2" label="Team details" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                      <MaterialInput label="Team name" required value={teamName} onChange={setTeamName} />
                      <Field label="Your role" required>
                        <RolePills selected={myTeamRole} onSelect={setMyTeamRole} />
                      </Field>
                      <div>
                        <QLabel>Invite teammates</QLabel>
                        <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "16px", marginTop: "4px", textWrap: "pretty" }}>
                          Max 6 teammates allowed. Each adds ₹974.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
                          {teammates.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                              {teammates.map((t) => (
                                <TeammateChip key={t.id} email={t.email}
                                  onRemove={() => setTeammates((prev) => prev.filter((x) => x.id !== t.id))} />
                              ))}
                            </div>
                          )}
                          <MaterialInput label="Teammate email" type="email" value={emailInput}
                            onChange={setEmailInput} onEnter={addTeammate} disabled={teammates.length >= 6} />
                          <button onClick={addTeammate}
                            disabled={!emailInput.trim().includes("@") || teammates.length >= 6}
                            className="press-scale"
                            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", ...getButtonStyle(),
                              fontFamily: gilroy, fontSize: "15px", fontWeight: 600,
                              cursor: emailInput.trim().includes("@") && teammates.length < 6 ? "pointer" : "default",
                              transition: "background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                              opacity: emailInput.trim().includes("@") && teammates.length < 6 ? 1 : 0.4 }}>
                            <Plus size={16} /> Add Teammate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Your Details */}
              <div style={{ marginBottom: "52px" }}>
                <SectionLabel n={joinType === "team" ? "3" : "2"} label="Your details" />
                <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                  <MaterialInput label="Your name" required value={name} onChange={setName} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <MaterialInput label="Email address" required type="email" value={email} onChange={setEmail} />
                    <MaterialInput label="Phone number" required type="tel" value={phone} onChange={setPhone} />
                  </div>
                  <Field label="What best describes you?" required>
                    <RolePills selected={role} onSelect={setRole} />
                  </Field>
                </div>
              </div>

              {/* Section 4: Your work */}
              <div style={{ marginBottom: "52px" }}>
                <SectionLabel n={joinType === "team" ? "4" : "3"} label="Your work" />
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <MaterialTextarea label="Any side project or buildathon you've worked on? What did you build?" required helper="Share a link." value={q1} onChange={setQ1} />
                  <MaterialTextarea label="What's one problem you think should have already been solved using AI – but still hasn't?" required value={q2} onChange={setQ2} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sticky footer */}
      {!completed && (
        <div style={{ position: "fixed", bottom: 80, left: 0, right: 0, zIndex: 50,
          background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)",
          boxShadow: "0 -1px 0 rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "16px 24px",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button onClick={() => allFilled && setCompleted(true)}
              disabled={!allFilled}
              className="press-scale"
              style={{
                padding: "12px 40px", borderRadius: "10px", width: "100%",
                background: allFilled ? BLUE : "rgba(255,255,255,0.1)",
                border: "none", cursor: allFilled ? "pointer" : "default",
                boxShadow: allFilled ? `0 0 28px rgba(${BLUE_RGB},0.3)` : "none",
                transition: "background 0.2s ease, box-shadow 0.2s ease",
              }}>
              <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                color: allFilled ? "#fff" : "rgba(255,255,255,0.45)" }}>
                Complete Registration
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
