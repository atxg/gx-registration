"use client";
import { useState } from "react";
import { Check, ChevronDown, Plus, X, User, Users, Pencil } from "lucide-react";

const ROLES = ["Founder", "PM", "Engineer", "Designer", "Researcher", "Other"];
const EXPERIENCE = ["Beginner", "Intermediate", "Advanced", "Expert"];
const SOURCES = ["Twitter / X", "LinkedIn", "Word of mouth", "Newsletter", "Other"];
const TEAM_ROLES = ["Team Lead", "Co-Founder", "Member", "Contributor"];

interface Teammate { email: string; role: string }

interface StepData {
  name: string; email: string; phone: string;
  role: string; company: string; experience: string;
  project: string;
  regType: string; teamName: string; teamRole: string;
  source: string;
}

const empty: StepData = { name: "", email: "", phone: "", role: "", company: "", experience: "", project: "", regType: "", teamName: "", teamRole: "", source: "" };

export default function FormV5Cards() {
  const [data, setData] = useState<StepData>(empty);
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [done, setDone] = useState(false);

  const set = (k: keyof StepData, v: string) => setData(d => ({ ...d, [k]: v }));

  const stepComplete = (idx: number): boolean => {
    switch (idx) {
      case 0: return Boolean(data.name && data.email && data.phone);
      case 1: return Boolean(data.role && data.company && data.experience);
      case 2: return Boolean(data.project);
      case 3: return Boolean(data.regType && (data.regType === "Solo" || Boolean(data.teamName)));
      case 4: return Boolean(data.source);
      default: return false;
    }
  };

  const steps = [
    { label: "About You",           subtitle: "Personal details" },
    { label: "Your Background",     subtitle: "Role & experience" },
    { label: "Your Project",        subtitle: "What you're building" },
    { label: "Team Setup",          subtitle: "Solo or team?" },
    { label: "How You Found Us",    subtitle: "Discovery" },
  ];

  const allDone = steps.slice(0, 5).every((_, i) => stepComplete(i));

  const summaries: Record<number, string> = {
    0: data.name ? `${data.name} · ${data.email}` : "",
    1: data.role ? `${data.role}${data.company ? " at " + data.company : ""} · ${data.experience}` : "",
    2: data.project ? data.project.slice(0, 60) + (data.project.length > 60 ? "..." : "") : "",
    3: data.regType === "Team" ? `Team: ${data.teamName || "unnamed"} · ${teammates.length + 1} members` : data.regType === "Solo" ? "Solo registration" : "",
    4: data.source || "",
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "120px" }}>
        <div style={{ maxWidth: "480px", width: "100%", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "14px", background: "rgba(139,198,138,0.1)", border: "1px solid rgba(139,198,138,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Check size={26} style={{ color: "#8bc68a" }} />
            </div>
            <h2 style={{ fontSize: "22px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#fff", marginBottom: "8px" }}>Registration complete</h2>
            <p style={{ fontSize: "13px", color: "#969ba5" }}>See you April 18 in Bengaluru, {data.name.split(" ")[0]}!</p>
          </div>

          {/* Summary */}
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ padding: "16px 20px", borderBottom: i < steps.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <p style={{ fontSize: "9px", color: "#969ba5", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>{s.label}</p>
                <p style={{ fontSize: "13px", color: "#dce2ec" }}>{summaries[i] || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "140px" }}>
      {/* Header */}
      <div style={{ padding: "48px 0 40px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px" }}>
          <p style={{ fontSize: "9px", color: "#969ba5", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "10px" }}>Step-by-step Registration</p>
          <h1 style={{ fontSize: "26px", color: "#fff", letterSpacing: "-0.5px", marginBottom: "16px" }}>AI + Hardware Buildathon</h1>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {steps.map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: stepComplete(i) ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: stepComplete(i) ? "#8bc68a" : i === activeStep ? "#0064ff" : "rgba(255,255,255,0.1)",
                  transition: "all 0.25s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {stepComplete(i) && <Check size={5} style={{ color: "#060606" }} />}
                </div>
                {i < steps.length - 1 && <div style={{ width: "20px", height: "1px", background: "rgba(255,255,255,0.08)", margin: "0 3px" }} />}
              </div>
            ))}
            <span style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5", marginLeft: "10px" }}>
              {steps.filter((_, i) => stepComplete(i)).length}/{steps.length} complete
            </span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px 0" }}>
        {steps.map((s, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = stepComplete(idx);
          const isLocked = idx > 0 && !stepComplete(idx - 1);

          return (
            <div
              key={idx}
              style={{
                marginBottom: "12px",
                borderRadius: "14px",
                border: `1px solid ${isActive ? "rgba(0,100,255,0.25)" : isCompleted ? "rgba(139,198,138,0.15)" : "rgba(255,255,255,0.06)"}`,
                background: isActive ? "rgba(0,100,255,0.04)" : "rgba(255,255,255,0.02)",
                overflow: "hidden",
                opacity: isLocked ? 0.4 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {/* Step header */}
              <button
                onClick={() => !isLocked && setActiveStep(isActive ? -1 : idx)}
                disabled={isLocked}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: "none",
                  border: "none",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  textAlign: "left",
                }}
              >
                {/* Step number / check */}
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: isCompleted ? "rgba(139,198,138,0.12)" : isActive ? "rgba(0,100,255,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isCompleted ? "rgba(139,198,138,0.35)" : isActive ? "rgba(0,100,255,0.35)" : "rgba(255,255,255,0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {isCompleted ? (
                    <Check size={14} style={{ color: "#8bc68a" }} />
                  ) : (
                    <span style={{ fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: isActive ? "#0064ff" : "#969ba5" }}>{idx + 1}</span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", color: isCompleted ? "rgba(255,255,255,0.6)" : "#fff", marginBottom: "2px" }}>{s.label}</p>
                  <p style={{ fontSize: "11px", color: "#969ba5" }}>
                    {isCompleted && summaries[idx] ? summaries[idx] : s.subtitle}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {isCompleted && !isActive && (
                    <span style={{ padding: "3px 8px", borderRadius: "4px", background: "rgba(139,198,138,0.08)", border: "1px solid rgba(139,198,138,0.2)", fontSize: "9px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#8bc68a", letterSpacing: "1px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Pencil size={9} /> Edit
                    </span>
                  )}
                  <ChevronDown size={16} style={{ color: "#969ba5", transform: isActive ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
                </div>
              </button>

              {/* Step body */}
              {isActive && (
                <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ paddingTop: "20px" }}>
                    {idx === 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <SimpleInput label="Full name" value={data.name} onChange={v => set("name", v)} />
                        <SimpleInput label="Email address" value={data.email} onChange={v => set("email", v)} type="email" />
                        <SimpleInput label="Phone number" value={data.phone} onChange={v => set("phone", v)} type="tel" />
                      </div>
                    )}

                    {idx === 1 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <PillRow label="Your role" options={ROLES} value={data.role} onChange={v => set("role", v)} />
                        <SimpleInput label="Company or organisation" value={data.company} onChange={v => set("company", v)} />
                        <PillRow label="Experience level" options={EXPERIENCE} value={data.experience} onChange={v => set("experience", v)} />
                      </div>
                    )}

                    {idx === 2 && (
                      <textarea
                        value={data.project}
                        onChange={e => set("project", e.target.value)}
                        placeholder="Describe the project or idea you're bringing to the buildathon..."
                        rows={5}
                        autoFocus
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "10px",
                          padding: "14px 16px",
                          fontSize: "14px",
                          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                          color: "#fff",
                          outline: "none",
                          resize: "none",
                          lineHeight: 1.7,
                          boxSizing: "border-box",
                        }}
                      />
                    )}

                    {idx === 3 && (
                      <div>
                        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                          {[{ val: "Solo", Icon: User }, { val: "Team", Icon: Users }].map(({ val, Icon }) => {
                            const active = data.regType === val;
                            return (
                              <button
                                key={val}
                                onClick={() => set("regType", val)}
                                style={{
                                  flex: 1,
                                  padding: "20px",
                                  borderRadius: "12px",
                                  background: active ? "rgba(0,100,255,0.1)" : "rgba(255,255,255,0.02)",
                                  border: `1px solid ${active ? "rgba(0,100,255,0.35)" : "rgba(255,255,255,0.08)"}`,
                                  color: active ? "#fff" : "#969ba5",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <Icon size={18} style={{ color: active ? "#0064ff" : "#969ba5" }} />
                                <span style={{ fontSize: "14px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}>{val}</span>
                              </button>
                            );
                          })}
                        </div>

                        {data.regType === "Team" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <SimpleInput label="Team name" value={data.teamName} onChange={v => set("teamName", v)} />
                            <PillRow label="Your role in the team" options={TEAM_ROLES} value={data.teamRole} onChange={v => set("teamRole", v)} />

                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <p style={{ fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5" }}>Add teammates</p>
                                <span style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "rgba(255,255,255,0.2)" }}>{teammates.length}/4</span>
                              </div>

                              {teammates.map((t, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(0,100,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#0064ff" }}>{i + 2}</span>
                                  </div>
                                  <span style={{ flex: 1, fontSize: "13px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#dce2ec" }}>{t.email}</span>
                                  <button onClick={() => setTeammates(tm => tm.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#969ba5", cursor: "pointer" }}>
                                    <X size={13} />
                                  </button>
                                </div>
                              ))}

                              {teammates.length < 4 && (
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <input
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter" && newEmail.trim()) { setTeammates(tm => [...tm, { email: newEmail.trim(), role: "" }]); setNewEmail(""); } }}
                                    placeholder="teammate@email.com"
                                    style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#fff", outline: "none" }}
                                  />
                                  <button onClick={() => { if (newEmail.trim()) { setTeammates(tm => [...tm, { email: newEmail.trim(), role: "" }]); setNewEmail(""); } }} style={{ padding: "10px 14px", background: "rgba(0,100,255,0.1)", border: "1px solid rgba(0,100,255,0.25)", borderRadius: "8px", color: "#0064ff", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}>
                                    <Plus size={13} /> Add
                                  </button>
                                </div>
                              )}

                              {teammates.length > 0 && (
                                <div style={{ marginTop: "12px", padding: "10px 14px", background: "rgba(139,198,138,0.05)", borderRadius: "8px", border: "1px solid rgba(139,198,138,0.15)", display: "flex", justifyContent: "space-between" }}>
                                  <span style={{ fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5" }}>{teammates.length + 1} members × ₹974</span>
                                  <span style={{ fontSize: "14px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#8bc68a" }}>₹{(teammates.length + 1) * 974}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {idx === 4 && (
                      <PillRow label="How did you hear about this event?" options={SOURCES} value={data.source} onChange={v => set("source", v)} />
                    )}

                    {/* Next button */}
                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => {
                          if (stepComplete(idx)) {
                            if (idx === steps.length - 1) setDone(true);
                            else setActiveStep(idx + 1);
                          }
                        }}
                        style={{
                          padding: "10px 24px",
                          borderRadius: "8px",
                          background: stepComplete(idx) ? "#0064ff" : "rgba(255,255,255,0.05)",
                          border: "none",
                          color: stepComplete(idx) ? "#fff" : "#969ba5",
                          fontSize: "12px",
                          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                          letterSpacing: "0.5px",
                          cursor: stepComplete(idx) ? "pointer" : "not-allowed",
                        }}
                      >
                        {idx === steps.length - 1 ? "Complete Registration →" : "Continue →"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Final submit (visible once all done) */}
        {allDone && (
          <button
            onClick={() => setDone(true)}
            style={{ width: "100%", padding: "16px", borderRadius: "12px", background: "#0064ff", boxShadow: "0 0 32px rgba(0,100,255,0.2)", border: "none", color: "#fff", fontSize: "13px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", marginTop: "8px" }}
          >
            Complete Registration
          </button>
        )}
      </div>
    </div>
  );
}

function SimpleInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <p style={{ fontSize: "9px", color: "#969ba5", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>{label}</p>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          padding: "12px 14px",
          fontSize: "14px",
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          color: "#fff",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function PillRow({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p style={{ fontSize: "9px", color: "#969ba5", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {options.map(opt => {
          const active = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(active ? "" : opt)}
              style={{
                padding: "7px 16px",
                borderRadius: "100px",
                fontSize: "12px",
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                background: active ? "rgba(0,100,255,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? "rgba(0,100,255,0.35)" : "rgba(255,255,255,0.08)"}`,
                color: active ? "#fff" : "#969ba5",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "all 0.12s ease",
              }}
            >
              {active && <Check size={10} />}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
