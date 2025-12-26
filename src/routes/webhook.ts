import { Router, Request, Response } from 'express';
import { HotmartService } from '../services/hotmart.service';
import { CourseService } from '../services/course.service';
import { OpenAIService } from '../services/openai.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { ConversationModel } from '../database/models/conversation.model';
import { logger } from '../utils/logger';

const router = Router();

router.post('/hotmart', async (req: Request, res: Response) => {
  try {
    logger.info('Webhook recebido da Hotmart');

    // Validar webhook
    if (!HotmartService.validateWebhook(req.body)) {
      logger.warn('Webhook inválido ou evento não suportado');
      return res.status(400).json({ error: 'Webhook inválido' });
    }

    // Processar dados do webhook
    const processedData = HotmartService.processWebhook(req.body);

    // Buscar curso no banco
    const course = await CourseService.getCourseByHotmartId(processedData.productId);

    if (!course) {
      logger.warn('Curso não encontrado', { productId: processedData.productId });
      return res.status(404).json({
        error: 'Curso não encontrado',
        productId: processedData.productId,
      });
    }

    // Gerar mensagem com OpenAI
    logger.info('Gerando mensagem com OpenAI...');
    const message = await OpenAIService.generateMessage({
      prompt: course.openai_prompt,
      courseName: course.name,
      clientName: processedData.buyerName,
      clientEmail: processedData.buyerEmail,
      clientPhone: processedData.buyerPhone,
    });

    // Enviar mensagem via WhatsApp
    logger.info('Enviando mensagem via WhatsApp...');
    await WhatsAppService.sendMessage(processedData.buyerPhone, message);

    // Salvar conversa no banco
    await ConversationModel.create({
      course_id: course.id!,
      phone_number: processedData.buyerPhone,
      hotmart_order_id: processedData.orderId,
      initial_message: message,
      status: 'sent',
    });

    logger.info('Processo concluído com sucesso', {
      courseId: course.id,
      phoneNumber: processedData.buyerPhone,
    });

    return res.json({
      success: true,
      message: 'Webhook processado com sucesso',
      course: course.name,
      messageSent: true,
    });
  } catch (error: any) {
    logger.error('Erro ao processar webhook:', error.message);
    return res.status(500).json({
      error: 'Erro ao processar webhook',
      message: error.message,
    });
  }
});

export default router;

