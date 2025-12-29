export interface HotmartWebhookPayload {
  event: string;
  data: {
    product?: {
      id?: string;
      product_id?: string;
      name?: string;
    };
    buyer?: {
      name?: string;
      email?: string;
      phone?: {
        local_number?: string;
        country_code?: string;
        area_code?: string;
      };
    };
    order?: {
      order_id?: string;
    };
    [key: string]: any;
  };
}

export interface ProcessedHotmartData {
  productId: string;
  productName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  orderId?: string;
}


