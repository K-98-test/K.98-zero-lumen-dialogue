import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]); // 전체 대화 누적
  const [loading, setLoading] = useState(false);

  // 제로와 루멘 각각의 기억
  const [zeroMemory, setZeroMemory] = useState([]);
  const [lumenMemory, setLumenMemory] = useState([]);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const fetchAnswer = async (persona, memory, setMemory) => {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          persona,
          memory
        })
      });

      const data = await res.json();
      const reply = data.result || '[응답 없음] GPT 결과 파싱 실패';

      // memory 업데이트
      setMemory(prev => [...prev, { role: 'user', content: input }, { role: 'assistant', content: reply }]);

      return reply;
    };

    try {
      const [zeroReply, lumenReply] = await Promise.all([
        fetchAnswer('제로', zeroMemory, setZeroMemory),
        fetchAnswer('루멘', lumenMemory, setLumenMemory)
      ]);

      setHistory(prev => [...prev, { input, zero: zeroReply, lumen: lumenReply }]);
      setInput('');
    } catch (err) {
      setHistory(prev => [...prev, { input, zero: '[에러]', lumen: '[에러]' }]);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>제로 vs 루멘 대화</h1>
      <div className="input-section">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="주제를 입력하세요"
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? '로딩 중...' : '보내기'}
        </button>
      </div>

      <div className="dialogue-container">
        {history.map((msg, idx) => (
          <div className="dialogue-row" key={idx}>
            <div className="zero">{msg.zero}</div>
            <div className="lumen">{msg.lumen}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
