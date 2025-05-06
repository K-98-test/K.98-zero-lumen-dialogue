const fetch = require("node-fetch");

module.exports = async (req, res) => {
  try {
    const { input, persona } = typeof req.body === "string"
      ? JSON.parse(req.body)
      : req.body;

    const messages = [
      {
        role: "system",
        content: "너는 두 인격을 가진 GPT 시뮬레이터야. 사용자가 주제를 입력하면 Zero는 냉철하고 분석적인 응답, Lumen은 감성적이고 통찰적인 응답을 한다."
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
    const answer = data.choices?.[0]?.message?.content || "응답 없음";

    res.status(200).json({ result: answer });
  } catch (err) {
    console.error("OpenAI API 오류:", err);
    res.status(500).json({ error: "서버 오류" });
  }
};
