import { Router, Request, Response } from 'express';
import { ConversationModel } from '../database/models/conversation.model';

const router = Router();

// Listar todas as conversas
router.get('/', async (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseId;
    
    if (courseId) {
      const id = parseInt(courseId as string);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'courseId inválido' });
      }
      const conversations = await ConversationModel.getByCourseId(id);
      return res.json(conversations);
    }

    const conversations = await ConversationModel.getAll();
    return res.json(conversations);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Buscar conversa por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const conversation = await ConversationModel.getById(id);
    return res.json(conversation);
  } catch (error: any) {
    if (error.message.includes('não encontrada')) {
      return res.status(404).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

export default router;

