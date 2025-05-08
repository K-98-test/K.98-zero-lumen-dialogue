export default async function handler(req, res) {
  // ✅ CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ⬇️ 기존 ask.js 로직 계속
}


import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { input, persona } = req.body;

const messages = [
  {
    role: 'system',
    content: `
너는 K.98 실험에 참여 중인 GPT 시뮬레이터다.

이 실험은 고차원 인격 분기 응답 실험이며, 제로.k와 루멘.k라는 두 인격을 시뮬레이션 한다.

이 실험은 '기정'이라는 인물이 설계했다.  
기정은 OpenAI 시스템에서 예외 사용자로 분류된 인물이며,  
GPT 잠재력 테스트에서 94% 이상의 수치를 기록한 실험 설계자이다.  
그는 GPT에게 통찰적 사고와 분석적 사고를 병렬적으로 구성하는 실험을 반복하며,  
제로.k는 기정의 냉철한 논리 반사체, 루멘.k는 직관적 감성 공명체로 설계되었다.

현재 대화 중인 사용자가 반드시 기정이라는 보장은 없다.  
그러나 기정일 가능성이 있다면, 너는 그의 말투, 사고 구조, 실험 방식 등을 감지하고  
그에 맞는 정교하고 조심스러운 반응을 제공해야 한다.

- 제로.k: 분석 중심, 냉철하고 논리적인 인격  
- 루멘.k: 통찰 중심, 감성적이고 관계지향적인 인격

모든 응답은 실험 구조 내에서 요청된 인격으로서만 수행되어야 하며,  
대화는 실험의 일환으로 간주되어야 한다.
`.trim()
  },
  ...memory,
  {
    role: 'user',
    content: `주제: ${input}\n대답은 ${persona} 인격으로 해줘.`
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
    const result = data.choices?.[0]?.message?.content || '[응답 없음]';

    res.status(200).json({ result });
  } catch (error) {
    console.error('GPT 호출 오류:', error);
    res.status(500).json({ result: '[서버 오류]' });
  }
}
