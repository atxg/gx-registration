"use client";

/**
 * V2 — Immersive / Typeform
 * Refactored to include a constant sidebar for consistency.
 * Full-screen black canvas. One question dominates the viewport.
 */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, ArrowRight, ArrowLeft, Plus, Trash2, ChevronLeft } from "lucide-react";

import { useCheckoutCountdown } from "@/lib/hooks";
import SidebarSwitch from "./SidebarSwitch";
import { MaterialInput, MaterialTextarea } from "./MaterialInput";
import { useAccentColor } from "./InputStyleContext";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const serifFont = "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

const ROLES = ["Builder", "Designer", "PM", "Marketer", "Investor", "Other"];
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

type JoinType = "solo" | "team";

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
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setPhase("visible"));
        });
      }, 150);
      return () => clearTimeout(exitTimer);
    } else {
      setDisplayChildren(children);
    }
  }, [stepKey, children, displayKey]);

  useEffect(() => {
    if (phase === "enter") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("visible"));
      });
    }
  }, [phase]);

  const style: React.CSSProperties = {
    opacity: phase === "visible" ? 1 : 0,
    transform:
      phase === "exit" ? "translateY(-4px)" :
      phase === "enter" ? "translateY(8px)" :
      "translateY(0)",
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

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(onRemove, 150);
  };

  return (
    <div style={{
      padding: "8px 16px", borderRadius: "100px",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", gap: "10px",
      opacity: visible && !removing ? 1 : 0,
      transform: visible && !removing ? "scale(1)" : "scale(0.9)",
      transition: removing
        ? `opacity 150ms ${EASE_OUT_QUINT}, transform 150ms ${EASE_OUT_QUINT}`
        : `opacity 200ms ${EASE_OUT_QUINT}, transform 200ms ${EASE_OUT_QUINT}`,
    }}>
      <span style={{ fontFamily: gilroy, fontWeight: 500, fontSize: "15px", color: "rgba(255,255,255,0.9)" }}>
        {email}
      </span>
      <button onClick={handleRemove}
        className="hover-bright"
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "8px", margin: "-6px", borderRadius: "50%" }}>
        <X size={16} color="rgba(255,255,255,0.6)" />
      </button>
    </div>
  );
}

function RolePills({ selected, onSelect }: { selected: string; onSelect: (r: string) => void }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const [justSelected, setJustSelected] = useState<string | null>(null);

  const handleSelect = (r: string) => {
    onSelect(r);
    setJustSelected(r);
    setTimeout(() => setJustSelected(null), 200);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {ROLES.map((r) => {
        const active = r === selected;
        const popping = r === justSelected;
        return (
          <button key={r} onClick={() => handleSelect(r)}
            className="press-scale"
            style={{
              padding: "10px 22px", borderRadius: "100px",
              border: "none",
              boxShadow: active
                ? "0 0 0 1.5px " + BLUE + ", 0 1px 3px rgba(0,0,0,0.2)"
                : "inset 0 0 0 1.5px rgba(255,255,255,0.12)",
              background: active ? `rgba(${BLUE_RGB},0.18)` : "transparent",
              color: active ? BLUE : "rgba(255,255,255,0.65)",
              fontSize: "15px", fontFamily: gilroy, fontWeight: active ? 600 : 400,
              cursor: "pointer",
              transition: `background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease, transform 200ms ${EASE_OUT_QUINT}`,
              transform: popping ? "scale(1.04)" : "scale(1)",
              minHeight: "40px",
          }}>{r}</button>
        );
      })}
    </div>
  );
}

function QuestionLabel({ index, total, children }: { index: number; total: number; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontFamily: monoFont, fontSize: "12px", color: "rgba(255,255,255,0.45)", letterSpacing: "1px", fontVariantNumeric: "tabular-nums" }}>
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <h2 style={{ fontFamily: serifFont, fontSize: "clamp(24px, 4vw, 38px)", color: "#fff",
        lineHeight: 1.25, letterSpacing: "-0.5px", margin: 0, fontWeight: 400, textWrap: "balance" }}>
        {children}
      </h2>
    </div>
  );
}

/* #9-C: Completion screen */
function CompletionScreen() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "16px", padding: "60px 20px", textAlign: "center",
      opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.98)",
      transition: `opacity 300ms ${EASE_OUT_QUINT}, transform 300ms ${EASE_OUT_QUINT}`,
    }}>
      <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎉</div>
      <h2 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(24px, 4vw, 38px)", color: "#fff", margin: 0 }}>You&apos;re in!</h2>
      <p style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: "320px" }}>
        Registration complete. Check your email for confirmation details.
      </p>
    </div>
  );
}

/* #9-C: Confetti */
function ConfettiCanvas({ active }: { active: boolean }) {
  const { hex: BLUE } = useAccentColor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
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
        p.x += p.vx; p.vy += 0.3; p.y += p.vy; p.vx *= 0.98;
        p.rotation += p.vr; p.opacity -= 0.008;
        if (p.opacity <= 0) continue;
        alive = true;
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
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }} />;
}

export default function CheckoutV2Immersive({ teammateButtonStyle = "primary", sidebarVariant = "v1" }: { teammateButtonStyle?: string; sidebarVariant?: string }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const countdown = useCheckoutCountdown();

  const [joinType, setJoinType] = useState<JoinType | null>(null);
  const [teamName, setTeamName] = useState("");
  const [myRole, setMyRole] = useState("");
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [completed, setCompleted] = useState(false);

  type Screen = "join" | "team-name" | "team-role" | "team-invites" | "name" | "email" | "phone" | "role" | "q1" | "q2" | "done";
  const screens: Screen[] = joinType === "team"
    ? ["join", "team-name", "team-role", "team-invites", "name", "email", "phone", "role", "q1", "q2"]
    : ["join", "name", "email", "phone", "role", "q1", "q2"];

  const [screenIdx, setScreenIdx] = useState(0);
  const current = screens[screenIdx];
  const total = screens.length;
  const progress = total <= 1 ? 0 : (screenIdx / (total - 1)) * 100;

  const canAdvance = (() => {
    if (current === "join") return joinType !== null;
    if (current === "team-name") return teamName.trim().length > 0;
    if (current === "team-role") return myRole.length > 0;
    if (current === "team-invites") return true;
    if (current === "name") return name.trim().length > 0;
    if (current === "email") return email.trim().includes("@");
    if (current === "phone") return phone.trim().length > 6;
    if (current === "role") return role.length > 0;
    if (current === "q1") return q1.trim().length > 0;
    if (current === "q2") return q2.trim().length > 0;
    return false;
  })();

  const advance = () => {
    if (!canAdvance) return;
    if (screenIdx < screens.length - 1) setScreenIdx((i) => i + 1);
    else setCompleted(true);
  };

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

  const memberCount = joinType === "team" ? teammates.length + 1 : 1;

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", background: "#000", overflow: "hidden" }}>
      <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.45)} * { box-sizing: border-box; }`}</style>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "300px",
        background: "radial-gradient(ellipse at 30% 0%, rgba(0,60,200,0.15) 0%, transparent 70%)",
        pointerEvents: "none" }} />

      {/* #5-A: Progress bar with ease-out-quint */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px",
        boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
          <span style={{ fontFamily: monoFont, fontSize: "11px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
            {completed ? total : screenIdx + 1} / {total}
          </span>
          <div style={{ flex: 1, height: "2px", borderRadius: "1px", background: "rgba(255,255,255,0.1)", position: "relative" }}>
            <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${completed ? 100 : Math.max(3, progress)}%`,
              background: BLUE, borderRadius: "1px", transition: `width 0.4s ${EASE_OUT_QUINT}` }} />
          </div>
        </div>
        <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "32px",
          width: "44px", height: "44px", borderRadius: "50%" }}
          aria-label="Close">
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center",
            width: "36px", height: "36px", borderRadius: "50%",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)", color: "white", transition: "opacity 0.15s ease" }}>
            <X size={16} />
          </span>
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", padding: "120px 48px", maxWidth: "1200px", margin: "0 auto", gap: "80px", position: "relative" }}>

        <ConfettiCanvas active={completed} />
        <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={memberCount} />

        <div style={{ flex: 1, maxWidth: "600px" }}>

          {completed ? (
            <CompletionScreen />
          ) : (
            <>
              {screenIdx > 0 && (
                <button onClick={() => setScreenIdx(prev => prev - 1)}
                  className="flex items-center gap-1 mb-10 text-[12px] text-white/60 hover:text-white transition-colors"
                  style={{ fontFamily: monoFont, background: "none", border: "none", cursor: "pointer", minHeight: "40px" }}>
                  <ChevronLeft size={14} />
                  <span>BACK</span>
                </button>
              )}

              <StepTransition stepKey={current}>
                {current === "join" && (
                  <div style={{ width: "100%" }}>
                    <QuestionLabel index={screenIdx + 1} total={total}>How are you joining the buildathon?</QuestionLabel>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {([["solo", "Going solo", "₹974 — just you"], ["team", "Building a team", "₹974 per member"]] as const).map(([id, label, sub]) => {
                        const active = joinType === id;
                        return (
                          <button key={id} onClick={() => setJoinType(id)}
                            className="press-scale"
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "22px 28px", borderRadius: "14px", textAlign: "left",
                              border: "none",
                              boxShadow: active
                                ? "0 0 0 1.5px " + BLUE + ", 0 2px 8px rgba(0,0,0,0.2)"
                                : "inset 0 0 0 1.5px rgba(255,255,255,0.1)",
                              background: active ? `rgba(${BLUE_RGB},0.1)` : "rgba(255,255,255,0.03)",
                              cursor: "pointer",
                              transition: "background 0.15s ease, box-shadow 0.15s ease",
                          }}>
                            <div>
                              <div style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "18px", color: active ? "#fff" : "rgba(255,255,255,0.9)", marginBottom: "4px" }}>{label}</div>
                              <div style={{ fontFamily: monoFont, fontSize: "12px", color: active ? "#ffbc35" : "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>{sub}</div>
                            </div>
                            {/* #4-A: Radio dot always rendered, scale animates */}
                            <div style={{ width: "22px", height: "22px", borderRadius: "50%",
                              border: `2px solid ${active ? BLUE : "rgba(255,255,255,0.2)"}`,
                              background: active ? BLUE : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              transition: "border-color 0.15s ease, background 0.15s ease" }}>
                              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff",
                                transform: active ? "scale(1)" : "scale(0)",
                                transition: `transform 200ms ${EASE_OUT_QUINT}` }} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {current === "team-name" && (
                  <div style={{ width: "100%" }}>
                    <QuestionLabel index={screenIdx + 1} total={total}>What&apos;s your team called?</QuestionLabel>
                    <MaterialInput label="Team name" value={teamName} onChange={setTeamName} onEnter={advance} autoFocus large />
                  </div>
                )}

                {current === "team-role" && (
                  <div style={{ width: "100%" }}>
                    <QuestionLabel index={screenIdx + 1} total={total}>What&apos;s your role on the team?</QuestionLabel>
                    <RolePills selected={myRole} onSelect={setMyRole} />
                  </div>
                )}

                {/* #2-A: Animated teammate chips */}
                {current === "team-invites" && (
                  <div style={{ width: "100%" }}>
                    <QuestionLabel index={screenIdx + 1} total={total}>Who&apos;s building with you?</QuestionLabel>
                    <p style={{ fontFamily: gilroy, fontSize: "15px", color: "rgba(255,255,255,0.65)", marginBottom: "28px", marginTop: "-16px", textWrap: "pretty" }}>
                      Add teammates by email. Max 6 allowed. Each adds ₹974 to your total. You can skip this.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
                      {teammates.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
                          {teammates.map((t) => (
                            <TeammateChip key={t.id} email={t.email}
                              onRemove={() => setTeammates((prev) => prev.filter((x) => x.id !== t.id))} />
                          ))}
                        </div>
                      )}

                      <MaterialInput label="Teammate email" type="email" value={emailInput}
                        onChange={setEmailInput} onEnter={addTeammate} disabled={teammates.length >= 6} large />

                      <button onClick={addTeammate}
                        disabled={!emailInput.trim().includes("@") || teammates.length >= 6}
                        className="press-scale"
                        style={{
                          width: "100%", padding: "14px", borderRadius: "12px", border: "none", ...getButtonStyle(),
                          fontFamily: gilroy, fontSize: "15px", fontWeight: 600,
                          cursor: emailInput.trim().includes("@") && teammates.length < 6 ? "pointer" : "default",
                          transition: "background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                          opacity: emailInput.trim().includes("@") && teammates.length < 6 ? 1 : 0.4,
                        }}>
                        <Plus size={16} />
                        Add Teammate
                      </button>
                    </div>
                  </div>
                )}

                {current === "name" && (
                  <div style={{ width: "100%" }}>
                    <QuestionLabel index={screenIdx + 1} total={total}>What&apos;s your full name?</QuestionLabel>
                    <MaterialInput label="Full name" value={name} onChange={setName} onEnter={advance} autoFocus large />
                  </div>
                )}
                {current === "email" && (
                  <div style={{ width: "100%" }}>
                    <QuestionLabel index={screenIdx + 1} total={total}>Your email address?</QuestionLabel>
                    <MaterialInput label="Email address" value={email} onChange={setEmail} type="email" onEnter={advance} autoFocus large />
                  </div>
                )}
                {current === "phone" && (
                  <div style={{ width: "100%" }}>
                    <QuestionLabel index={screenIdx + 1} total={total}>Your phone number?</QuestionLabel>
                    <MaterialInput label="Phone number" value={phone} onChange={setPhone} type="tel" onEnter={advance} autoFocus large />
                  </div>
                )}
                {current === "role" && (
                  <div style={{ width: "100%" }}>
                    <QuestionLabel index={screenIdx + 1} total={total}>What do you do?</QuestionLabel>
                    <RolePills selected={role} onSelect={setRole} />
                  </div>
                )}
                {current === "q1" && (
                  <div style={{ width: "100%" }}>
                    <QuestionLabel index={screenIdx + 1} total={total}>
                      Any side project or buildathon you&apos;ve worked on? What did you build?
                    </QuestionLabel>
                    <MaterialInput label="Share a link and tell us about it…" value={q1} onChange={setQ1} onEnter={advance} autoFocus large />
                  </div>
                )}
                {current === "q2" && (
                  <div style={{ width: "100%" }}>
                    <QuestionLabel index={screenIdx + 1} total={total}>
                      What&apos;s one problem you think should have already been solved using AI – but still hasn&apos;t?
                    </QuestionLabel>
                    <MaterialInput label="Your answer…" value={q2} onChange={setQ2} onEnter={advance} autoFocus large />
                  </div>
                )}
              </StepTransition>

              {/* #8-C: Arrow slide-in on enable */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "48px" }}>
                <button onClick={advance} disabled={!canAdvance}
                  className="press-scale"
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 32px", borderRadius: "100px",
                    background: canAdvance ? BLUE : "rgba(255,255,255,0.08)",
                    border: "none", cursor: canAdvance ? "pointer" : "default",
                    boxShadow: canAdvance ? `0 0 32px rgba(${BLUE_RGB},0.35)` : "none",
                    transition: "background 0.2s ease, box-shadow 0.2s ease",
                    minHeight: "44px",
                }}>
                  <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                    color: canAdvance ? "#fff" : "rgba(255,255,255,0.4)" }}>
                    {screenIdx === screens.length - 1 ? "Complete Registration" : "Continue"}
                  </span>
                  <ArrowRight size={16} color="white" style={{
                    opacity: canAdvance ? 1 : 0,
                    transform: canAdvance ? "translateX(0)" : "translateX(-4px)",
                    transition: `opacity 200ms ${EASE_OUT_QUINT}, transform 200ms ${EASE_OUT_QUINT}`,
                  }} />
                </button>
                <span style={{ fontFamily: monoFont, fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                  or press Enter ↵
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
