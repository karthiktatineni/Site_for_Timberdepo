import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const messages = req.body.messages || [{"role":"user","content":""}];

    const chatCompletion = await groq.chat.completions.create({
      "messages": messages,
      "model": "openai/gpt-oss-120b",
      "temperature": 1,
      "max_completion_tokens": 8192,
      "top_p": 1,
      "stream": false, // False so we can return standard JSON to our frontend easily
      "reasoning_effort": "medium",
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
