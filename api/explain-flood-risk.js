// api/explain-flood-risk.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { elevation, rainfall } = req.body;

  const prompt = `
You are a hydrology expert. Analyze the following:

Elevation: ${elevation} meters  
Rainfall: ${rainfall} mm  

Using step-by-step reasoning, assess the flood risk in this area.
`;

  try {
    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          { role: "system", content: "You are a hydrology expert." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    const explanation =
      data?.choices?.[0]?.message?.content || "No explanation generated.";
    return res.status(200).json({ explanation });
  } catch (error) {
    return res.status(500).json({ explanation: `Error: ${error.message}` });
  }
}
