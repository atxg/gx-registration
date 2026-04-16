"use client";
import { useState, useRef, useEffect } from "react";
import { Check, Plus, X, ChevronRight, Users, User } from "lucide-react";

const ROLES = ["Founder", "PM", "Engineer", "Designer", "Researcher", "Other"];
const EXPERIENCE = ["Beginner", "Intermediate", "Advanced", "Expert"];
const SOURCES = ["Twitter / X", "LinkedIn", "Word of mouth", "Newsletter", "Other"];
const TEAM_ROLES = ["Team Lead", "Co-Founder", "Member", "Contributor"];

interface Field { id: string; label: string; group: string; type: string; options?: string[] }
interface Teammate { email: string; role: string }

const FIELDS: Field[] = [
  { id: "name",       label: "Full name",         group: "Personal",    type: "text" },
  { id: "email",      label: "Email",             group: "Personal",    type: "email" },
  { id: "phone",      label: "Phone",             group: "Personal",    type: "tel" },
  { id: "role",       label: "Role",              group: "Background",  type: "pills",    options: ROLES },
  { id: "company",    label: "Company",           group: "Background",  type: "text" },
  { id: "experience", label: "Experience level",  group: "Background",  type: "pills",    options: EXPERIENCE },
  { id: "project",    label: "What you're building", group: "Project",  type: "textarea" },
  { id: "regType",    label: "Registration type", group: "Team",        type: "toggle2",  options: ["Solo", "Team"] },
  { id: "teamName",   label: "Team name",         group: "Team",        type: "text" },
  { id: "teamRole",   label: "Your team role",    group: "Team",        type: "pills",    options: TEAM_ROLES },
  { id: "teammates",  label: "Teammates",         group: "Team",        type: "teammates" },
  { id: "source",     label: "How you heard",     group: "Discovery",   type: "pills",    options: SOURCES },
];

const GROUPS = ["Personal", "Background", "Project", "Team", "Discovery"];

export default function FormV4Linear() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState("name");
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [done, setDone] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const setAnswer = (id: string, val: string) => setAnswers(p => ({ ...p, [id]: val }));

  const isTeam = answers.regType === "Team";
  const visibleFields = FIELDS.filter(f => {
    if (f.id === "teamName" || f.id === "teamRole" || f.id === "teammates") return isTeam;
    return true;
  });

  const isComplete = (f: Field) => {
    if (f.type === "teammates") return teammates.length > 0;
    return Boolean(answers[f.id]);
  };

  const completedCount = visibleFields.filter(isComplete).length;
  const progress = Math.round((completedCount / visibleFields.length) * 100);

  const activeField = visibleFields.find(f => f.id === activeId) || visibleFields[0];
  const activeIdx = visibleFields.findIndex(f => f.id === activeId);

  const goNext = () => {
    if (activeIdx < visibleFields.length - 1) {
      setActiveId(visibleFields[activeIdx + 1].id);
    }
  };

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [activeId]);

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "120px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "rgba(139,198,138,0.1)", border: "1px solid rgba(139,198,138,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={24} style={{ color: "#8bc68a" }} />
          </div>
          <h2 style={{ fontSize: "20px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#fff", marginBottom: "8px", letterSpacing: "-0.3px" }}>Registered</h2>
          <p style={{ fontSize: "12px", color: "#969ba5" }}>Check {answers.email || "your inbox"} for confirmation</p>
        </div>
      </div>
    );
  }

  const groups = GROUPS.map(g => ({
    name: g,
    fields: visibleFields.filter(f => f.group === g),
  })).filter(g => g.fields.length > 0);

  return (
    <div style={{ minHeight: "100vh", display: "flex", paddingBottom: "100px" }}>
      {/* Left sidebar */}
      <div
        style={{
          width: "260px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          padding: "32px 0",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Top: event name */}
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: "9px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#969ba5", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Registration</p>
          <p style={{ fontSize: "13px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#fff", lineHeight: 1.4 }}>AI + Hardware Buildathon</p>
          <p style={{ fontSize: "11px", color: "#969ba5", marginTop: "4px" }}>April 18 · Bengaluru</p>
        </div>

        {/* Progress */}
        <div style={{ padding: "16px 20px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "9px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#969ba5", letterSpacing: "1.5px", textTransform: "uppercase" }}>Progress</span>
            <span style={{ fontSize: "9px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: progress === 100 ? "#8bc68a" : "#0064ff" }}>{progress}%</span>
          </div>
          <div style={{ height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "1px" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#8bc68a" : "#0064ff", borderRadius: "1px", transition: "width 0.3s ease" }} />
          </div>
        </div>

        {/* Field list by group */}
        {groups.map(g => (
          <div key={g.name} style={{ padding: "12px 0" }}>
            <p style={{ padding: "4px 20px", fontSize: "9px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#969ba5", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
              {g.name}
            </p>
            {g.fields.map(f => {
              const isActive = f.id === activeId;
              const complete = isComplete(f);
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveId(f.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 20px",
                    background: isActive ? "rgba(0,100,255,0.08)" : "transparent",
                    borderLeft: `2px solid ${isActive ? "#0064ff" : "transparent"}`,
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.12s ease",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "4px",
                      flexShrink: 0,
                      background: complete ? "rgba(139,198,138,0.15)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${complete ? "rgba(139,198,138,0.4)" : "rgba(255,255,255,0.1)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {complete && <Check size={9} style={{ color: "#8bc68a" }} />}
                  </div>
                  <span style={{ fontSize: "12px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: isActive ? "#fff" : complete ? "rgba(255,255,255,0.5)" : "#969ba5", lineHeight: 1 }}>
                    {f.label}
                  </span>
                  {isActive && <ChevronRight size={12} style={{ color: "#0064ff", marginLeft: "auto" }} />}
                </button>
              );
            })}
          </div>
        ))}

        {/* Submit */}
        <div style={{ padding: "16px 20px 0", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "8px" }}>
          <button
            onClick={() => setDone(true)}
            disabled={progress < 50}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              background: progress >= 50 ? "#0064ff" : "rgba(255,255,255,0.04)",
              border: `1px solid ${progress >= 50 ? "#0064ff" : "rgba(255,255,255,0.08)"}`,
              color: progress >= 50 ? "#fff" : "#969ba5",
              fontSize: "11px",
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: progress >= 50 ? "pointer" : "not-allowed",
            }}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Right: active field */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "64px 80px", minHeight: "100vh", maxWidth: "700px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "48px" }}>
          <span style={{ fontSize: "11px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#969ba5" }}>{activeField?.group}</span>
          <ChevronRight size={12} style={{ color: "#969ba5" }} />
          <span style={{ fontSize: "11px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#fff" }}>{activeField?.label}</span>
          <span style={{ fontSize: "11px", color: "#969ba5", marginLeft: "auto" }}>
            Tab to navigate
          </span>
        </div>

        {/* Field */}
        {activeField && (
          <div key={activeField.id}>
            <h2 style={{ fontSize: "28px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#fff", letterSpacing: "-0.5px", marginBottom: "32px" }}>
              {activeField.label}
            </h2>

            {(activeField.type === "text" || activeField.type === "email" || activeField.type === "tel") && (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={activeField.type}
                value={answers[activeField.id] || ""}
                onChange={e => setAnswer(activeField.id, e.target.value)}
                onKeyDown={e => e.key === "Tab" && (e.preventDefault(), goNext())}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  padding: "12px 0",
                  fontSize: "24px",
                  fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                  color: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            )}

            {activeField.type === "textarea" && (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={answers[activeField.id] || ""}
                onChange={e => setAnswer(activeField.id, e.target.value)}
                rows={5}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "16px",
                  fontSize: "16px",
                  fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                  color: "#fff",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                  lineHeight: 1.7,
                }}
              />
            )}

            {activeField.type === "pills" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {activeField.options?.map((opt, i) => {
                  const isActive = answers[activeField.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => { setAnswer(activeField.id, opt); setTimeout(goNext, 300); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        background: isActive ? "rgba(0,100,255,0.1)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isActive ? "rgba(0,100,255,0.4)" : "rgba(255,255,255,0.08)"}`,
                        color: isActive ? "#fff" : "#969ba5",
                        fontSize: "14px",
                        fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                        cursor: "pointer",
                        transition: "all 0.12s ease",
                      }}
                    >
                      <span style={{ fontSize: "9px", color: isActive ? "#0064ff" : "rgba(255,255,255,0.2)", letterSpacing: "1.5px", minWidth: "12px" }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                      {isActive && <Check size={12} style={{ marginLeft: "4px", color: "#0064ff" }} />}
                    </button>
                  );
                })}
              </div>
            )}

            {activeField.type === "toggle2" && (
              <div style={{ display: "flex", gap: "16px" }}>
                {[{ val: "Solo", Icon: User }, { val: "Team", Icon: Users }].map(({ val, Icon }) => {
                  const isActive = answers[activeField.id] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => { setAnswer(activeField.id, val); setTimeout(goNext, 300); }}
                      style={{
                        flex: 1,
                        padding: "32px 20px",
                        borderRadius: "12px",
                        background: isActive ? "rgba(0,100,255,0.08)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isActive ? "rgba(0,100,255,0.35)" : "rgba(255,255,255,0.08)"}`,
                        color: isActive ? "#fff" : "#969ba5",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "16px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Icon size={28} style={{ color: isActive ? "#0064ff" : "#969ba5" }} />
                      <span style={{ fontSize: "16px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}>{val}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeField.type === "teammates" && (
              <div>
                {teammates.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(0,100,255,0.12)", border: "1px solid rgba(0,100,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#0064ff" }}>{i + 2}</span>
                    </div>
                    <span style={{ flex: 1, fontSize: "14px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#dce2ec" }}>{t.email}</span>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {TEAM_ROLES.map(r => (
                        <button key={r} onClick={() => setTeammates(tm => tm.map((x, j) => j === i ? { ...x, role: r } : x))} style={{ padding: "3px 8px", borderRadius: "4px", fontSize: "9px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", background: t.role === r ? "rgba(0,100,255,0.15)" : "transparent", border: `1px solid ${t.role === r ? "rgba(0,100,255,0.3)" : "rgba(255,255,255,0.06)"}`, color: t.role === r ? "#fff" : "#969ba5", cursor: "pointer" }}>{r}</button>
                      ))}
                    </div>
                    <button onClick={() => setTeammates(tm => tm.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#969ba5", cursor: "pointer" }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {teammates.length < 4 && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") { e.preventDefault(); if (newEmail.trim()) { setTeammates(tm => [...tm, { email: newEmail.trim(), role: "" }]); setNewEmail(""); } }
                        if (e.key === "Tab") { e.preventDefault(); goNext(); }
                      }}
                      placeholder="teammate@email.com"
                      style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.12)", padding: "12px 0", fontSize: "18px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#fff", outline: "none" }}
                    />
                    <button onClick={() => { if (newEmail.trim()) { setTeammates(tm => [...tm, { email: newEmail.trim(), role: "" }]); setNewEmail(""); } }} style={{ padding: "8px 16px", background: "rgba(0,100,255,0.1)", border: "1px solid rgba(0,100,255,0.25)", borderRadius: "6px", color: "#0064ff", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}>
                      <Plus size={13} /> Add
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Next */}
            <div style={{ marginTop: "32px", display: "flex", gap: "12px", alignItems: "center" }}>
              {(activeField.type === "text" || activeField.type === "email" || activeField.type === "tel" || activeField.type === "textarea" || activeField.type === "teammates") && (
                <button
                  onClick={goNext}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "7px",
                    background: "rgba(0,100,255,0.1)",
                    border: "1px solid rgba(0,100,255,0.25)",
                    color: "#0064ff",
                    fontSize: "12px",
                    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                    cursor: "pointer",
                    letterSpacing: "0.5px",
                  }}
                >
                  Next
                  <span style={{ opacity: 0.5, fontSize: "10px" }}>Tab ↹</span>
                </button>
              )}
              {activeIdx > 0 && (
                <button onClick={() => setActiveId(visibleFields[activeIdx - 1].id)} style={{ background: "none", border: "none", color: "#969ba5", fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", cursor: "pointer" }}>
                  ← Back
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
