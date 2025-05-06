import React, { useState } from 'react';

function App() {
  const [topic, setTopic] = useState('');
  const [submittedTopic, setSubmittedTopic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedTopic(topic.trim());
  };

  const getZeroResponse = (topic) => {
    if (!topic) return '';
    return `Zero: "${topic}"에 대해 감정은 배제하고 본질에 집중해야 합니다.`;
  };

  const getLumenResponse = (topic) => {
    if (!topic) return '';
    return `Lumen: "${topic}"은(는) 당신의 감정이 중요합니다. 스스로를 돌보세요.`;
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>제로 vs 루멘 대화</h1>
      {!submittedTopic ? (
        <form onSubmit={handleSubmit}>
          <label>주제를 입력하세요:</label>
          <br />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{ width: '300px', padding: '0.5rem', marginTop: '0.5rem' }}
          />
          <br />
          <button type="submit" style={{ marginTop: '1rem' }}>대화 시작</button>
        </form>
      ) : (
        <div>
          <p><strong>입력 주제:</strong> {submittedTopic}</p>
          <p>{getZeroResponse(submittedTopic)}</p>
          <p>{getLumenResponse(submittedTopic)}</p>
          <button onClick={() => { setTopic(''); setSubmittedTopic(''); }}>다시 시작</button>
        </div>
      )}
    </div>
  );
}

export default App;
