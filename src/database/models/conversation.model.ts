import { db } from '../db';
import { Conversation } from '../../types/course.types';

export class ConversationModel {
  static async create(data: Omit<Conversation, 'id' | 'created_at'>): Promise<Conversation> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO conversations (course_id, phone_number, hotmart_order_id, initial_message, status)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      db.run(
        sql,
        [
          data.course_id,
          data.phone_number,
          data.hotmart_order_id || null,
          data.initial_message,
          data.status || 'sent',
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            ConversationModel.getById(this.lastID)
              .then(resolve)
              .catch(reject);
          }
        }
      );
    });
  }

  static async getById(id: number): Promise<Conversation> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM conversations WHERE id = ?';
      db.get(sql, [id], (err, row: any) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error('Conversa não encontrada'));
        } else {
          resolve({
            id: row.id,
            course_id: row.course_id,
            phone_number: row.phone_number,
            hotmart_order_id: row.hotmart_order_id,
            initial_message: row.initial_message,
            status: row.status,
            created_at: row.created_at,
          });
        }
      });
    });
  }

  static async getByCourseId(courseId: number): Promise<Conversation[]> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM conversations WHERE course_id = ? ORDER BY created_at DESC';
      db.all(sql, [courseId], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            rows.map((row) => ({
              id: row.id,
              course_id: row.course_id,
              phone_number: row.phone_number,
              hotmart_order_id: row.hotmart_order_id,
              initial_message: row.initial_message,
              status: row.status,
              created_at: row.created_at,
            }))
          );
        }
      });
    });
  }

  static async getAll(): Promise<Conversation[]> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM conversations ORDER BY created_at DESC';
      db.all(sql, [], (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            rows.map((row) => ({
              id: row.id,
              course_id: row.course_id,
              phone_number: row.phone_number,
              hotmart_order_id: row.hotmart_order_id,
              initial_message: row.initial_message,
              status: row.status,
              created_at: row.created_at,
            }))
          );
        }
      });
    });
  }
}


