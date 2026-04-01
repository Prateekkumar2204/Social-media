const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const moderateWithGemini = async (commentText) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are a strict moderation classifier for a college social platform.

Your task is to analyze a user comment and decide whether it is a toxic personal attack, harassment, bullying, or abusive targeted message.

Rules:
- Focus ONLY on attacks directed at a person.
- Do NOT mark as toxic for normal disagreement, criticism of ideas, or polite correction.
- Mark toxic if it insults, humiliates, threatens, tells someone to leave, says nobody wants them, or attacks them personally.
- Return ONLY valid JSON.
- No markdown.
- No explanation outside JSON.

Required JSON format:
{
  "isToxic": true,
  "confidence": 0.91,
  "reason": "short_reason"
}
          `.trim()
        },
        {
          role: "user",
          content: commentText
        }
      ]
    });

    let text = completion.choices[0]?.message?.content?.trim() || "";

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.slice(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(text);

    if (
      typeof parsed.isToxic !== "boolean" ||
      typeof parsed.confidence !== "number" ||
      typeof parsed.reason !== "string"
    ) {
      return {
        isToxic: true,
        confidence: 1,
        reason: "invalid_llm_response_fail_closed"
      };
    }

    return parsed;
  } catch (error) {
    console.log("Groq moderation error:", error);

    return {
      isToxic: true,
      confidence: 1,
      reason: "llm_unavailable_fail_closed"
    };
  }
};

module.exports = { moderateWithGemini };