"use client";
import { useState, useEffect, useRef } from "react";
import { Send, Plus, X } from "lucide-react";

const ROLES = ["Founder", "PM", "Engineer", "Designer", "Researcher", "Other"];
const EXPERIENCE = ["Beginner", "Intermediate", "Advanced", "Expert"];
const SOURCES = ["Twitter / X", "LinkedIn", "Word of mouth", "Newsletter", "Other"];
const TEAM_ROLES = ["Team Lead", "Co-Founder", "Member", "Contributor"];

interface Message {
  from: "bot" | "user";
  text: string;
  pills?: string[];
  onPill?: (v: string) => void;
  type?: "teammates";
}

interface Teammate { email: string; role: string }

export default function FormV3Conversational() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [done, setDone] = useState(false);

  // Answers
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [regType, setRegType] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [project, setProject] = useState("");
  const [experience, setExperience] = useState("");
  const [source, setSource] = useState("");

  const [newTeamEmail, setNewTeamEmail] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("Type your answer...");
  const [inputType, setInputType] = useState("text");
  const [showInput, setShowInput] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addBot = (text: string, extra?: Partial<Message>) => {
    setMessages(prev => [...prev, { from: "bot", text, ...extra }]);
  };

  const addUser = (text: string) => {
    setMessages(prev => [...prev, { from: "user", text }]);
  };

  const scrollBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const botSay = (text: string, delay = 600, extra?: Partial<Message>) => {
    return new Promise<void>(resolve => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        addBot(text, extra);
        scrollBottom();
        resolve();
      }, delay);
    });
  };

  // Sequential flow
  const flow = useRef<Generator | null>(null);

  function* conversation() {
    // Greeting
    yield botSay("Hey! 👋 Let's get you registered for the AI + Hardware Buildathon.", 800);
    yield botSay("What's your full name?", 600);
    setInputPlaceholder("Your name");
    setInputType("text");
    setShowInput(true);
    yield "wait:name";

    yield botSay(`Nice to meet you, ${name.split(" ")[0]}! What's your email address?`, 700);
    setInputPlaceholder("you@company.com");
    setInputType("email");
    yield "wait:email";

    yield botSay("Great. And your phone number?", 600);
    setInputPlaceholder("+91 98765 43210");
    setInputType("tel");
    yield "wait:phone";

    setShowInput(false);
    yield botSay("What best describes your role?", 700, {
      pills: ROLES,
    });
    yield "wait:role";

    yield botSay("Where do you work?", 600);
    setInputPlaceholder("Company or self-employed");
    setInputType("text");
    setShowInput(true);
    yield "wait:company";

    setShowInput(false);
    yield botSay("Are you registering solo or with a team?", 700, {
      pills: ["Solo 🙋", "Team 👥"],
    });
    yield "wait:regType";

    if (regType === "Team 👥" || regType === "Team") {
      yield botSay("Love it! What's your team called?", 700);
      setInputPlaceholder("Team name");
      setInputType("text");
      setShowInput(true);
      yield "wait:teamName";

      setShowInput(false);
      yield botSay("Add your teammates' email addresses. Type one and press Enter (or skip).", 800, { type: "teammates" });
      yield "wait:teammates";
    }

    yield botSay("What are you planning to build at the hackathon?", 700);
    setInputPlaceholder("Describe your idea...");
    setInputType("text");
    setShowInput(true);
    yield "wait:project";

    setShowInput(false);
    yield botSay("How experienced are you with hardware + AI?", 700, {
      pills: EXPERIENCE,
    });
    yield "wait:experience";

    yield botSay("Last one — how did you hear about this event?", 600, {
      pills: SOURCES,
    });
    yield "wait:source";

    yield botSay(`You're all set, ${name.split(" ")[0]}! 🎉 See you on April 18 in Bengaluru.`, 1000);
    setShowInput(false);
    yield "done";
  }

  const advance = (waitKey: string, value: string) => {
    // nothing needed; caller sets state and calls step()
  };
  void advance;

  const runFlow = async () => {
    const gen = conversation();
    flow.current = gen;

    const tick = async () => {
      const result = gen.next();
      if (result.done) return;
      const val = result.value;

      if (val instanceof Promise) {
        await val;
        tick();
      } else if (typeof val === "string" && val.startsWith("wait:")) {
        // Wait for user input; resumed externally via nextStep
        return;
      } else if (val === "done") {
        setDone(true);
      }
    };

    tick();
  };

  useEffect(() => {
    runFlow();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextStep = async () => {
    const gen = flow.current;
    if (!gen) return;

    const tick = async () => {
      const result = gen.next();
      if (result.done) return;
      const val = result.value;

      if (val instanceof Promise) {
        await val;
        tick();
      } else if (typeof val === "string" && val.startsWith("wait:")) {
        return;
      } else if (val === "done") {
        setDone(true);
      }
    };

    tick();
  };

  const handleSend = () => {
    const val = inputVal.trim();
    if (!val) return;
    addUser(val);
    setInputVal("");
    scrollBottom();

    // Route to correct state based on step
    if (!name) { setName(val); nextStep(); return; }
    if (!email) { setEmail(val); nextStep(); return; }
    if (!phone) { setPhone(val); nextStep(); return; }
    if (!company) { setCompany(val); nextStep(); return; }
    if (!teamName && (regType === "Team 👥" || regType === "Team")) { setTeamName(val); nextStep(); return; }
    if (!project) { setProject(val); nextStep(); return; }
  };

  const handlePill = (pill: string, context: string) => {
    addUser(pill);
    scrollBottom();

    if (!role && ROLES.includes(pill)) { setRole(pill); nextStep(); return; }
    if (!regType && (pill === "Solo 🙋" || pill === "Team 👥")) { setRegType(pill); nextStep(); return; }
    if (!experience && EXPERIENCE.includes(pill)) { setExperience(pill); nextStep(); return; }
    if (!source && SOURCES.includes(pill)) { setSource(pill); nextStep(); return; }
    void context;
  };

  const addTeammate = () => {
    if (newTeamEmail.trim() && teammates.length < 4) {
      setTeammates(prev => [...prev, { email: newTeamEmail.trim(), role: "" }]);
      setNewTeamEmail("");
      scrollBottom();
    }
  };

  const finishTeammates = () => {
    setShowInput(true);
    nextStep();
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(0,100,255,0.15)", border: "1px solid rgba(0,100,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "14px" }}>🤖</span>
        </div>
        <div>
          <p style={{ fontSize: "13px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", color: "#fff", lineHeight: 1 }}>GrowthX Bot</p>
          <p style={{ fontSize: "10px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#8bc68a", letterSpacing: "1px" }}>
            {done ? "Registered ✓" : "Online"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", width: "100%" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "user" ? "flex-end" : "flex-start", marginBottom: "8px" }}>
              {/* Bubble */}
              <div
                style={{
                  maxWidth: "75%",
                  padding: msg.type === "teammates" ? "16px" : "10px 16px",
                  borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.from === "user" ? "#0064ff" : "rgba(255,255,255,0.06)",
                  border: msg.from === "bot" ? "1px solid rgba(255,255,255,0.08)" : "none",
                  fontSize: "14px",
                  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                  color: "#fff",
                  lineHeight: 1.5,
                }}
              >
                {msg.text}

                {msg.type === "teammates" && (
                  <div style={{ marginTop: "12px" }}>
                    {teammates.map((t, ti) => (
                      <div key={ti} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", padding: "8px 12px", background: "rgba(255,255,255,0.06)", borderRadius: "8px" }}>
                        <span style={{ fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#dce2ec", flex: 1 }}>{t.email}</span>
                        <button onClick={() => setTeammates(prev => prev.filter((_, j) => j !== ti))} style={{ background: "none", border: "none", color: "#969ba5", cursor: "pointer" }}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {teammates.length < 4 && (
                      <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                        <input
                          value={newTeamEmail}
                          onChange={e => setNewTeamEmail(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && addTeammate()}
                          placeholder="teammate@email.com"
                          style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "6px 10px", fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", color: "#fff", outline: "none" }}
                        />
                        <button onClick={addTeammate} style={{ padding: "6px 10px", background: "rgba(0,100,255,0.2)", border: "1px solid rgba(0,100,255,0.3)", borderRadius: "6px", color: "#0064ff", cursor: "pointer" }}>
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={finishTeammates}
                      style={{ marginTop: "10px", width: "100%", padding: "8px", background: "rgba(0,100,255,0.2)", border: "1px solid rgba(0,100,255,0.3)", borderRadius: "8px", color: "#fff", fontSize: "12px", fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace", cursor: "pointer" }}
                    >
                      {teammates.length === 0 ? "Skip — register solo" : `Continue with ${teammates.length + 1} members`}
                    </button>
                  </div>
                )}
              </div>

              {/* Pill choices */}
              {msg.pills && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px", maxWidth: "80%" }}>
                  {msg.pills.map(p => (
                    <button
                      key={p}
                      onClick={() => handlePill(p, msg.text)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "100px",
                        fontSize: "12px",
                        fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#dce2ec",
                        cursor: "pointer",
                        transition: "all 0.12s ease",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "8px" }}>
              <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "4px", alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#969ba5",
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      {showInput && !done && (
        <div style={{ flexShrink: 0, padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,6,6,0.9)", backdropFilter: "blur(12px)" }}>
          <div style={{ maxWidth: "640px", margin: "0 auto", display: "flex", gap: "8px" }}>
            <input
              ref={inputRef}
              type={inputType}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={inputPlaceholder}
              autoFocus
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "100px",
                padding: "12px 20px",
                fontSize: "14px",
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                color: "#fff",
                outline: "none",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputVal.trim()}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: inputVal.trim() ? "#0064ff" : "rgba(255,255,255,0.06)",
                border: "none",
                color: inputVal.trim() ? "#fff" : "#969ba5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: inputVal.trim() ? "pointer" : "default",
                flexShrink: 0,
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
