import axios from 'axios';
import { startingContext } from './startingContext.ts';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ProductInfo {
  partNumber: string;
  name: string;
  description: string;
  compatibility: string[];
  installationGuide?: string;
}

class ChatService {
  private readonly API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  async processMessage(message: string): Promise<string> {
    try {
      console.log('Processing message:', message);
      console.log('API URL:', this.API_URL);
      
      // First, check if the message is about a specific part number
      const partNumberMatch = message.match(/PS\d{8}/);

      // Check if the message is about compatibility
      // if (message.toLowerCase().includes('compatible')) {
      //   console.log('Compatibility check requested');
      //   const modelMatch = message.match(/[A-Z0-9]{10,}/);
      //   if (modelMatch) {
      //     console.log('Model number match found:', modelMatch[0]);
      //     const modelNumber = modelMatch[0];
      //     return await this.checkCompatibility(modelNumber);
      //   }
      // }

      // For general queries, use the Deepseek model
      console.log('Sending request to backend API');
      const response = await axios.post(
        `${this.API_URL}/api/chat`,
        {
          message,
          context: startingContext
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Response received:', response.data);
      
      if (response.data && response.data.response) {
        return response.data.response;
      } else {
        console.error('Unexpected response format:', response.data);
        return 'I apologize, but I received an unexpected response format. Please try again.';
      }
    } catch (error) {
      console.error('Error processing message:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data
          }
        });
      }
      return 'I apologize, but I encountered an error processing your request. Please try again later.';
    }
  }

  private formatProductResponse(productInfo: ProductInfo): string {
    return `
Part Information:
----------------
Part Number: ${productInfo.partNumber}
Name: ${productInfo.name}
Description: ${productInfo.description}

Compatible Models:
${productInfo.compatibility.map(model => `- ${model}`).join('\n')}

${productInfo.installationGuide ? `Installation Guide:\n${productInfo.installationGuide}` : ''}
    `.trim();
  }

  // private async checkCompatibility(modelNumber: string): Promise<string> {
  //   // TODO: Implement actual compatibility check
  //   return `I'll check the compatibility for model ${modelNumber}. Please provide the part number you're interested in.`;
  // }
}

export const chatService = new ChatService(); 