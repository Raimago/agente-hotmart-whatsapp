# Agente Hotmart WhatsApp

Sistema completo de agente de IA que recebe webhooks de abandono de carrinho da Hotmart, identifica o curso, busca configurações personalizadas e inicia conversas no WhatsApp usando OpenAI para gerar mensagens contextualizadas.

## 🚀 Funcionalidades

- ✅ Recebe webhooks de abandono de carrinho da Hotmart
- ✅ Identifica automaticamente qual curso foi abandonado
- ✅ Gera mensagens personalizadas com OpenAI
- ✅ Envia mensagens via WhatsApp automaticamente
- ✅ Gerencia múltiplos cursos com configurações individuais
- ✅ API REST para gerenciar cursos
- ✅ Histórico de conversas
- ✅ Health check e estatísticas

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta OpenAI com API key
- WhatsApp instalado no celular (para autenticação)

## 🔧 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/Raimago/agente-hotmart-whatsapp.git
cd agente-hotmart-whatsapp
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` e adicione suas credenciais:

```env
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=sk-proj-...
WHATSAPP_SESSION_PATH=./sessions
DATABASE_PATH=./data/database.sqlite
LOG_LEVEL=debug
```

4. **Inicialize o banco de dados**

```bash
npm run db:migrate
```

5. **Inicie o servidor**

```bash
npm run dev
```

6. **Autentique o WhatsApp**

Quando o servidor iniciar, um QR Code será exibido no terminal. Escaneie com seu WhatsApp:

- Abra WhatsApp no celular
- Vá em: Configurações > Aparelhos conectados > Conectar um aparelho
- Escaneie o QR Code exibido no terminal

## 📚 Uso

### Cadastrar um Curso

**Via API:**

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "hotmart_product_id": "12345678",
    "name": "Curso de Marketing Digital",
    "openai_prompt": "Você é um assistente de vendas. O cliente {nome} abandonou o carrinho do curso {curso}. Gere uma mensagem amigável e persuasiva em até 150 palavras para WhatsApp.",
    "active": true
  }'
```

**Listar cursos:**

```bash
curl http://localhost:3000/api/courses
```

### Configurar Webhook na Hotmart

1. Acesse o painel da Hotmart
2. Vá em: Configurações > Webhooks
3. Adicione novo webhook:
   - URL: `https://seu-dominio.com/webhook/hotmart`
   - Eventos: Selecionar "Abandono de Carrinho"
   - Salvar

**Para desenvolvimento local, use ngrok:**

```bash
ngrok http 3000
# Use a URL gerada no webhook da Hotmart
```

### Testar Componentes

**Testar OpenAI:**

```bash
curl -X POST http://localhost:3000/api/test/openai \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Gere uma mensagem para João sobre o curso de Python",
    "courseName": "Curso de Python"
  }'
```

**Testar WhatsApp:**

```bash
curl -X POST http://localhost:3000/api/test/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "5511999999999",
    "message": "Mensagem de teste!"
  }'
```

**Health Check:**

```bash
curl http://localhost:3000/health
```

## 🐳 Docker

### Desenvolvimento

```bash
docker-compose up
```

### Produção

```bash
docker build -t agente-hotmart-whatsapp .
docker run -p 3000:3000 --env-file .env agente-hotmart-whatsapp
```

## 📦 Deploy no Coolify

1. **Push para GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Configure no Coolify**

- Tipo: Dockerfile
- Repositório: URL do GitHub
- Variáveis de ambiente: Configure todas do `.env.example`
- Volumes persistentes:
  - `/app/sessions` - Sessão WhatsApp
  - `/app/data` - Banco de dados

3. **Autentique WhatsApp**

Após o deploy, acesse `/api/test/whatsapp/qr` para obter o QR Code ou faça upload da sessão local.

## 📖 API Endpoints

### Webhooks

- `POST /webhook/hotmart` - Recebe webhooks da Hotmart

### Cursos

- `GET /api/courses` - Lista todos os cursos
- `GET /api/courses/:id` - Busca curso por ID
- `POST /api/courses` - Cria novo curso
- `PUT /api/courses/:id` - Atualiza curso
- `DELETE /api/courses/:id` - Deleta curso

### Conversas

- `GET /api/conversations` - Lista todas as conversas
- `GET /api/conversations?courseId=1` - Conversas de um curso
- `GET /api/conversations/:id` - Busca conversa por ID

### Testes

- `POST /api/test/openai` - Testa geração de mensagem
- `POST /api/test/whatsapp` - Testa envio de mensagem
- `GET /api/test/whatsapp/qr` - Obtém QR Code

### Monitoramento

- `GET /health` - Health check
- `GET /api/stats` - Estatísticas do sistema

## 🔐 Segurança

- ✅ Variáveis sensíveis apenas em `.env` (não commitado)
- ✅ Rate limiting em webhooks
- ✅ Validação de payloads
- ✅ Sanitização de inputs
- ✅ Logs sem dados sensíveis

## 🛠️ Scripts

- `npm run dev` - Inicia em modo desenvolvimento
- `npm run build` - Compila TypeScript
- `npm run start` - Inicia em produção
- `npm run db:migrate` - Executa migrações
- `npm test` - Roda testes
- `npm run add-course` - Script interativo para adicionar curso

## 📝 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `PORT` | Porta do servidor | Não (padrão: 3000) |
| `NODE_ENV` | Ambiente (development/production) | Não |
| `OPENAI_API_KEY` | Chave da API OpenAI | ✅ Sim |
| `WHATSAPP_SESSION_PATH` | Caminho das sessões WhatsApp | Não |
| `DATABASE_PATH` | Caminho do banco SQLite | Não |
| `HOTMART_WEBHOOK_SECRET` | Secret para validar webhooks | Não |
| `LOG_LEVEL` | Nível de log (debug/info/warn/error) | Não |

## 🐛 Troubleshooting

**WhatsApp não conecta:**
- Verifique se escaneou o QR Code
- Verifique se a pasta `sessions/` existe e tem permissão de escrita
- Reinicie o servidor

**OpenAI não responde:**
- Verifique se a API key está correta
- Verifique créditos na conta OpenAI
- Veja os logs para mais detalhes

**Curso não encontrado:**
- Verifique se o `hotmart_product_id` está correto
- Verifique se o curso está ativo no banco
- Liste cursos: `GET /api/courses`

## 📄 Licença

MIT

## 👤 Autor

Raimago

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

