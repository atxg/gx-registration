"use client";
import { useState } from "react";
import { Check, Plus, X, ArrowRight, Users, User } from "lucide-react";

const ROLES = ["Founder", "PM", "Engineer", "Designer", "Researcher", "Other"];
const EXPERIENCE = ["Beginner", "Intermediate", "Advanced", "Expert"];
const SOURCES = ["Twitter / X", "LinkedIn", "Word of mouth", "Newsletter", "Other"];
const TEAM_ROLES = ["Team Lead", "Co-Founder", "Member", "Contributor"];

interface Teammate {
  email: string;
  role: string;
}

export default function FormV1Google() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [experience, setExperience] = useState("");
  const [source, setSource] = useState("");
  const [regType, setRegType] = useState<"solo" | "team">("solo");
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [done, setDone] = useState(false);

  const baseFields = [name, email, phone, role, company, project, experience, source];
  const teamFields = regType === "team" ? [teamName, teamRole] : [];
  const total = baseFields.length + teamFields.length;
  const filled = [...baseFields, ...teamFields].filter(Boolean).length;
  const progress = Math.round((filled / total) * 100);

  const addTeammate = () => {
    if (newEmail.trim() && teammates.length < 4) {
      setTeammates([...teammates, { email: newEmail.trim(), role: "" }]);
      setNewEmail("");
    }
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "120px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(139,198,138,0.12)", border: "1px solid rgba(139,198,138,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={28} style={{ color: "#8bc68a" }} />
          </div>
          <h2 style={{ fontSize: "20px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#fff", letterSpacing: "0.5px", marginBottom: "8px" }}>
            {regType === "team" ? `${teamName || "Your team"} is registered` : "You're in"}
          </h2>
          <p style={{ fontSize: "13px", color: "#969ba5" }}>Confirmation sent to {email || "your email"}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "140px" }}>
      {/* Sticky progress header */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#060606", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ height: "2px", background: "rgba(255,255,255,0.06)" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#0064ff", transition: "width 0.35s ease" }} />
        </div>
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5", letterSpacing: "2px", textTransform: "uppercase" }}>
            AI + Hardware Buildathon
          </span>
          <span style={{ fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: progress > 0 ? "#0064ff" : "#969ba5" }}>
            {progress > 0 ? `${progress}%` : "Register"}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px 0" }}>
        {/* Header */}
        <div style={{ marginBottom: "52px" }}>
          <h1 style={{ fontSize: "32px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#fff", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: "12px" }}>
            Register for the buildathon
          </h1>
          <p style={{ fontSize: "14px", color: "#0064ff", marginBottom: "8px", fontWeight: 500 }}>
            AI + Hardware Buildathon · April 18, Bengaluru
          </p>
          <p style={{ fontSize: "12px", color: "#969ba5" }}>
            Takes about 90 seconds. Minimal clicks.
          </p>
        </div>

        {/* SECTION: You */}
        <Section label="About You">
          <FloatingInput label="Full name" value={name} onChange={setName} />
          <FloatingInput label="Email address" value={email} onChange={setEmail} type="email" />
          <FloatingInput label="Phone number" value={phone} onChange={setPhone} type="tel" />
        </Section>

        <Divider />

        {/* SECTION: Background */}
        <Section label="Your Background">
          <PillPicker label="Your role" options={ROLES} value={role} onChange={setRole} />
          <FloatingInput label="Company or organisation" value={company} onChange={setCompany} />
          <PillPicker label="Experience level" options={EXPERIENCE} value={experience} onChange={setExperience} />
        </Section>

        <Divider />

        {/* SECTION: Project */}
        <Section label="What You&apos;re Building">
          <FloatingTextarea label="Describe your project or idea" value={project} onChange={setProject} />
        </Section>

        <Divider />

        {/* SECTION: Registration type */}
        <Section label="Team Registration">
          <div>
            <p style={{ fontSize: "11px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#969ba5", letterSpacing: "0.5px", marginBottom: "12px" }}>
              Are you registering solo or with a team?
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { id: "solo" as const, label: "Solo", Icon: User },
                { id: "team" as const, label: "Team", Icon: Users },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setRegType(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "100px",
                    background: regType === id ? "rgba(0,100,255,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${regType === id ? "rgba(0,100,255,0.4)" : "rgba(113,116,121,0.25)"}`,
                    color: regType === id ? "#fff" : "#969ba5",
                    fontSize: "13px",
                    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {regType === "team" && (
            <div style={{ marginTop: "20px", padding: "24px", background: "rgba(255,255,255,0.02)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <FloatingInput label="Team name" value={teamName} onChange={setTeamName} />

              <div style={{ marginTop: "20px" }}>
                <PillPicker label="Your role in the team" options={TEAM_ROLES} value={teamRole} onChange={setTeamRole} />
              </div>

              {/* Teammates */}
              <div style={{ marginTop: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <p style={{ fontSize: "11px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#969ba5", letterSpacing: "0.5px" }}>
                    Add teammates
                  </p>
                  <span style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "rgba(255,255,255,0.25)" }}>
                    {teammates.length}/4 added
                  </span>
                </div>

                {/* Teammate cards */}
                {teammates.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: "8px",
                      padding: "14px 16px",
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: "10px",
                      border: "1px solid rgba(113,116,121,0.2)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: `rgba(0,100,255,${0.1 + i * 0.05})`, border: "1px solid rgba(0,100,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "11px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#0064ff" }}>{i + 2}</span>
                        </div>
                        <span style={{ fontSize: "13px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#dce2ec" }}>{t.email}</span>
                      </div>
                      <button
                        onClick={() => setTeammates(teammates.filter((_, idx) => idx !== i))}
                        style={{ background: "none", border: "none", color: "#969ba5", cursor: "pointer", padding: "4px", display: "flex" }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {TEAM_ROLES.map(r => (
                        <button
                          key={r}
                          onClick={() => setTeammates(teammates.map((tm, idx) => idx === i ? { ...tm, role: r } : tm))}
                          style={{
                            padding: "4px 12px",
                            borderRadius: "100px",
                            fontSize: "11px",
                            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                            background: t.role === r ? "rgba(0,100,255,0.15)" : "transparent",
                            border: `1px solid ${t.role === r ? "rgba(0,100,255,0.35)" : "rgba(113,116,121,0.2)"}`,
                            color: t.role === r ? "#fff" : "#969ba5",
                            cursor: "pointer",
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Add input */}
                {teammates.length < 4 && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                    <input
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addTeammate()}
                      placeholder="teammate@email.com"
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(113,116,121,0.25)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        fontSize: "13px",
                        fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                        color: "#fff",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={addTeammate}
                      style={{
                        padding: "10px 16px",
                        background: "rgba(0,100,255,0.12)",
                        border: "1px solid rgba(0,100,255,0.3)",
                        borderRadius: "8px",
                        color: "#0064ff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                      }}
                    >
                      <Plus size={13} />
                      Add
                    </button>
                  </div>
                )}

                {/* Price calc */}
                {teammates.length > 0 && (
                  <div style={{ marginTop: "16px", padding: "12px 16px", background: "rgba(139,198,138,0.05)", borderRadius: "8px", border: "1px solid rgba(139,198,138,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#969ba5" }}>
                      {teammates.length + 1} members × ₹974
                    </span>
                    <span style={{ fontSize: "16px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#8bc68a" }}>
                      ₹{(teammates.length + 1) * 974}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </Section>

        <Divider />

        {/* SECTION: Source */}
        <Section label="One Last Thing">
          <PillPicker label="How did you hear about this event?" options={SOURCES} value={source} onChange={setSource} />
        </Section>

        {/* Submit */}
        <div style={{ marginTop: "48px" }}>
          <button
            onClick={() => setDone(true)}
            style={{
              width: "100%",
              height: "56px",
              borderRadius: "12px",
              background: progress >= 40 ? "#0064ff" : "rgba(255,255,255,0.05)",
              boxShadow: progress >= 40 ? "0 0 32px rgba(0,100,255,0.2)" : "none",
              border: "none",
              color: progress >= 40 ? "#fff" : "#969ba5",
              fontSize: "12px",
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              cursor: progress >= 40 ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
          >
            {regType === "team" ? "Register Team" : "Complete Registration"}
            <ArrowRight size={15} />
          </button>
          {progress < 40 && (
            <p style={{ textAlign: "center", marginTop: "10px", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
              Fill in more fields to unlock
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <p style={{ fontSize: "9px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#969ba5", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "20px" }}>
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 0 40px" }} />;
}

function FloatingInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div style={{ position: "relative" }}>
      <label
        style={{
          position: "absolute",
          left: "14px",
          top: lifted ? "7px" : "50%",
          transform: lifted ? "none" : "translateY(-50%)",
          fontSize: lifted ? "9px" : "13px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          color: focused ? "#0064ff" : "#969ba5",
          letterSpacing: lifted ? "1.5px" : "0.3px",
          textTransform: lifted ? "uppercase" : "none",
          transition: "all 0.18s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "rgba(0,100,255,0.4)" : "rgba(113,116,121,0.22)"}`,
          borderRadius: "10px",
          padding: lifted ? "24px 14px 8px" : "16px 14px",
          fontSize: "14px",
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          color: "#fff",
          outline: "none",
          transition: "border-color 0.18s ease",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function FloatingTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div style={{ position: "relative" }}>
      <label
        style={{
          position: "absolute",
          left: "14px",
          top: lifted ? "8px" : "16px",
          fontSize: lifted ? "9px" : "13px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          color: focused ? "#0064ff" : "#969ba5",
          letterSpacing: lifted ? "1.5px" : "0.3px",
          textTransform: lifted ? "uppercase" : "none",
          transition: "all 0.18s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={4}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "rgba(0,100,255,0.4)" : "rgba(113,116,121,0.22)"}`,
          borderRadius: "10px",
          padding: lifted ? "28px 14px 12px" : "16px 14px",
          fontSize: "14px",
          fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          color: "#fff",
          outline: "none",
          resize: "vertical",
          transition: "all 0.18s ease",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function PillPicker({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p style={{ fontSize: "11px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#969ba5", marginBottom: "10px", letterSpacing: "0.3px" }}>
        {label}
      </p>
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
                background: active ? "rgba(0,100,255,0.14)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? "rgba(0,100,255,0.4)" : "rgba(113,116,121,0.22)"}`,
                color: active ? "#fff" : "#969ba5",
                cursor: "pointer",
                transition: "all 0.13s ease",
                display: "flex",
                alignItems: "center",
                gap: "5px",
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
