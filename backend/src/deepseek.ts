import axios from 'axios';

export class DeepseekClient {
  private readonly apiKey: string;
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

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
          model: 'deepseek/deepseek-chat-v3-0324:free',
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