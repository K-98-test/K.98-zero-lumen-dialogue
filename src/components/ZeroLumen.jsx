
import React, { useState } from "react";

function ZeroLumen() {
  const [input, setInput] = useState("");
  const [zeroResponse, setZeroResponse] = useState("");
  const [lumenResponse, setLumenResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const messages = [
      {
        role: "system",
        content: "너는 두 인격을 가진 GPT 시뮬레이터야. 사용자가 주제를 입력하면 Zero는 냉철하고 분석적인 응답, Lumen은 감성적이고 통찰적인 응답을 한다."
      },
      {
        role: "user",
        content: `주제: ${input}`
      }
    ];

    const fetchResponse = async (persona) => {
      const updatedMessages = [
        messages[0],
        { ...messages[1], content: `${messages[1].content}\n대답은 ${persona}로 해줘.` }
      ];

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: updatedMessages
        })
      });

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "응답 오류";
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
