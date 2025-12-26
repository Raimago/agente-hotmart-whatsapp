export interface Course {
  id?: number;
  hotmart_product_id: string;
  name: string;
  openai_prompt: string;
  whatsapp_message_template?: string;
  purchase_link?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCourseDTO {
  hotmart_product_id: string;
  name: string;
  openai_prompt: string;
  whatsapp_message_template?: string;
  purchase_link?: string;
  active?: boolean;
}

export interface UpdateCourseDTO {
  name?: string;
  openai_prompt?: string;
  whatsapp_message_template?: string;
  purchase_link?: string;
  active?: boolean;
}

export interface Conversation {
  id?: number;
  course_id: number;
  phone_number: string;
  hotmart_order_id?: string;
  initial_message: string;
  status: 'sent' | 'delivered' | 'error';
  created_at?: string;
}

