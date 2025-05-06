import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [zeroResponse, setZeroResponse] = useState("");
  const [lumenResponse, setLumenResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResponse = async (persona) => {
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, persona })
      });

      const data = await res.json();
      return data.result || "응답 오류";
    } catch (err) {
      return `${persona} 응답 오류`;
    }
  };

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const [zero, lumen] = await Promise.all([
      fetchResponse("제로"),
      fetchResponse("루멘")
    ]);
    setZeroResponse(zero);
    setLumenResponse(lumen);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>제로 vs 루멘 대화</h2>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="주제를 입력하세요" style={{ padding: 8, width: "60%" }} />
      <button onClick={handleAsk} disabled={loading} style={{ marginLeft: 8, padding: 8 }}>
        {loading ? "로딩 중..." : "보내기"}
      </button>
      <div style={{ marginTop: 20 }}>
        <p><strong>제로:</strong> {zeroResponse}</p>
        <p><strong>루멘:</strong> {lumenResponse}</p>
      </div>
    </div>
  );
}

export default App;
