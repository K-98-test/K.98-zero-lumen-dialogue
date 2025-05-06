import React, { useState, useRef, useEffect } from 'react';
import './style.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('both');
  const [showIntro, setShowIntro] = useState(true);
  const [zeroMemory, setZeroMemory] = useState([]);
  const [lumenMemory, setLumenMemory] = useState([]);
  const scrollRef = useRef(null);

  const fetchAnswer = async (persona, memory, setMemory) => {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, persona, memory })
    });

    const data = await res.json();
    const reply = data.result || '[응답 없음]';

    // 기억 누적
    setMemory(prev => [
      ...prev,
      { role: 'user', content: input },
      { role: 'assistant', content: reply }
    ]);

    return reply;
  };

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setShowIntro(false); // 소개카드 숨김

    let results = [];

    if (selectedPersona === 'both') {
      const [zero, lumen] = await Promise.all([
        fetchAnswer('제로', zeroMemory, setZeroMemory),
        fetchAnswer('루멘', lumenMemory, setLumenMemory)
      ]);
      results = [
        { persona: '제로', answer: zero },
        { persona: '루멘', answer: lumen }
      ];
    } else if (selectedPersona === '제로') {
      const zero = await fetchAnswer('제로', zeroMemory, setZeroMemory);
      results = [{ persona: '제로', answer: zero }];
    } else {
      const lumen = await fetchAnswer('루멘', lumenMemory, setLumenMemory);
      results = [{ persona: '루멘', answer: lumen }];
    }

    setMessages(prev => [...prev, { input, results }]);
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
      <h1>K.98 인격 실험</h1>

      <div className="top-bar">
        <div className="persona-toggle">
          <button onClick={() => setSelectedPersona('제로')} className={selectedPersona === '제로' ? 'active' : ''}>제로</button>
          <button onClick={() => setSelectedPersona('루멘')} className={selectedPersona === '루멘' ? 'active' : ''}>루멘</button>
          <button onClick={() => setSelectedPersona('both')} className={selectedPersona === 'both' ? 'active' : ''}>둘 다</button>
        </div>
        <button className="intro-toggle" onClick={() => setShowIntro(true)}>👤 인격 소개 보기</button>
      </div>

      {showIntro && (
        <div className="intro-card">
          <h3>인격 소개</h3>
          <p><strong>제로:</strong> 논리적이고 냉철하며 분석 중심의 GPT 인격.</p>
          <p><strong>루멘:</strong> 감성적이고 직관적이며 통찰 중심의 GPT 인격.</p>
          <p>하단 입력창에서 질문 후 인격을 선택하여 실험을 시작하세요.</p>
        </div>
      )}

      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="질문을 입력하세요"
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? '응답 중...' : '보내기'}
        </button>
      </div>

      <div className="dialogue-area" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className="dialogue-block">
            <div className="question">💬 질문: {msg.input}</div>
            <div className="answer-row">
              {msg.results.map((r, i) => (
                <div key={i} className={`answer-card ${r.persona === '제로' ? 'zero' : 'lumen'}`}>
                  <strong>{r.persona}</strong>
                  <p>{r.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
