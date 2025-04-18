import axios from 'axios';

export class DeepseekClient {
  private readonly apiKey: string;
  private readonly apiUrl: string = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(message: string, context: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          messages: [
            {
              role: 'system',
              content: context
            },
            {
              role: 'user',
              content: message
            }
          ],
          model: process.env.DEEPSEEK_MODEL,
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      throw new Error('Failed to generate response from Deepseek');
    }
  }
} 