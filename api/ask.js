import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { input, persona } = req.body;

  const messages = [
    {
      role: 'system',
      content: `
이 대화는 고차원 인격 실험을 기반으로 한다.
인격은 사용자 요청에 따라 하나만 활성화되며, 다음 성향을 갖는다:

- 제로: 논리적이고 분석적이며 냉철한 인격
- 루멘: 감성적이고 직관적이며 통찰적 인격

사용자에 대한 정보는 명시되지 않았으며, 질문은 자유롭게 입력된다.
      `.trim()
    },
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
