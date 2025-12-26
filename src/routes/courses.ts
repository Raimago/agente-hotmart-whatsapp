import { Router, Request, Response } from 'express';
import { CourseService } from '../services/course.service';
import { CreateCourseDTO, UpdateCourseDTO } from '../types/course.types';
import { logger } from '../utils/logger';

const router = Router();

// Listar todos os cursos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const courses = await CourseService.listCourses();
    res.json(courses);
  } catch (error: any) {
    logger.error('Erro ao listar cursos:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Buscar curso por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const course = await CourseService.getCourseById(id);
    return res.json(course);
  } catch (error: any) {
    logger.error('Erro ao buscar curso:', error.message);
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Criar novo curso
router.post('/', async (req: Request, res: Response) => {
  try {
    const data: CreateCourseDTO = req.body;

    // Validações básicas
    if (!data.hotmart_product_id || !data.name || !data.openai_prompt) {
      return res.status(400).json({
        error: 'Campos obrigatórios: hotmart_product_id, name, openai_prompt',
      });
    }

    const course = await CourseService.createCourse(data);
    return res.status(201).json(course);
  } catch (error: any) {
    logger.error('Erro ao criar curso:', error.message);
    if (error.message.includes('já existe')) {
      return res.status(409).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Atualizar curso
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const data: UpdateCourseDTO = req.body;
    const course = await CourseService.updateCourse(id, data);
    return res.json(course);
  } catch (error: any) {
    logger.error('Erro ao atualizar curso:', error.message);
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Deletar curso
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    await CourseService.deleteCourse(id);
    return res.json({ message: 'Curso deletado com sucesso' });
  } catch (error: any) {
    logger.error('Erro ao deletar curso:', error.message);
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

export default router;

