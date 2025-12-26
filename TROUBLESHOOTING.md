# 🔧 Troubleshooting - Problemas no Deploy

## ❌ Erro: "Bad Gateway" / "no available server"

Este erro indica que o servidor não está iniciando corretamente no Coolify.

### Possíveis Causas e Soluções

#### 1. ✅ Variáveis de Ambiente Não Configuradas

**Verifique no Coolify se todas as variáveis estão configuradas:**

```env
PORT=3000
NODE_ENV=production
OPENAI_API_KEY=sk-proj-sua-chave-aqui
WHATSAPP_SESSION_PATH=/app/sessions
DATABASE_PATH=/app/data/database.sqlite
LOG_LEVEL=info
```

**Como verificar:**
- Coolify > Seu App > Environment Variables
- Certifique-se que todas estão presentes

#### 2. ✅ Volumes Persistentes Não Configurados

**Configure os volumes no Coolify:**

- `/app/sessions` - Para manter sessão WhatsApp entre restarts
- `/app/data` - Para persistir banco de dados SQLite

**Como configurar:**
- Coolify > Seu App > Volumes
- Adicione os volumes acima

#### 3. ✅ Erro na Inicialização (Verificar Logs)

**Acesse os logs no Coolify:**
- Coolify > Seu App > Logs
- Procure por erros como:
  - `Erro ao executar migração`
  - `Erro ao iniciar servidor`
  - `OPENAI_API_KEY não configurada`
  - `ENOENT: no such file or directory`

#### 4. ✅ Porta Incorreta

**Certifique-se que:**
- A variável `PORT=3000` está configurada
- O Coolify está configurado para usar a porta 3000
- O health check está configurado para `/health`

#### 5. ✅ Arquivos SQL de Migração

Se os logs mostrarem erro sobre arquivos SQL não encontrados, isso foi corrigido no último commit.

**Solução:** Faça um novo deploy para pegar a correção.

### 🔍 Como Diagnosticar

#### Passo 1: Verificar Logs

No Coolify, acesse:
1. Seu aplicativo
2. Clique em "Logs" ou "Show Debug Logs"
3. Procure por:
   - Mensagens de erro em vermelho
   - "Erro ao executar migração"
   - "Erro ao iniciar servidor"
   - Qualquer stack trace

#### Passo 2: Verificar Variáveis de Ambiente

No Coolify:
1. Seu aplicativo > Environment Variables
2. Verifique se todas as variáveis necessárias estão presentes
3. Verifique se não há espaços extras ou aspas

#### Passo 3: Testar Localmente

Teste localmente para garantir que funciona:

```bash
# Instalar dependências
npm install

# Compilar
npm run build

# Executar migrações
npm run db:migrate

# Iniciar servidor
npm start
```

#### Passo 4: Verificar Build do Docker

Se o build falhar:
1. Verifique se `package-lock.json` está no repositório
2. Verifique se o Dockerfile está correto
3. Tente fazer build local:

```bash
docker build -t teste .
docker run -p 3000:3000 --env-file .env teste
```

### 🚨 Erros Comuns

#### Erro: "OPENAI_API_KEY não configurada"
**Solução:** Adicione a variável `OPENAI_API_KEY` no Coolify

#### Erro: "Arquivo de migração não encontrado"
**Solução:** Já foi corrigido. Faça um novo deploy.

#### Erro: "Cannot find module"
**Solução:** O build não compilou corretamente. Verifique os logs do build.

#### Erro: "EACCES: permission denied"
**Solução:** Problema de permissões nos volumes. Verifique no Coolify.

### 📋 Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] Todas as variáveis de ambiente configuradas no Coolify
- [ ] Volumes persistentes configurados (`/app/sessions`, `/app/data`)
- [ ] Porta configurada corretamente (3000)
- [ ] Health check configurado (`/health`)
- [ ] Repositório conectado corretamente
- [ ] Branch `main` selecionado
- [ ] Dockerfile existe no repositório

### 🔄 Depois do Deploy

1. Aguarde o build completar (pode levar 2-5 minutos)
2. Verifique os logs em tempo real
3. Acesse `/health` para verificar status
4. Se ainda não funcionar, compartilhe os logs

### 📞 Precisa de Ajuda?

Se o problema persistir, compartilhe:
1. Logs completos do Coolify
2. Configurações de variáveis de ambiente (sem valores sensíveis)
3. Configurações de volumes
4. Qualquer mensagem de erro específica

