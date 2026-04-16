"use client";
import { useState } from "react";
import { Plus, X, Check, ArrowRight, Users, User, Mail, Crown, Star } from "lucide-react";

const TEAM_ROLES = ["Team Lead", "Co-Founder", "Engineer", "Designer", "Researcher"];
const PERSONAL_ROLES = ["Founder", "PM", "Engineer", "Designer", "Researcher", "Other"];
const EXPERIENCE = ["Beginner", "Intermediate", "Advanced", "Expert"];

interface Teammate {
  id: string;
  email: string;
  role: string;
  status: "pending" | "invited";
}

const PRICE = 974;
const ROLE_ICONS: Record<string, React.ReactNode> = {
  "Team Lead": <Crown size={12} style={{ color: "#f5c542" }} />,
  "Co-Founder": <Star size={12} style={{ color: "#0064ff" }} />,
};

export default function FormV6Team() {
  const [regMode, setRegMode] = useState<"" | "solo" | "team">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [project, setProject] = useState("");

  // Team-specific
  const [teamName, setTeamName] = useState("");
  const [myTeamRole, setMyTeamRole] = useState("");
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [step, setStep] = useState<"hero" | "team-build" | "personal" | "done">("hero");
  const [done, setDone] = useState(false);

  const totalMembers = teammates.length + 1;
  const totalPrice = totalMembers * PRICE;

  const addTeammate = () => {
    if (newEmail.trim() && teammates.length < 4) {
      setTeammates(prev => [...prev, {
        id: Math.random().toString(36).slice(2),
        email: newEmail.trim(),
        role: newRole || "Member",
        status: "pending",
      }]);
      setNewEmail("");
      setNewRole("");
    }
  };

  const removeTeammate = (id: string) => setTeammates(prev => prev.filter(t => t.id !== id));
  const updateRole = (id: string, r: string) => setTeammates(prev => prev.map(t => t.id === id ? { ...t, role: r } : t));

  // ── Hero: solo vs team ──
  if (regMode === "" || step === "hero") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px 140px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <p style={{ fontSize: "10px", color: "#969ba5", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "16px" }}>AI + Hardware Buildathon · April 18</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", color: "#fff", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "16px" }}>
            Registering as a team?
          </h1>
          <p style={{ fontSize: "14px", color: "#969ba5", maxWidth: "400px", lineHeight: 1.7 }}>
            Build together. Teams of up to 5 get priority seating and a shared project showcase slot.
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", width: "100%", maxWidth: "520px", flexWrap: "wrap" }}>
          {/* Team card */}
          <button
            onClick={() => { setRegMode("team"); setStep("team-build"); }}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "32px 24px",
              borderRadius: "20px",
              background: "rgba(0,100,255,0.06)",
              border: "1px solid rgba(0,100,255,0.25)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", borderRadius: "50%", background: "rgba(0,100,255,0.06)", transform: "translate(30px, -30px)" }} />
            <Users size={32} style={{ color: "#0064ff", marginBottom: "20px" }} />
            <p style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Register a Team</p>
            <p style={{ fontSize: "12px", color: "#969ba5", lineHeight: 1.6, marginBottom: "20px" }}>
              2–5 members. Add teammates by email. Assign roles.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#0064ff" }}>₹{PRICE}/person</span>
              <span style={{ fontSize: "9px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5" }}>· billed per seat</span>
            </div>
          </button>

          {/* Solo card */}
          <button
            onClick={() => { setRegMode("solo"); setStep("personal"); }}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "32px 24px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
            }}
          >
            <User size={32} style={{ color: "#969ba5", marginBottom: "20px" }} />
            <p style={{ fontSize: "18px", color: "#fff", marginBottom: "8px" }}>Register Solo</p>
            <p style={{ fontSize: "12px", color: "#969ba5", lineHeight: 1.6, marginBottom: "20px" }}>
              Just you. You can still collaborate on the day.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5" }}>₹{PRICE}</span>
              <span style={{ fontSize: "9px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5" }}>· one-time</span>
            </div>
          </button>
        </div>

        <p style={{ marginTop: "32px", fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "rgba(255,255,255,0.2)" }}>
          You can always add teammates after registration
        </p>
      </div>
    );
  }

  // ── Team build step ──
  if (regMode === "team" && step === "team-build") {
    return (
      <div style={{ minHeight: "100vh", paddingBottom: "140px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px 0" }}>
          <button onClick={() => setStep("hero")} style={{ background: "none", border: "none", color: "#969ba5", fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", cursor: "pointer", marginBottom: "32px", display: "flex", alignItems: "center", gap: "6px" }}>
            ← Back
          </button>

          <p style={{ fontSize: "9px", color: "#969ba5", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "12px" }}>Team Registration</p>
          <h2 style={{ fontSize: "26px", color: "#fff", letterSpacing: "-0.5px", marginBottom: "36px" }}>Build your team</h2>

          {/* Team name */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "9px", color: "#969ba5", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Team name</p>
            <input
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="What's your team called?"
              autoFocus
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(113,116,121,0.25)",
                borderRadius: "12px",
                padding: "16px 18px",
                fontSize: "18px",
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                color: "#fff",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* My role in team */}
          <div style={{ marginBottom: "32px" }}>
            <p style={{ fontSize: "9px", color: "#969ba5", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Your role in the team</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {TEAM_ROLES.map(r => {
                const active = myTeamRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => setMyTeamRole(active ? "" : r)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 18px",
                      borderRadius: "100px",
                      background: active ? "rgba(0,100,255,0.14)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${active ? "rgba(0,100,255,0.4)" : "rgba(113,116,121,0.22)"}`,
                      color: active ? "#fff" : "#969ba5",
                      fontSize: "12px",
                      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                      cursor: "pointer",
                    }}
                  >
                    {ROLE_ICONS[r]}
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Team member builder */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <p style={{ fontSize: "9px", color: "#969ba5", letterSpacing: "2px", textTransform: "uppercase" }}>Teammates</p>
              <span style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "rgba(255,255,255,0.25)" }}>{teammates.length}/4 added</span>
            </div>

            {/* Team member cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              {/* You (leader) */}
              <div style={{
                padding: "16px 20px",
                borderRadius: "12px",
                background: "rgba(0,100,255,0.06)",
                border: "1px solid rgba(0,100,255,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(0,100,255,0.2)", border: "2px solid rgba(0,100,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "14px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#0064ff", fontWeight: 500 }}>1</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", color: "#fff", marginBottom: "2px" }}>You</p>
                  <p style={{ fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5" }}>{myTeamRole || "Role not set"}</p>
                </div>
                <div style={{ padding: "3px 10px", borderRadius: "4px", background: "rgba(0,100,255,0.1)", border: "1px solid rgba(0,100,255,0.2)" }}>
                  <span style={{ fontSize: "9px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#0064ff", letterSpacing: "1px", textTransform: "uppercase" }}>Owner</span>
                </div>
              </div>

              {/* Added teammates */}
              {teammates.map((t, i) => (
                <div
                  key={t.id}
                  style={{
                    padding: "14px 20px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: `rgba(${[0,100,200,150][i % 4]},${[100,64,120,80][i % 4]},${[255,255,100,200][i % 4]},0.12)`, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#dce2ec" }}>{i + 2}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                      <Mail size={11} style={{ color: "#969ba5" }} />
                      <span style={{ fontSize: "13px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#dce2ec" }}>{t.email}</span>
                      <span style={{ fontSize: "9px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5", padding: "2px 6px", borderRadius: "3px", background: "rgba(255,255,255,0.04)" }}>invite pending</span>
                    </div>
                    {/* Role pills inline */}
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {TEAM_ROLES.map(r => (
                        <button
                          key={r}
                          onClick={() => updateRole(t.id, r)}
                          style={{
                            padding: "2px 9px",
                            borderRadius: "100px",
                            fontSize: "10px",
                            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                            background: t.role === r ? "rgba(0,100,255,0.14)" : "transparent",
                            border: `1px solid ${t.role === r ? "rgba(0,100,255,0.35)" : "rgba(255,255,255,0.06)"}`,
                            color: t.role === r ? "#fff" : "#969ba5",
                            cursor: "pointer",
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => removeTeammate(t.id)} style={{ background: "none", border: "none", color: "#969ba5", cursor: "pointer", flexShrink: 0 }}>
                    <X size={15} />
                  </button>
                </div>
              ))}

              {/* Add teammate input */}
              {teammates.length < 4 && (
                <div style={{ padding: "14px 20px", borderRadius: "12px", background: "rgba(255,255,255,0.015)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Plus size={14} style={{ color: "#969ba5" }} />
                    </div>
                    <input
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addTeammate()}
                      placeholder="teammate@email.com"
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        fontSize: "14px",
                        fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                        color: "#fff",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={addTeammate}
                      disabled={!newEmail.trim()}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        background: newEmail.trim() ? "rgba(0,100,255,0.15)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${newEmail.trim() ? "rgba(0,100,255,0.3)" : "rgba(255,255,255,0.06)"}`,
                        color: newEmail.trim() ? "#0064ff" : "#969ba5",
                        fontSize: "11px",
                        fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                        cursor: newEmail.trim() ? "pointer" : "default",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Plus size={12} /> Invite
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Price summary */}
            <div style={{
              padding: "20px 24px",
              borderRadius: "14px",
              background: "rgba(139,198,138,0.05)",
              border: "1px solid rgba(139,198,138,0.18)",
              marginTop: "20px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5", marginBottom: "4px" }}>
                    {totalMembers} member{totalMembers > 1 ? "s" : ""} × ₹{PRICE}
                  </p>
                  <p style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "rgba(255,255,255,0.2)" }}>
                    Each member pays individually after accepting invite
                  </p>
                </div>
                <p style={{ fontSize: "24px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#8bc68a", letterSpacing: "-0.5px" }}>
                  ₹{totalPrice}
                </p>
              </div>

              {teammates.length > 0 && (
                <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(139,198,138,0.12)" }}>
                  <p style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#8bc68a", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Mail size={10} /> Invite emails will be sent after you complete registration
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Continue to personal */}
          <button
            onClick={() => teamName ? setStep("personal") : undefined}
            disabled={!teamName}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "12px",
              background: teamName ? "#0064ff" : "rgba(255,255,255,0.05)",
              boxShadow: teamName ? "0 0 32px rgba(0,100,255,0.2)" : "none",
              border: "none",
              color: teamName ? "#fff" : "#969ba5",
              fontSize: "13px",
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
              letterSpacing: "1px",
              cursor: teamName ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            Continue to your details
            <ArrowRight size={15} />
          </button>
          {!teamName && <p style={{ textAlign: "center", marginTop: "8px", fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "rgba(255,255,255,0.2)" }}>Enter a team name to continue</p>}
        </div>
      </div>
    );
  }

  // ── Personal details step (solo + team) ──
  if (step === "personal") {
    const canSubmit = name && email && phone && role;

    if (done) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "120px" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(139,198,138,0.1)", border: "1px solid rgba(139,198,138,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Check size={28} style={{ color: "#8bc68a" }} />
            </div>
            <h2 style={{ fontSize: "24px", color: "#fff", marginBottom: "10px" }}>
              {regMode === "team" ? `${teamName} is registered!` : "You're registered!"}
            </h2>
            {regMode === "team" && teammates.length > 0 && (
              <p style={{ fontSize: "13px", color: "#969ba5", lineHeight: 1.7, marginBottom: "8px" }}>
                Invite emails sent to {teammates.map(t => t.email).join(", ")}
              </p>
            )}
            <p style={{ fontSize: "12px", color: "#969ba5" }}>
              Confirmation sent to {email}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: "100vh", paddingBottom: "140px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 24px 0" }}>
          <button onClick={() => setStep(regMode === "team" ? "team-build" : "hero")} style={{ background: "none", border: "none", color: "#969ba5", fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", cursor: "pointer", marginBottom: "32px", display: "flex", alignItems: "center", gap: "6px" }}>
            ← Back
          </button>

          {/* Team badge */}
          {regMode === "team" && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderRadius: "10px", background: "rgba(0,100,255,0.07)", border: "1px solid rgba(0,100,255,0.2)", marginBottom: "32px", width: "fit-content" }}>
              <Users size={14} style={{ color: "#0064ff" }} />
              <span style={{ fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#fff" }}>{teamName}</span>
              <span style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5" }}>· {totalMembers} member{totalMembers > 1 ? "s" : ""}</span>
            </div>
          )}

          <p style={{ fontSize: "9px", color: "#969ba5", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "12px" }}>Your details</p>
          <h2 style={{ fontSize: "24px", color: "#fff", letterSpacing: "-0.5px", marginBottom: "36px" }}>Tell us about yourself</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Field label="Full name"><input autoFocus value={name} onChange={e => setName(e.target.value)} style={inputStyle} /></Field>
            <Field label="Email address"><input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} /></Field>
            <Field label="Phone number"><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} /></Field>

            <Field label="Your role">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "2px" }}>
                {PERSONAL_ROLES.map(r => (
                  <button key={r} onClick={() => setRole(r === role ? "" : r)} style={{ padding: "7px 15px", borderRadius: "100px", fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", background: role === r ? "rgba(0,100,255,0.14)" : "rgba(255,255,255,0.03)", border: `1px solid ${role === r ? "rgba(0,100,255,0.4)" : "rgba(113,116,121,0.22)"}`, color: role === r ? "#fff" : "#969ba5", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                    {role === r && <Check size={10} />}{r}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Experience level">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "2px" }}>
                {EXPERIENCE.map(e => (
                  <button key={e} onClick={() => setExperience(e === experience ? "" : e)} style={{ padding: "7px 15px", borderRadius: "100px", fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", background: experience === e ? "rgba(0,100,255,0.14)" : "rgba(255,255,255,0.03)", border: `1px solid ${experience === e ? "rgba(0,100,255,0.4)" : "rgba(113,116,121,0.22)"}`, color: experience === e ? "#fff" : "#969ba5", cursor: "pointer" }}>
                    {e}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="What you're building">
              <textarea
                value={project}
                onChange={e => setProject(e.target.value)}
                placeholder="Describe your project or idea..."
                rows={3}
                style={{ ...inputStyle, resize: "none", lineHeight: "1.7" }}
              />
            </Field>
          </div>

          {/* Submit */}
          <div style={{ marginTop: "36px" }}>
            <button
              onClick={() => canSubmit && setDone(true)}
              disabled={!canSubmit}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                background: canSubmit ? "#0064ff" : "rgba(255,255,255,0.05)",
                boxShadow: canSubmit ? "0 0 32px rgba(0,100,255,0.2)" : "none",
                border: "none",
                color: canSubmit ? "#fff" : "#969ba5",
                fontSize: "13px",
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                letterSpacing: "1px",
                cursor: canSubmit ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {regMode === "team" ? `Register ${teamName} — ₹${totalPrice}` : `Register — ₹${PRICE}`}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(113,116,121,0.22)",
  borderRadius: "10px",
  padding: "13px 16px",
  fontSize: "15px",
  fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
  color: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: "9px", color: "#969ba5", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>{label}</p>
      {children}
    </div>
  );
}
