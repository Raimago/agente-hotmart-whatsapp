import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { logger } from '../utils/logger';

const SESSION_PATH = process.env.WHATSAPP_SESSION_PATH || './sessions';

export class WhatsAppService {
  private static client: Client | null = null;
  private static isReady = false;

  static initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client) {
        if (this.isReady) {
          resolve();
          return;
        }
        reject(new Error('WhatsApp já está inicializando'));
        return;
      }

      logger.info('Inicializando WhatsApp...');

      this.client = new Client({
        authStrategy: new LocalAuth({
          dataPath: SESSION_PATH,
        }),
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
          ],
        },
      });

      this.client.on('qr', (qr) => {
        logger.info('QR Code gerado. Escaneie com seu WhatsApp:');
        qrcode.generate(qr, { small: true });
        console.log('\n');
      });

      this.client.on('ready', () => {
        logger.info('✅ WhatsApp conectado e pronto!');
        this.isReady = true;
        resolve();
      });

      this.client.on('authenticated', () => {
        logger.info('WhatsApp autenticado');
      });

      this.client.on('auth_failure', (msg) => {
        logger.error('Falha na autenticação WhatsApp:', msg);
        this.isReady = false;
        reject(new Error('Falha na autenticação WhatsApp'));
      });

      this.client.on('disconnected', (reason) => {
        logger.warn('WhatsApp desconectado:', reason);
        this.isReady = false;
        this.client = null;
      });

      this.client.initialize().catch((err) => {
        logger.error('Erro ao inicializar WhatsApp:', err);
        reject(err);
      });
    });
  }

  static async sendMessage(phoneNumber: string, message: string): Promise<Message> {
    if (!this.client || !this.isReady) {
      throw new Error('WhatsApp não está conectado. Aguarde a inicialização.');
    }

    // Formatar número (remover caracteres especiais, garantir formato internacional)
    const formattedNumber = this.formatPhoneNumber(phoneNumber);

    if (!formattedNumber) {
      throw new Error('Número de telefone inválido');
    }

    try {
      logger.info(`Enviando mensagem para ${formattedNumber}`);
      const result = await this.client.sendMessage(formattedNumber, message);
      logger.info('Mensagem enviada com sucesso');
      return result;
    } catch (error: any) {
      logger.error('Erro ao enviar mensagem:', error.message);
      throw error;
    }
  }

  static formatPhoneNumber(phone: string): string | null {
    // Remove tudo exceto números
    let cleaned = phone.replace(/\D/g, '');

    // Se não começar com código do país, assume Brasil (55)
    if (cleaned.length === 11 && cleaned.startsWith('55') === false) {
      cleaned = '55' + cleaned;
    }

    // Formato esperado: código país + DDD + número (ex: 5511999999999)
    if (cleaned.length >= 12 && cleaned.length <= 15) {
      return cleaned + '@c.us';
    }

    return null;
  }

  static getQRCode(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.client) {
        resolve(null);
        return;
      }

      // O QR code é emitido no evento 'qr', então precisamos esperar
      const timeout = setTimeout(() => {
        resolve(null);
      }, 30000);

      this.client.once('qr', (qr) => {
        clearTimeout(timeout);
        resolve(qr);
      });
    });
  }

  static isConnected(): boolean {
    return this.isReady && this.client !== null;
  }

  static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.destroy();
      this.client = null;
      this.isReady = false;
      logger.info('WhatsApp desconectado');
    }
  }
}

