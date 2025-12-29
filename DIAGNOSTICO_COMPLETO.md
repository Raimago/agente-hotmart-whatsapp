# 🔍 Diagnóstico Completo - Aplicação no Servidor

## ✅ Status Verificado via SSH

**Data:** 26/12/2025  
**Servidor:** 72.61.40.79  
**Container:** `fgk4kkwwgc4cos8kck44wwgs-191903960795`

### 📊 Estado do Container

```
Status: Restarting (1) - Loop de reinicialização
Causa: Erro ao iniciar aplicação
```

### ❌ Erro Identificado

```
Error: OPENAI_API_KEY não configurada
at /app/dist/services/openai.service.js:11:11
```

**O container está em loop de restart porque:**
1. Tenta iniciar a aplicação
2. Falha imediatamente porque `OPENAI_API_KEY` não está definida
3. Docker reinicia o container automaticamente
4. O ciclo se repete infinitamente

### ✅ Variáveis de Ambiente Atuais

Verificado no container:
```
PORT=3000 ✅
NODE_VERSION=20.19.6 ✅
OPENAI_API_KEY= ❌ NÃO CONFIGURADA
```

## 🔧 Solução: Adicionar OPENAI_API_KEY

### Opção 1: Via Interface do Coolify (RECOMENDADO)

1. **Acesse o Coolify**
   - Entre no painel: https://app.coolify.io (ou sua URL do Coolify)
   - Navegue até seu aplicativo "agente-hotmart-whatsapp"

2. **Vá em "Environment Variables"**
   - Menu lateral > Seu App > Environment (ou Variables)

3. **Adicione a variável:**
   ```
   Nome: OPENAI_API_KEY
   Valor: sk-proj-... (chave oculta por segurança)
   ```

4. **Salve**
   - Clique em "Save" ou "Salvar"
   - O Coolify fará redeploy automático

5. **Aguarde 1-2 minutos**
   - Container será reconstruído com a nova variável
   - Verifique os logs para confirmar

### Opção 2: Verificar Todas as Variáveis Necessárias

Certifique-se que **TODAS** estas variáveis estão configuradas:

```env
PORT=3000
NODE_ENV=production
OPENAI_API_KEY=sk-proj-... (chave oculta por segurança)
WHATSAPP_SESSION_PATH=/app/sessions
DATABASE_PATH=/app/data/database.sqlite
LOG_LEVEL=info
```

## 🔍 Como Verificar se Funcionou

Após adicionar a variável, verifique:

### Via SSH (se necessário):

```bash
# Conectar ao servidor
ssh -i /tmp/coolify_key root@72.61.40.79

# Ver status do container
docker ps -a | grep fgk4kkwwgc4cos8kck44wwgs

# Ver logs (deve mostrar "Servidor rodando na porta 3000")
docker logs fgk4kkwwgc4cos8kck44wwgs-191903960795 --tail 20

# Verificar variável de ambiente
docker exec fgk4kkwwgc4cos8kck44wwgs-191903960795 env | grep OPENAI
```

### Via Interface do Coolify:

1. Vá em: Seu App > Logs
2. Procure por:
   ```
   ✅ Executando migrações do banco de dados...
   ✅ Servidor rodando na porta 3000
   📱 Aguardando autenticação do WhatsApp...
   ```

### Via Navegador:

1. Acesse: https://agente.raiarruda.com.br/
2. Deve responder com:
   ```json
   {
     "name": "Agente Hotmart WhatsApp",
     "version": "1.0.0",
     "status": "running",
     ...
   }
   ```

## 📋 Resumo do Problema

| Item | Status |
|------|--------|
| DNS | ✅ Configurado corretamente |
| Servidor | ✅ Acessível (72.61.40.79) |
| Container | ❌ Em loop de restart |
| Código | ✅ Compilado corretamente |
| Variáveis | ❌ OPENAI_API_KEY faltando |
| Volumes | ⚠️ Verificar se estão montados |

## 🚨 Importante

- ✅ O problema está identificado: falta a variável `OPENAI_API_KEY`
- ✅ A solução é simples: adicionar a variável no Coolify
- ✅ Após adicionar, o container deve iniciar normalmente
- ⚠️ Verifique também se os volumes `/app/sessions` e `/app/data` estão montados

## 🔄 Após Resolver

Depois que a aplicação iniciar:

1. ✅ Verifique se o servidor está respondendo
2. ✅ Escaneie o QR Code do WhatsApp (se necessário)
3. ✅ Teste o endpoint `/health`
4. ✅ Cadastre um curso via API (`/api/courses`)

---

**Próximo passo:** Adicione a variável `OPENAI_API_KEY` no Coolify e aguarde o redeploy automático.


