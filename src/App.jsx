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
    } catch {
      return `${persona} 응답 오류`;
    }
  };

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setZeroResponse("");
    setLumenResponse("");

    const [zero, lumen] = await Promise.all([
      fetchResponse("제로"),
      fetchResponse("루멘")
    ]);

    setZeroResponse(zero);
    setLumenResponse(lumen);
    setLoading(false);
  };

  return (
    <div style={{
      fontFamily: "sans-serif",
      maxWidth: "600px",
      margin: "40px auto",
      padding: "20px"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>제로 vs 루멘 대화</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="주제를 입력하세요"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "로딩 중..." : "보내기"}
        </button>
      </div>

      <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{
          background: "#f1f1f1",
          padding: "16px",
          borderRadius: "10px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
        }}>
          <strong>제로:</strong>
          <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>
            {loading && !zeroResponse ? "제로 응답 생성 중..." : zeroResponse}
          </p>
        </div>

        <div style={{
          background: "#fffbe6",
          padding: "16px",
          borderRadius: "10px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
        }}>
          <strong>루멘:</strong>
          <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>
            {loading && !lumenResponse ? "루멘 응답 생성 중..." : lumenResponse}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
