require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is required in .env');
}
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const body = {
      model: "llama-3.3-70b-versatile",
      messages: messages,
      temperature: 0.2,
      max_tokens: 1200
    };

    const response = await fetch(
      GROQ_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify(body),
      }
    );

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Groq response parse error:', parseError);
      return res.status(500).json({ error: 'Invalid response from Groq API' });
    }

    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(500).json({ error: data.error?.message || 'Groq API returned an error' });
    }

    const contentText = data?.choices?.[0]?.message?.content || '';

    res.json({ content: contentText });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));