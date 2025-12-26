import { db } from '../db';
import { Course, CreateCourseDTO, UpdateCourseDTO } from '../../types/course.types';

export class CourseModel {
  static async create(data: CreateCourseDTO): Promise<Course> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO courses (hotmart_product_id, name, openai_prompt, whatsapp_message_template, active)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.run(
        sql,
        [
          data.hotmart_product_id,
          data.name,
          data.openai_prompt,
          data.whatsapp_message_template || null,
          data.active !== undefined ? data.active : true,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            CourseModel.getById(this.lastID)
              .then(resolve)
              .catch(reject);
          }
        }
      );
    });
  }

  static async getById(id: number): Promise<Course> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM courses WHERE id = ?';
      db.get(sql, [id], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error('Curso não encontrado'));
        } else {
          resolve({
            id: row.id,
            hotmart_product_id: row.hotmart_product_id,
            name: row.name,
            openai_prompt: row.openai_prompt,
            whatsapp_message_template: row.whatsapp_message_template,
            active: Boolean(row.active),
            created_at: row.created_at,
            updated_at: row.updated_at,
          });
        }
      });
    });
  }

  static async getByHotmartId(hotmartProductId: string): Promise<Course | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM courses WHERE hotmart_product_id = ? AND active = 1';
      db.get(sql, [hotmartProductId], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            id: row.id,
            hotmart_product_id: row.hotmart_product_id,
            name: row.name,
            openai_prompt: row.openai_prompt,
            whatsapp_message_template: row.whatsapp_message_template,
            active: Boolean(row.active),
            created_at: row.created_at,
            updated_at: row.updated_at,
          });
        }
      });
    });
  }

  static async getAll(): Promise<Course[]> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM courses ORDER BY created_at DESC';
      db.all(sql, [], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            rows.map((row) => ({
              id: row.id,
              hotmart_product_id: row.hotmart_product_id,
              name: row.name,
              openai_prompt: row.openai_prompt,
              whatsapp_message_template: row.whatsapp_message_template,
              active: Boolean(row.active),
              created_at: row.created_at,
              updated_at: row.updated_at,
            }))
          );
        }
      });
    });
  }

  static async update(id: number, data: UpdateCourseDTO): Promise<Course> {
    return new Promise((resolve, reject) => {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.name !== undefined) {
        updates.push('name = ?');
        values.push(data.name);
      }
      if (data.openai_prompt !== undefined) {
        updates.push('openai_prompt = ?');
        values.push(data.openai_prompt);
      }
      if (data.whatsapp_message_template !== undefined) {
        updates.push('whatsapp_message_template = ?');
        values.push(data.whatsapp_message_template);
      }
      if (data.active !== undefined) {
        updates.push('active = ?');
        values.push(data.active);
      }

      if (updates.length === 0) {
        CourseModel.getById(id).then(resolve).catch(reject);
        return;
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const sql = `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`;
      
      db.run(sql, values, (err) => {
        if (err) {
          reject(err);
        } else {
          CourseModel.getById(id).then(resolve).catch(reject);
        }
      });
    });
  }

  static async delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM courses WHERE id = ?';
      db.run(sql, [id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

