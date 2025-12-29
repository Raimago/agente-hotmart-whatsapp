import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { logger } from '../utils/logger';

const SESSION_PATH = process.env.WHATSAPP_SESSION_PATH || './sessions';

export class WhatsAppService {
  private static client: Client | null = null;
  private static isReady = false;
  private static currentQRCode: string | null = null;
  private static initializationError: Error | null = null;

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
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-extensions',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-domain-reliability',
            '--disable-features=AudioServiceOutOfProcess,TranslateUI',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-notifications',
            '--disable-popup-blocking',
            '--disable-print-preview',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-speech-api',
            '--disable-sync',
            '--hide-scrollbars',
            '--ignore-gpu-blacklist',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-pings',
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--window-size=1280,720',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
          ],
          timeout: 90000,
          ignoreHTTPSErrors: true,
        },
      });

      this.client.on('qr', (qr) => {
        logger.info('QR Code gerado. Escaneie com seu WhatsApp:');
        qrcode.generate(qr, { small: true });
        console.log('\n');
        // Armazenar QR code para acesso via API
        this.currentQRCode = qr;
        this.initializationError = null;
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
        this.initializationError = err;
        this.currentQRCode = null;
        
        // Limpar cliente para tentar novamente
        if (this.client) {
          try {
            this.client.destroy().catch(() => {});
          } catch (e) {
            // Ignorar erros ao destruir
          }
          this.client = null;
        }
        this.isReady = false;
        
        // Tentar reinicializar após um delay maior
        setTimeout(() => {
          logger.warn('Tentando reinicializar WhatsApp em 60 segundos...');
          this.initializationError = null;
          this.initialize().catch((retryErr) => {
            logger.error('Erro ao reinicializar WhatsApp:', retryErr.message);
          });
        }, 60000);
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
      // Se já temos um QR code armazenado, retornar imediatamente
      if (this.currentQRCode) {
        resolve(this.currentQRCode);
        return;
      }

      // Se não há cliente ou há erro de inicialização, retornar null
      if (!this.client || this.initializationError) {
        resolve(null);
        return;
      }

      // Se o cliente está pronto (já conectado), não há QR code
      if (this.isReady) {
        resolve(null);
        return;
      }

      // Aguardar pelo evento 'qr' (máximo 5 segundos)
      const timeout = setTimeout(() => {
        resolve(this.currentQRCode);
      }, 5000);

      this.client.once('qr', (qr) => {
        clearTimeout(timeout);
        this.currentQRCode = qr;
        resolve(qr);
      });
    });
  }

  static getInitializationError(): Error | null {
    return this.initializationError;
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

