import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { Groq } from 'groq-sdk'

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/*.crdownload']
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-chat',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/chat') {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
              res.statusCode = 204;
              return res.end();
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  const parsedBody = JSON.parse(body);
                  // Vite doesn't load non-VITE_ env vars into process.env by default in the config server
                  // But we can access them if they were loaded or use loadEnv
                  const apiKey = process.env.GROQ_API_KEY;
                  if (!apiKey) {
                    throw new Error("GROQ_API_KEY is not defined in the environment.");
                  }
                  const groq = new Groq({ apiKey });

                  const completion = await groq.chat.completions.create({
                    messages: parsedBody.messages || [],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.6,
                    max_tokens: 1024,
                    stream: false
                  });

                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(completion));
                } catch (e: any) {
                  console.error(e);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message || 'Internal Server Error' }));
                }
              });
              return;
            }
          }
          next();
        });
      }
    }
  ],
})
