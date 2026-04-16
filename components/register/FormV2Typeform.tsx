"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUp, ArrowDown, Check, Plus, X, Users, User } from "lucide-react";

const ROLES = ["Founder", "PM", "Engineer", "Designer", "Researcher", "Other"];
const EXPERIENCE = ["Beginner", "Intermediate", "Advanced", "Expert"];
const SOURCES = ["Twitter / X", "LinkedIn", "Word of mouth", "Newsletter", "Other"];
const TEAM_ROLES = ["Team Lead", "Co-Founder", "Member", "Contributor"];

interface Teammate { email: string; role: string }
type Answers = Record<string, string | string[] | Teammate[]>;

const buildQuestions = (answers: Answers) => {
  const base = [
    { id: "name",       type: "text",      q: "What's your full name?",                    hint: "Your name",              suffix: "" },
    { id: "email",      type: "email",      q: "What's your email address?",               hint: "you@company.com",        suffix: "" },
    { id: "phone",      type: "tel",        q: "And your phone number?",                   hint: "+91 98765 43210",        suffix: "" },
    { id: "role",       type: "pills",      q: "What best describes your role?",           options: ROLES,                 suffix: "" },
    { id: "company",    type: "text",       q: "Where do you work?",                       hint: "Company or self-employed", suffix: "" },
    { id: "regType",    type: "choice2",    q: "Registering solo or as a team?",           options: ["Solo", "Team"],      suffix: "" },
    ...(answers.regType === "Team" ? [
      { id: "teamName", type: "text",       q: "What's your team called?",                 hint: "Team name",              suffix: "" },
      { id: "teamRole", type: "pills",      q: "What's your role in the team?",            options: TEAM_ROLES,            suffix: "" },
      { id: "teammates",type: "teammates",  q: "Add your teammates",                       hint: "",                       suffix: "" },
    ] : []),
    { id: "project",    type: "textarea",   q: "What are you building?",                   hint: "Describe your idea...",  suffix: "" },
    { id: "experience", type: "pills",      q: "How would you rate your experience?",      options: EXPERIENCE,            suffix: "" },
    { id: "source",     type: "pills",      q: "How did you hear about this buildathon?",  options: SOURCES,               suffix: "" },
  ];
  return base;
};

export default function FormV2Typeform() {
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [animDir, setAnimDir] = useState<"in" | "out-up" | "out-down">("in");
  const [transitioning, setTransitioning] = useState(false);
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const questions = buildQuestions(answers);
  const q = questions[currentIdx];
  const total = questions.length;

  const setAnswer = (id: string, val: string) => setAnswers(prev => ({ ...prev, [id]: val }));

  const canProceed = useCallback(() => {
    if (!q) return false;
    if (q.type === "teammates") return true;
    const v = answers[q.id];
    if (!v) return false;
    if (typeof v === "string") return v.trim().length > 0;
    return true;
  }, [q, answers]);

  const goNext = useCallback(() => {
    if (!canProceed() || transitioning) return;
    if (currentIdx === total - 1) { setDone(true); return; }
    setTransitioning(true);
    setAnimDir("out-up");
    setTimeout(() => {
      setCurrentIdx(i => i + 1);
      setAnimDir("in");
      setTransitioning(false);
    }, 280);
  }, [canProceed, transitioning, currentIdx, total]);

  const goPrev = useCallback(() => {
    if (currentIdx === 0 || transitioning) return;
    setTransitioning(true);
    setAnimDir("out-down");
    setTimeout(() => {
      setCurrentIdx(i => i - 1);
      setAnimDir("in");
      setTransitioning(false);
    }, 280);
  }, [currentIdx, transitioning]);

  // Focus input after transition
  useEffect(() => {
    if (!transitioning && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentIdx, transitioning]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== "TEXTAREA") goNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext]);

  const addTeammate = () => {
    if (newEmail.trim() && teammates.length < 4) {
      const updated = [...teammates, { email: newEmail.trim(), role: "" }];
      setTeammates(updated);
      setAnswers(prev => ({ ...prev, teammates: updated }));
      setNewEmail("");
    }
  };

  const slideStyle = (): React.CSSProperties => {
    if (animDir === "out-up") return { opacity: 0, transform: "translateY(-32px)", transition: "all 0.25s ease" };
    if (animDir === "out-down") return { opacity: 0, transform: "translateY(32px)", transition: "all 0.25s ease" };
    return { opacity: 1, transform: "translateY(0)", transition: "all 0.28s ease" };
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "100px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(139,198,138,0.1)", border: "1px solid rgba(139,198,138,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Check size={32} style={{ color: "#8bc68a" }} />
          </div>
          <h2 style={{ fontSize: "28px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#fff", letterSpacing: "-0.5px", marginBottom: "12px" }}>
            All done, {String(answers.name || "friend").split(" ")[0]}!
          </h2>
          <p style={{ fontSize: "14px", color: "#969ba5", lineHeight: 1.7 }}>
            {answers.regType === "Team"
              ? `You've registered ${answers.teamName || "your team"} for the buildathon.`
              : "You're registered for the buildathon."}
          </p>
          <p style={{ fontSize: "12px", color: "#969ba5", marginTop: "8px" }}>
            Confirmation sent to {String(answers.email || "your email")}
          </p>
        </div>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingBottom: "100px" }}>
      {/* Progress bar */}
      <div style={{ height: "3px", background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", width: `${((currentIdx) / total) * 100}%`, background: "#0064ff", transition: "width 0.4s ease" }} />
      </div>

      {/* Main question area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
        <div style={{ width: "100%", maxWidth: "640px", ...slideStyle() }}>
          {/* Question number */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <span style={{ fontSize: "13px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#0064ff" }}>{currentIdx + 1}</span>
            <div style={{ width: "20px", height: "1px", background: "#0064ff", opacity: 0.5 }} />
            <span style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              of {total}
            </span>
          </div>

          {/* Question */}
          <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.3, marginBottom: "32px" }}>
            {q.q}
          </h2>

          {/* Input by type */}
          {(q.type === "text" || q.type === "email" || q.type === "tel") && (
            <div style={{ position: "relative" }}>
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type={q.type}
                value={String(answers[q.id] || "")}
                onChange={e => setAnswer(q.id, e.target.value)}
                placeholder={(q as { hint?: string }).hint}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid rgba(0,100,255,0.4)",
                  padding: "12px 0",
                  fontSize: "22px",
                  fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                  color: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: answers[q.id] ? "100%" : "0", height: "2px", background: "#0064ff", transition: "width 0.3s ease" }} />
            </div>
          )}

          {q.type === "textarea" && (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={String(answers[q.id] || "")}
              onChange={e => setAnswer(q.id, e.target.value)}
              placeholder={(q as { hint?: string }).hint}
              rows={4}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                borderBottom: "2px solid rgba(0,100,255,0.4)",
                padding: "12px 0",
                fontSize: "18px",
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                color: "#fff",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
              }}
            />
          )}

          {q.type === "pills" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {(q as { options: string[] }).options.map((opt, i) => {
                const isActive = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => { setAnswer(q.id, opt); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      borderRadius: "100px",
                      background: isActive ? "rgba(0,100,255,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isActive ? "#0064ff" : "rgba(255,255,255,0.12)"}`,
                      color: isActive ? "#fff" : "#969ba5",
                      fontSize: "14px",
                      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "choice2" && (
            <div style={{ display: "flex", gap: "16px" }}>
              {(q as { options: string[] }).options.map((opt, i) => {
                const isActive = answers[q.id] === opt;
                const Icon = opt === "Solo" ? User : Users;
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswer(q.id, opt)}
                    style={{
                      flex: 1,
                      padding: "24px 20px",
                      borderRadius: "16px",
                      background: isActive ? "rgba(0,100,255,0.12)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isActive ? "#0064ff" : "rgba(255,255,255,0.1)"}`,
                      color: isActive ? "#fff" : "#969ba5",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon size={24} style={{ color: isActive ? "#0064ff" : "#969ba5" }} />
                    <span style={{ fontSize: "16px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}>{opt}</span>
                    <span style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px" }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "teammates" && (
            <div>
              {teammates.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(113,116,121,0.2)" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(0,100,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#0064ff" }}>{i + 2}</span>
                  </div>
                  <span style={{ flex: 1, fontSize: "14px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#dce2ec" }}>{t.email}</span>
                  <button onClick={() => { const u = teammates.filter((_, j) => j !== i); setTeammates(u); setAnswers(p => ({ ...p, teammates: u })); }} style={{ background: "none", border: "none", color: "#969ba5", cursor: "pointer" }}>
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
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTeammate())}
                    placeholder="teammate@email.com"
                    style={{ flex: 1, background: "transparent", border: "none", borderBottom: "2px solid rgba(0,100,255,0.4)", padding: "12px 0", fontSize: "20px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#fff", outline: "none" }}
                  />
                  <button onClick={addTeammate} style={{ padding: "10px 20px", background: "rgba(0,100,255,0.12)", border: "1px solid rgba(0,100,255,0.3)", borderRadius: "8px", color: "#0064ff", cursor: "pointer", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CTA row */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "40px" }}>
            <button
              onClick={goNext}
              disabled={!canProceed()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 28px",
                borderRadius: "10px",
                background: canProceed() ? "#0064ff" : "rgba(255,255,255,0.06)",
                border: "none",
                color: canProceed() ? "#fff" : "#969ba5",
                fontSize: "13px",
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                letterSpacing: "1px",
                cursor: canProceed() ? "pointer" : "not-allowed",
                transition: "all 0.15s ease",
              }}
            >
              {currentIdx === total - 1 ? "Submit" : "OK"}
              <Check size={14} />
            </button>
            <span style={{ fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "rgba(255,255,255,0.25)" }}>
              press <kbd style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>Enter ↵</kbd>
            </span>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <div style={{ position: "fixed", right: "40px", bottom: "120px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={goPrev}
          disabled={currentIdx === 0}
          style={{
            width: "40px", height: "40px", borderRadius: "8px",
            background: currentIdx > 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: currentIdx > 0 ? "#fff" : "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: currentIdx > 0 ? "pointer" : "default",
          }}
        >
          <ArrowUp size={16} />
        </button>
        <button
          onClick={goNext}
          disabled={!canProceed()}
          style={{
            width: "40px", height: "40px", borderRadius: "8px",
            background: canProceed() ? "rgba(0,100,255,0.15)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${canProceed() ? "rgba(0,100,255,0.3)" : "rgba(255,255,255,0.06)"}`,
            color: canProceed() ? "#0064ff" : "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: canProceed() ? "pointer" : "default",
          }}
        >
          <ArrowDown size={16} />
        </button>
      </div>
    </div>
  );
}
