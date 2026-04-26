import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const messages = req.body.messages || [{"role":"user","content":""}];

    const chatCompletion = await groq.chat.completions.create({
      "messages": messages,
      "model": "llama-3.3-70b-versatile",
      "temperature": 1,
      "max_tokens": 1024,
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    res.status(200).json({
      choices: [
        {
          message: {
            content: chatCompletion.choices[0]?.message?.content || ''
          }
        }
      ]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
