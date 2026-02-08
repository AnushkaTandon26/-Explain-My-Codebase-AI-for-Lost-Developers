"use client";

import { useState, useRef, useEffect, useMemo } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

type AnalyzeResult = {
  framework: string;
  entryPoint: string;
  architectureDiagram: string;
  explanation: {
    projectSummary: string;
    whereToStart: string;
  };
};

type Snowflake = {
  left: number;
  duration: number;
  delay: number;
};

export default function Home() {

  const [repoUrl, setRepoUrl] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  /* ⭐ NEW — container scroll ref */
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  /* ==================================================
     SAFE SNOW GENERATION (NO WARNINGS)
  ================================================== */

  const snowflakes: Snowflake[] = useMemo(() => {

    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    return Array.from({ length: 40 }).map(() => ({
      left: rand() * 100,
      duration: 6 + rand() * 10,
      delay: rand() * 5
    }));

  }, []);

  /* ==================================================
     FIXED AUTO SCROLL (NO LAYOUT SHIFT)
  ================================================== */

  useEffect(() => {

    const container = messagesContainerRef.current;

    if(container){
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }

  }, [messages, loading]);

  /* ==================================================
     TYPEWRITER EFFECT
  ================================================== */

  const typeMessage = async (text: string) => {

    let current = "";

    for (let i = 0; i < text.length; i++) {

      current += text[i];

      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1].text = current;
        return copy;
      });

      await new Promise(r => setTimeout(r, 5));
    }
  };

  /* ==================================================
     ANALYZE FUNCTION
  ================================================== */

  const analyzeRepo = async () => {

    if (!repoUrl) return;

    const url = repoUrl;

    setMessages(prev => [
      ...prev,
      { role: "user", text: url },
      { role: "ai", text: "" }
    ]);

    setRepoUrl("");
    setLoading(true);

    try {

      const res = await fetch("https://explain-my-codebase-ai-for-lost.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url })
      });

      const data: AnalyzeResult = await res.json();

      const aiText = `Framework: ${data.framework}

Entry Point:
${data.entryPoint}

Project Summary:
${data.explanation.projectSummary}

Architecture:
${data.architectureDiagram}

Where To Start:
${data.explanation.whereToStart}`;

      await typeMessage(aiText);

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  /* ==================================================
     UI
  ================================================== */

  return (

    <main className="flex h-screen bg-black text-white relative overflow-hidden">
      

      {/* SNOW BACKGROUND */}

      <div className="absolute inset-0 pointer-events-none">

        {snowflakes.map((flake, i) => (

          <div
            key={i}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`
            }}
          />

        ))}

      </div>

      {/* SIDEBAR */}

      <div className="w-72 border-r border-white/10 p-6 hidden md:block glass sidebar-glow">

        <h1 className="text-xl font-bold ai-gradient">
          Explain AI
        </h1>

        <p className="text-sm text-gray-400 mt-3">
          AI-powered code understanding dashboard
        </p>

      </div>

      {/* CHAT AREA */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <div className="border-b border-white/10 p-4 font-semibold glass">
          🚀 Explain My Codebase
        </div>

        {/* MESSAGES */}

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div className={`
                rounded-xl p-4 max-w-[70%]
                whitespace-pre-wrap animate-ai glass
                ${msg.role === "user"
                  ? "neon-user bg-blue-600/60"
                  : "neon-ai ai-cursor"
                }
              `}>

                {msg.text}

              </div>

            </div>

          ))}

          {loading && (

            <div className="glass neon-ai rounded-xl p-4 flex gap-2 w-fit">

              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>

            </div>

          )}

        </div>

        {/* INPUT */}

        <div className="border-t border-white/10 p-4 flex gap-3 glass">

          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Paste GitHub repo URL..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 outline-none"
          />

          <button
            onClick={analyzeRepo}
            className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 rounded-lg hover:opacity-80"
          >
            Send
          </button>

        </div>

      </div>

    </main>
  );
}
