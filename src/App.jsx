import React, { useState, useRef, useEffect } from 'react';
import './style.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const fetchAnswer = async (persona) => {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, persona })
    });

    const data = await res.json();
    return data.result || '[응답 없음] GPT 결과 파싱 실패';
  };

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const persona = input.startsWith('제로:') ? '제로'
                   : input.startsWith('루멘:') ? '루멘'
                   : null;

    if (!persona) {
      alert('제로: 또는 루멘: 으로 시작해 주세요');
      setLoading(false);
      return;
    }

    const cleanInput = input.replace(/^제로:|^루멘:/, '').trim();
    const answer = await fetchAnswer(persona);

    setMessages(prev => [...prev, { persona, question: cleanInput, answer }]);
    setInput('');
    setLoading(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container">
      <h1>K.98 실험: 제로 vs 루멘</h1>
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="제로: 인간의 본질은? 또는 루멘: 감정이란?"
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? '생성 중...' : '보내기'}
        </button>
      </div>

      <div className="dialogue-area" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className="dialogue-block">
            <div className="question">💬 질문: {msg.question}</div>
            <div className={`answer-card ${msg.persona === '제로' ? 'zero' : 'lumen'}`}>
              <strong>{msg.persona}</strong>
              <p>{msg.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
