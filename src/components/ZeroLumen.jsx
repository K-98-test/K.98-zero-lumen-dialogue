import React, { useState } from "react";

function ZeroLumen() {
  const [input, setInput] = useState("");
  const [zeroResponse, setZeroResponse] = useState("");
  const [lumenResponse, setLumenResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResponse = async (persona) => {
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input,
          persona
        })
      });

      const data = await res.json();
      return data.result || "응답 오류";
    } catch (error) {
      console.error(`${persona} fetch 실패`, error);
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
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>제로 vs 루멘 대화</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="주제를 입력하세요"
        style={{ padding: "8px", width: "60%" }}
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        style={{ marginLeft: "8px", padding: "8px" }}
      >
        {loading ? "로딩 중..." : "보내기"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <p><strong>영:</strong> {zeroResponse}</p>
        <p><strong>루멘:</strong> {lumenResponse}</p>
      </div>
    </div>
  );
}

export default ZeroLumen;
