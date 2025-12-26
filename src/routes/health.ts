import { Router, Request, Response } from 'express';
import { WhatsAppService } from '../services/whatsapp.service';
import { OpenAIService } from '../services/openai.service';
import { db } from '../database/db';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const health: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };

  // Verificar WhatsApp
  try {
    health.whatsapp = WhatsAppService.isConnected() ? 'connected' : 'disconnected';
  } catch (error) {
    health.whatsapp = 'error';
  }

  // Verificar OpenAI
  try {
    const openaiOk = await OpenAIService.testConnection();
    health.openai = openaiOk ? 'configured' : 'error';
  } catch (error) {
    health.openai = 'error';
  }

  // Verificar banco de dados
  try {
    db.get('SELECT 1', (err) => {
      if (err) {
        health.database = 'error';
      } else {
        health.database = 'connected';
      }
    });
  } catch (error) {
    health.database = 'error';
  }

  const allOk = 
    health.whatsapp === 'connected' &&
    health.openai === 'configured' &&
    health.database === 'connected';

  res.status(allOk ? 200 : 503).json(health);
});

export default router;

