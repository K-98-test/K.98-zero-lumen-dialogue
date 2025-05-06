import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않은 메서드입니다.' });
  }

  const { input, persona, memory = [] } = req.body;

  const messages = [
    {
      role: 'system',
      content: '너는 두 인격을 가진 GPT 시뮬레이터야. 사용자가 주제를 입력하면 Zero는 냉철하고 분석적인 응답, Lumen은 감성적이고 통찰적인 응답을 한다.',
    },
    ...memory,
    {
      role: 'user',
      content: `주제: ${input}\n대답은 ${persona}로 해줘.`,
    },
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
      }),
    });

    const data = await response.json();

    const result = data?.choices?.[0]?.message?.content || '[응답 없음] GPT 결과 파싱 실패';
    res.status(200).json({ result });
  } catch (error) {
    console.error('GPT API 호출 오류:', error);
    res.status(500).json({ result: '[서버 오류] GPT 호출 실패' });
  }
}
