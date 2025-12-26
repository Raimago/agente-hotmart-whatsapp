import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import { runMigrations } from './database/migrations/run';
import { WhatsAppService } from './services/whatsapp.service';

// Rotas
import webhookRoutes from './routes/webhook';
import coursesRoutes from './routes/courses';
import testRoutes from './routes/test';
import healthRoutes from './routes/health';
import statsRoutes from './routes/stats';
import conversationsRoutes from './routes/conversations';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting para webhooks
const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas requisições, tente novamente mais tarde.',
});

// Rotas
app.use('/webhook', webhookLimiter, webhookRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/test', testRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/health', healthRoutes);

// Rota raiz
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Agente Hotmart WhatsApp',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      webhook: '/webhook/hotmart',
      courses: '/api/courses',
      health: '/health',
      stats: '/api/stats',
      test: '/api/test',
    },
  });
});

// Tratamento de erros
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Erro não tratado:', err.message);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Rota 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicialização
async function startServer() {
  try {
    // Executar migrações
    logger.info('Executando migrações do banco de dados...');
    await runMigrations();

    // Inicializar WhatsApp (não bloqueia o servidor)
    logger.info('Inicializando WhatsApp...');
    WhatsAppService.initialize().catch((err) => {
      logger.error('Erro ao inicializar WhatsApp:', err.message);
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor rodando na porta ${PORT}`);
      logger.info(`📱 Aguardando autenticação do WhatsApp...`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error: any) {
    logger.error('Erro ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recebido, encerrando servidor...');
  await WhatsAppService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT recebido, encerrando servidor...');
  await WhatsAppService.disconnect();
  process.exit(0);
});

startServer();

