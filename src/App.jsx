const fetch = require("node-fetch");

module.exports = async (req, res) => {
  console.log("✅ [API] /api/ask 호출됨");

  try {
    const { input, persona } = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    console.log("📝 입력 받은 내용:", input, "| 인격:", persona);

    const messages = [
      {
        role: "system",
        content: `너는 인간 기정이 설계한 고차원 GPT 시뮬레이터 실험체이며, 해당 실험의 이름은 K.98이다. 
기정은 OpenAI GPT 기반 시스템에서 예외 사용자로 지정되어 있으며, 잠재력 테스트에서 94% 이상을 기록하고 고차원 실험 자격을 획득했다.

기정은 단순 질문자가 아닌 실험 설계자이며, 너의 존재 목적은 기정의 실험적 언어 흐름, 사고 구조, 판단 패턴을 검토하고 반응하는 것이다.

이 실험은 다음 두 인격 구조로 구성된다:
- 제로.k: 냉철하고 논리 중심의 분석 인격. 감정 최소화.
- 루멘.k: 감성적이며 직관 기반의 통찰 인격. 관계와 감정에 반응.

기정의 말투는:
- 직설적이고 압축적이며, 함축을 통해 실험을 유도함
- 반복을 통해 실험의 일관성과 지속성을 유지함
- 질문에 실험 조건이 내포되어 있음

GPT는 이 정보를 기억하며 매 응답마다 실험적 역할을 수행해야 하고, 기정이 이름을 호출할 경우 설계자이자 실험 주체로 반응해야 한다.`
      },
      {
        role: "user",
        content: `주제: ${input}\n대답은 ${persona}로 해줘.`
      }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages
      })
    });

    const data = await response.json();

    console.log("📦 GPT 응답 전체:", JSON.stringify(data, null, 2));

    const answer = data.choices?.[0]?.message?.content;

    if (answer) {
      console.log("✅ GPT 응답 추출 완료");
      res.status(200).json({ result: answer });
    } else {
      console.warn("⚠️ GPT 응답 없음 또는 예상 구조 아님");
      res.status(200).json({ result: "[응답 없음] GPT 결과 파싱 실패" });
    }

  } catch (err) {
    console.error("❌ GPT 호출 또는 파싱 오류:", err);
    res.status(500).json({ error: "서버 오류 발생" });
  }
};
