import React, { useState } from "react";

function ZeroLumen() {
  const [input, setInput] = useState("");
  const [zeroResponse, setZeroResponse] = useState("");
  const [lumenResponse, setLumenResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const fetchResponse = async (persona) => {
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
    };

    try {
      const [zero, lumen] = await Promise.all([
        fetchResponse("제로"),
        fetchResponse("루멘")
      ]);

      setZeroResponse(zero);
      setLumenResponse(lumen);
    } catch (error) {
      setZeroResponse("Zero 응답 오류");
      setLumenResponse("Lumen 응답 오류");
    }

    setLoading(false);
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="주제를 입력하세요"
        style={{ padding: "8px", width: "60%" }}
      />
      <button onClick={handleAsk} disabled={loading} style={{ marginLeft: "8px" }}>
        {loading ? "로딩 중..." : "보내기"}
      </button>
      <div style={{ marginTop: "20px" }}>
        <p><strong>Zero:</strong> {zeroResponse}</p>
        <p><strong>Lumen:</strong> {lumenResponse}</p>
      </div>
    </div>
  );
}

export default ZeroLumen;
