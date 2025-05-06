import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]); // 전체 대화 기록
  const [zeroMemory, setZeroMemory] = useState([]);
  const [lumenMemory, setLumenMemory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const fetchAnswer = async (persona, memory, setMemory) => {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, persona, memory })
    });

    const data = await res.json();
    const result = data.result || '[응답 없음]';

    // 인격별 메모리 갱신
    setMemory(prev => [...prev, { role: 'user', content: input }, { role: 'assistant', content: result }]);

    return result;
  };

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const [zero, lumen] = await Promise.all([
      fetchAnswer('제로', zeroMemory, setZeroMemory),
      fetchAnswer('루멘', lumenMemory, setLumenMemory)
    ]);

    setHistory(prev => [...prev, { input, zero, lumen }]);
    setInput('');
    setLoading(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="container">
      <h1>K.98: 제로 vs 루멘</h1>
      <div className="input-section">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="기정의 질문 입력"
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? '응답 중...' : '보내기'}
        </button>
      </div>

      <div className="dialogue-container" ref={scrollRef}>
        {history.map((msg, idx) => (
          <div key={idx} className="dialogue-block">
            <div className="topic">🧠 주제: {msg.input}</div>
            <div className="response-row">
              <div className="zero">
                <strong>제로</strong>
                <p>{msg.zero}</p>
              </div>
              <div className="lumen">
                <strong>루멘</strong>
                <p>{msg.lumen}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
