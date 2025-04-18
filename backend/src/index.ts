import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DeepseekClient } from './deepseek';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const deepseekClient = new DeepseekClient(process.env.DEEPSEEK_API_KEY || '');

// Add a simple test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Backend server is running' });
});

app.post('/api/chat', async (req, res) => {
  try {
    console.log('Chat endpoint hit');
    console.log('Request body:', req.body);
    
    const { message, context } = req.body;

    if (!message) {
      console.log('No message provided');
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('Processing message with Deepseek');
    const response = await deepseekClient.generateResponse(message, context);
    console.log('Response from Deepseek:', response);
    
    res.json({ response });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API URL: http://localhost:${port}`);
  console.log(`Test endpoint: http://localhost:${port}/api/test`);
}); 