import { HotmartWebhookPayload, ProcessedHotmartData } from '../types/hotmart.types';
import { logger } from '../utils/logger';

export class HotmartService {
  static processWebhook(payload: HotmartWebhookPayload): ProcessedHotmartData {
    logger.debug('Processando webhook da Hotmart', { event: payload.event });

    const product = payload.data?.product;
    const buyer = payload.data?.buyer;
    const order = payload.data?.order;

    // Extrair product ID
    const productId = product?.id || product?.product_id;
    if (!productId) {
      throw new Error('Product ID não encontrado no webhook');
    }

    // Extrair nome do produto
    const productName = product?.name || 'Produto';

    // Extrair dados do comprador
    const buyerName = buyer?.name || 'Cliente';
    const buyerEmail = buyer?.email || '';

    // Extrair telefone
    const phone = buyer?.phone;
    let buyerPhone = '';
    
    if (phone) {
      const countryCode = phone.country_code || '55';
      const areaCode = phone.area_code || '';
      const localNumber = phone.local_number || '';
      
      if (localNumber) {
        buyerPhone = `${countryCode}${areaCode}${localNumber}`;
      }
    }

    if (!buyerPhone) {
      throw new Error('Telefone do comprador não encontrado no webhook');
    }

    const processedData: ProcessedHotmartData = {
      productId: String(productId),
      productName,
      buyerName,
      buyerEmail,
      buyerPhone,
      orderId: order?.order_id,
    };

    logger.info('Webhook processado com sucesso', {
      productId: processedData.productId,
      buyerName: processedData.buyerName,
    });

    return processedData;
  }

  static validateWebhook(payload: any): boolean {
    // Validação básica
    if (!payload || !payload.event || !payload.data) {
      return false;
    }

    // Validar se é evento de abandono de carrinho
    const validEvents = [
      'PURCHASE_ABANDONED_CART',
      'PURCHASE_ABANDONED',
      'abandoned_cart',
    ];

    return validEvents.some((event) => 
      payload.event.toLowerCase().includes(event.toLowerCase())
    );
  }
}


