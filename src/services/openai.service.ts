import OpenAI from 'openai';
import { logger } from '../utils/logger';

let openai: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }
  
  if (!openai) {
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  
  return openai;
};

export interface GenerateMessageParams {
  prompt: string;
  courseName: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  purchaseLink?: string;
}

export class OpenAIService {
  static async generateMessage(params: GenerateMessageParams): Promise<string> {
    try {
      const client = getOpenAIClient();
      
      logger.debug('Gerando mensagem com OpenAI', { courseName: params.courseName });

      const systemPrompt = `Você é um assistente de vendas especializado em recuperação de carrinho abandonado. 
Gere mensagens personalizadas, amigáveis e persuasivas para WhatsApp. 
Seja conciso (máximo 200 palavras), use emojis moderadamente e foque nos benefícios do produto.`;

      const userPrompt = params.prompt
        .replace(/{nome}/g, params.clientName)
        .replace(/{curso}/g, params.courseName)
        .replace(/{email}/g, params.clientEmail || '')
        .replace(/{telefone}/g, params.clientPhone || '')
        .replace(/{link}/g, params.purchaseLink || '');
      
      // Se o prompt não contém {link} mas temos um link, adiciona no final
      let finalPrompt = userPrompt;
      if (params.purchaseLink && !userPrompt.includes('{link}') && !userPrompt.includes(params.purchaseLink)) {
        finalPrompt = `${userPrompt}\n\nLink para comprar: ${params.purchaseLink}`;
      }

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: finalPrompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const message = response.choices[0]?.message?.content?.trim();

      if (!message) {
        throw new Error('Resposta vazia da OpenAI');
      }

      logger.info('Mensagem gerada com sucesso');
      return message;
    } catch (error: any) {
      logger.error('Erro ao gerar mensagem com OpenAI:', error.message);
      throw error;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const client = getOpenAIClient();
      await client.models.list();
      return true;
    } catch (error) {
      return false;
    }
  }
}

