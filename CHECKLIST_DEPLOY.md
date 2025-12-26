# ✅ Checklist de Deploy - Coolify

## ⚠️ Status Atual
- Site: https://agente.raiarruda.com.br/
- Status: ❌ "Bad Gateway" / "no available server"
- Problema: Servidor não está iniciando

## 🔍 Diagnosticar o Problema

### 1. Verificar Logs no Coolify

**Passos:**
1. Acesse o Coolify
2. Vá em: Seu Aplicativo > Logs (ou "Show Debug Logs")
3. Procure por mensagens de erro

**O que procurar:**
- ❌ `Erro ao executar migração`
- ❌ `Erro ao iniciar servidor`
- ❌ `OPENAI_API_KEY não configurada`
- ❌ `Cannot find module`
- ❌ `ENOENT: no such file or directory`
- ❌ `Error: Cannot connect to database`
- ✅ `Servidor rodando na porta 3000` (se aparecer, está OK)

### 2. Verificar Variáveis de Ambiente

**No Coolify, verifique se TODAS estas variáveis estão configuradas:**

```env
PORT=3000
NODE_ENV=production
OPENAI_API_KEY=sk-proj-...
WHATSAPP_SESSION_PATH=/app/sessions
DATABASE_PATH=/app/data/database.sqlite
LOG_LEVEL=info
```

**Como verificar:**
- Coolify > Seu App > Environment Variables
- Certifique-se que todas estão presentes
- **IMPORTANTE:** Verifique se não há espaços extras ou aspas nos valores

### 3. Verificar Volumes Persistentes

**Configure estes volumes no Coolify:**
- `/app/sessions` - Para manter sessão WhatsApp
- `/app/data` - Para persistir banco de dados

**Como configurar:**
- Coolify > Seu App > Volumes
- Adicione os volumes acima

### 4. Verificar Configuração do Servidor

**No Coolify, verifique:**
- ✅ Porta configurada: `3000`
- ✅ Health check path: `/health`
- ✅ Build command: Deve usar Dockerfile (automático)
- ✅ Branch: `main`

### 5. Fazer Novo Deploy

**Se você ainda não fez um novo deploy após as correções:**
1. Coolify > Seu App > Deploy
2. Clique em "Redeploy" ou "Deploy Now"
3. Aguarde o build completar (2-5 minutos)
4. Verifique os logs durante o build

## 🚨 Erros Comuns e Soluções

### Erro: "OPENAI_API_KEY não configurada"
**Solução:** Adicione a variável `OPENAI_API_KEY` no Coolify com sua chave

### Erro: "Arquivo de migração não encontrado"
**Solução:** Já foi corrigido. Faça um novo deploy para pegar a correção.

### Erro: "Cannot find module '...'"
**Solução:** O build falhou. Verifique se `package-lock.json` está no repositório (já está).

### Erro: "EACCES: permission denied"
**Solução:** Problema de permissões nos volumes. Verifique no Coolify.

### Erro: "Port 3000 is already in use"
**Solução:** Verifique se não há outro serviço rodando na porta 3000.

## 📋 Checklist Rápido

Antes de fazer deploy, confirme:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Volumes persistentes configurados
- [ ] Porta 3000 configurada
- [ ] Health check configurado para `/health`
- [ ] Repositório conectado: `Raimago/agente-hotmart-whatsapp`
- [ ] Branch: `main`
- [ ] Dockerfile existe no repositório (já existe)

## 🔄 Próximos Passos

1. **Faça um novo deploy** no Coolify (se ainda não fez)
2. **Verifique os logs** durante e após o deploy
3. **Teste o health check**: `https://agente.raiarruda.com.br/health`
4. **Se ainda não funcionar**, compartilhe os logs do Coolify

## 📝 Informações Importantes

- ✅ Código corrigido e no GitHub
- ✅ Dockerfile configurado corretamente
- ✅ Servidor configurado para escutar em `0.0.0.0:3000`
- ⚠️ Necessário: Deploy no Coolify e configuração de variáveis

## 🆘 Precisa de Ajuda?

Se o problema persistir após verificar tudo acima, compartilhe:
1. Logs completos do Coolify (últimas 50-100 linhas)
2. Configurações de variáveis de ambiente (sem valores, apenas nomes)
3. Status dos volumes
4. Qualquer mensagem de erro específica

