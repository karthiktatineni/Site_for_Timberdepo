import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { Groq } from 'groq-sdk'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-chat',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/chat' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
              try {
                const parsedBody = JSON.parse(body);
                const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

                const completion = await groq.chat.completions.create({
                  messages: parsedBody.messages || [],
                  model: "openai/gpt-oss-120b",
                  temperature: 0.6,
                  max_completion_tokens: 1024,
                  stream: false
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(completion));
              } catch (e: any) {
                console.error(e);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message || 'Internal Server Error' }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})
