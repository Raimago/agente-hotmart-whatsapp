import { Router, Request, Response } from 'express';
import { OpenAIService } from '../services/openai.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { logger } from '../utils/logger';

const router = Router();

// Testar OpenAI
router.post('/openai', async (req: Request, res: Response) => {
  try {
    const { prompt, courseName } = req.body;

    if (!prompt || !courseName) {
      return res.status(400).json({
        error: 'Campos obrigatórios: prompt, courseName',
      });
    }

    const message = await OpenAIService.generateMessage({
      prompt,
      courseName,
      clientName: req.body.clientName || 'João Silva',
      clientEmail: req.body.clientEmail,
      clientPhone: req.body.clientPhone,
    });

    return res.json({
      success: true,
      message,
    });
  } catch (error: any) {
    logger.error('Erro ao testar OpenAI:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Testar WhatsApp
router.post('/whatsapp', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        error: 'Campos obrigatórios: phoneNumber, message',
      });
    }

    if (!WhatsAppService.isConnected()) {
      return res.status(503).json({
        error: 'WhatsApp não está conectado. Aguarde a inicialização.',
      });
    }

    const result = await WhatsAppService.sendMessage(phoneNumber, message);

    return res.json({
      success: true,
      messageId: result.id._serialized,
      to: result.to,
    });
  } catch (error: any) {
    logger.error('Erro ao testar WhatsApp:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Status do WhatsApp
router.get('/whatsapp/status', async (_req: Request, res: Response) => {
  try {
    const connected = WhatsAppService.isConnected();
    
    return res.json({
      connected,
      message: connected 
        ? 'WhatsApp está conectado' 
        : 'WhatsApp não está conectado. Verifique os logs para obter o QR code.',
    });
  } catch (error: any) {
    logger.error('Erro ao verificar status do WhatsApp:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Obter QR Code do WhatsApp
router.get('/whatsapp/qr', async (_req: Request, res: Response) => {
  try {
    const qr = await WhatsAppService.getQRCode();
    
    if (!qr) {
      return res.status(404).json({
        error: 'QR Code não disponível. WhatsApp pode já estar conectado ou não inicializou.',
        connected: WhatsAppService.isConnected(),
      });
    }

    return res.json({
      qrCode: qr,
      connected: WhatsAppService.isConnected(),
    });
  } catch (error: any) {
    logger.error('Erro ao obter QR Code:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default router;

