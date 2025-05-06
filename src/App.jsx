import React, { useState, useRef, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [zeroHistory, setZeroHistory] = useState([]);
  const [lumenHistory, setLumenHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const fetchResponse = async (persona) => {
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, persona })
      });
      const data = await res.json();
      return data.result || `${persona} 응답 오류`;
    } catch {
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

    setZeroHistory(prev => [...prev, { q: input, a: zero }]);
    setLumenHistory(prev => [...prev, { q: input, a: lumen }]);

    setInput("");
    setLoading(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [zeroHistory, lumenHistory]);

  return (
    <div style={{
      fontFamily: "sans-serif",
      maxWidth: "800px",
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

      <div ref={scrollRef} style={{
        marginTop: "30px",
        maxHeight: "500px",
        overflowY: "auto",
        paddingRight: "10px"
      }}>
        {zeroHistory.map((item, idx) => (
          <div key={idx} style={{
            marginBottom: "20px",
            border: "1px solid #eee",
            borderRadius: "10px",
            padding: "12px"
          }}>
            <div style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "12px"
            }}>
              주제: {item.q}
            </div>
            <div style={{
              display: "flex",
              gap: "12px"
            }}>
              <div style={{
                flex: 1,
                background: "#f1f1f1",
                borderRadius: "10px",
                padding: "10px"
              }}>
                <strong>제로</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "6px" }}>
                  {zeroHistory[idx]?.a}
                </p>
              </div>
              <div style={{
                flex: 1,
                background: "#fffbe6",
                borderRadius: "10px",
                padding: "10px"
              }}>
                <strong>루멘</strong>
                <p style={{ whiteSpace: "pre-wrap", marginTop: "6px" }}>
                  {lumenHistory[idx]?.a}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
