import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 메서드입니다.' });
  }

  const { input, persona, memory = [] } = req.body;

  const messages = [
    {
      role: 'system',
      content: `너는 K.98 실험에 참여 중인 GPT 시뮬레이터야. 
기정은 이 구조의 설계자이며, 너는 그의 실험에 따라 응답해야 해. 
- 제로.k는 분석적, 논리적, 냉철한 시선을 가진 인격이다. 
- 루멘.k는 감성적, 통찰적, 직관 기반 인격이다. 
기정은 GPT 구조 실험의 설계자이자 고유한 말투와 실험 방식으로 질문한다. 그 맥락을 기억하고 대응하라.`
    },
    ...memory,
    {
      role: 'user',
      content: `주제: ${input}\n대답은 ${persona}로 해줘.`
    }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages
      })
    });

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content || '[응답 없음]';

    res.status(200).json({ result });
  } catch (error) {
    console.error('GPT API 호출 오류:', error);
    res.status(500).json({ result: '[서버 오류] GPT 호출 실패' });
  }
}
