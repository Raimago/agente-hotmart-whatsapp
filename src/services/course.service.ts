import { CourseModel } from '../database/models/course.model';
import { Course, CreateCourseDTO, UpdateCourseDTO } from '../types/course.types';
import { logger } from '../utils/logger';

export class CourseService {
  static async getCourseByHotmartId(hotmartProductId: string): Promise<Course | null> {
    try {
      const course = await CourseModel.getByHotmartId(hotmartProductId);
      if (course) {
        logger.debug('Curso encontrado', { courseId: course.id, name: course.name });
      } else {
        logger.warn('Curso não encontrado', { hotmartProductId });
      }
      return course;
    } catch (error: any) {
      logger.error('Erro ao buscar curso:', error.message);
      throw error;
    }
  }

  static async getCourseById(id: number): Promise<Course> {
    try {
      return await CourseModel.getById(id);
    } catch (error: any) {
      logger.error('Erro ao buscar curso por ID:', error.message);
      throw error;
    }
  }

  static async createCourse(data: CreateCourseDTO): Promise<Course> {
    try {
      // Validar se já existe curso com mesmo hotmart_product_id
      const existing = await CourseModel.getByHotmartId(data.hotmart_product_id);
      if (existing) {
        throw new Error('Já existe um curso com este hotmart_product_id');
      }

      const course = await CourseModel.create(data);
      logger.info('Curso criado com sucesso', { courseId: course.id, name: course.name });
      return course;
    } catch (error: any) {
      logger.error('Erro ao criar curso:', error.message);
      throw error;
    }
  }

  static async updateCourse(id: number, data: UpdateCourseDTO): Promise<Course> {
    try {
      const course = await CourseModel.update(id, data);
      logger.info('Curso atualizado com sucesso', { courseId: id });
      return course;
    } catch (error: any) {
      logger.error('Erro ao atualizar curso:', error.message);
      throw error;
    }
  }

  static async listCourses(): Promise<Course[]> {
    try {
      return await CourseModel.getAll();
    } catch (error: any) {
      logger.error('Erro ao listar cursos:', error.message);
      throw error;
    }
  }

  static async deleteCourse(id: number): Promise<void> {
    try {
      await CourseModel.delete(id);
      logger.info('Curso deletado com sucesso', { courseId: id });
    } catch (error: any) {
      logger.error('Erro ao deletar curso:', error.message);
      throw error;
    }
  }
}


