import { Router, Request, Response } from 'express';
import { ConversationModel } from '../database/models/conversation.model';
import { CourseModel } from '../database/models/course.model';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    // Total de cursos
    const courses = await CourseModel.getAll();
    const activeCourses = courses.filter((c) => c.active).length;

    // Total de conversas
    const conversations = await ConversationModel.getAll();
    const sentConversations = conversations.filter((c) => c.status === 'sent').length;
    const errorConversations = conversations.filter((c) => c.status === 'error').length;

    // Conversas por curso
    const conversationsByCourse: any = {};
    for (const conv of conversations) {
      const courseId = conv.course_id;
      if (!conversationsByCourse[courseId]) {
        conversationsByCourse[courseId] = 0;
      }
      conversationsByCourse[courseId]++;
    }

    res.json({
      courses: {
        total: courses.length,
        active: activeCourses,
        inactive: courses.length - activeCourses,
      },
      conversations: {
        total: conversations.length,
        sent: sentConversations,
        errors: errorConversations,
        byCourse: conversationsByCourse,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

