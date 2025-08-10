import express from "express";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

app.post("/api/generate", async (req, res) => {
  try {
    const { gameType } = req.body;
    const prompt = `Generate a JSON object with:
    - name
    - backstory
    - stats
    - lore
    - mechanics_note
    for a ${gameType} character in a game called Gamopedia.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });

    res.json({ ok: true, text: completion.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});