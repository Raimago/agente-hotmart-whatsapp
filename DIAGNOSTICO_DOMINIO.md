# 🔍 Diagnóstico do Domínio

## ✅ Resultados dos Testes

### DNS - Resolvendo Corretamente
```
Domínio: agente.raiarruda.com.br
IP: 72.61.40.79 ✅
Status: DNS configurado corretamente
```

### Testes HTTP/HTTPS

**HTTP (porta 80):**
- Status: `404 Not Found`
- Resposta: Servidor responde, mas retorna 404

**HTTPS (porta 443):**
- Status: `503 Service Unavailable`
- Erro: "no available server"
- Significado: Proxy/Load Balancer está ativo, mas o serviço backend não está rodando

## 🔍 Análise do Problema

### O que está acontecendo:

1. ✅ **DNS está correto** - Domínio aponta para o IP do servidor
2. ✅ **Proxy/Load Balancer ativo** - Servidor web está respondendo
3. ❌ **Aplicação não está rodando** - O serviço Node.js não está iniciando ou caiu

### Erro 503 "no available server"

Este erro típico do **Traefik** (usado pelo Coolify) indica:
- O proxy está configurado corretamente
- O domínio está apontando para o lugar certo
- **MAS** o container/serviço backend não está respondendo na porta interna

## 🛠️ Soluções

### 1. Verificar Status do Container no Coolify

No Coolify:
1. Acesse seu aplicativo
2. Verifique o **status do container**
3. Veja se está marcado como "Running" ou "Stopped/Crashed"

### 2. Verificar Logs do Container

**Acesse os logs e procure por:**
- ✅ "Servidor rodando na porta 3000" - **OK**
- ❌ "Erro ao iniciar servidor" - **PROBLEMA**
- ❌ "Erro ao executar migração" - **PROBLEMA**
- ❌ "OPENAI_API_KEY não configurada" - **PROBLEMA**
- ❌ "Cannot find module" - **PROBLEMA**

### 3. Verificar Variáveis de Ambiente

Confirme que **TODAS** estão configuradas:
```env
PORT=3000
NODE_ENV=production
OPENAI_API_KEY=sk-proj-...
WHATSAPP_SESSION_PATH=/app/sessions
DATABASE_PATH=/app/data/database.sqlite
LOG_LEVEL=info
```

### 4. Verificar Porta Interna

No Coolify, verifique:
- Porta interna do container: Deve ser `3000`
- Porta mapeada: Coolify gerencia automaticamente
- Health check: Deve estar configurado para `/health`

### 5. Reiniciar o Container

Se o container está parado:
1. Coolify > Seu App > Actions
2. Clique em "Restart" ou "Redeploy"
3. Aguarde reinicializar

### 6. Verificar Volumes

Certifique-se que os volumes estão montados:
- `/app/sessions` - Para WhatsApp
- `/app/data` - Para banco de dados

## 📋 Checklist de Diagnóstico

No Coolify, verifique:

- [ ] Container está rodando? (Status: Running)
- [ ] Logs mostram "Servidor rodando na porta 3000"?
- [ ] Variáveis de ambiente estão configuradas?
- [ ] Volumes persistentes estão montados?
- [ ] Health check está configurado?
- [ ] Porta interna é 3000?

## 🔧 Comandos Úteis (se tiver acesso SSH ao servidor)

Se você tem acesso SSH ao servidor do Coolify:

```bash
# Ver containers rodando
docker ps

# Ver logs do container
docker logs <container_id>

# Verificar se a porta 3000 está ouvindo
netstat -tlnp | grep 3000
```

## 💡 Próximos Passos

1. **Acesse o Coolify agora**
2. **Verifique os logs do aplicativo**
3. **Procure por erros específicos**
4. **Compartilhe os logs** se o problema persistir

O domínio está apontando corretamente, o problema está na aplicação não estar rodando. Os logs vão mostrar exatamente o que está acontecendo!


