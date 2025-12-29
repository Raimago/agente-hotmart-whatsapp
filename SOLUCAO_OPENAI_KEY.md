# 🔑 Solução: OPENAI_API_KEY não configurada

## ❌ Erro Encontrado

```
Error: OPENAI_API_KEY não configurada
at Object.<anonymous> (/app/dist/services/openai.service.js:11:11)
```

## ✅ Solução: Adicionar Variável de Ambiente no Coolify

### Passo a Passo:

1. **Acesse o Coolify**
   - Entre no painel do Coolify
   - Navegue até seu aplicativo "agente-hotmart-whatsapp"

2. **Vá em "Environment Variables" (Variáveis de Ambiente)**
   - No menu lateral ou na página do aplicativo
   - Procure por "Environment" ou "Env"

3. **Adicione a variável `OPENAI_API_KEY`**
   
   **Nome da variável:**
   ```
   OPENAI_API_KEY
   ```
   
   **Valor da variável:**
   ```
   sk-proj-... (sua chave OpenAI aqui)
   ```
   
   **⚠️ IMPORTANTE:** Substitua `sk-proj-...` pela sua chave OpenAI completa.

4. **Salve as alterações**
   - Clique em "Save" ou "Salvar"
   - O Coolify pode perguntar se deseja fazer redeploy - **ACEITE**

5. **Aguarde o redeploy**
   - O container será reiniciado automaticamente
   - Aguarde 1-2 minutos para o servidor iniciar

6. **Verifique os logs**
   - Vá em "Logs" no Coolify
   - Procure por: `✅ Servidor rodando na porta 3000`
   - Se aparecer, está funcionando! 🎉

## 📋 Todas as Variáveis de Ambiente Necessárias

Certifique-se de que **TODAS** estas variáveis estão configuradas no Coolify:

```env
PORT=3000
NODE_ENV=production
OPENAI_API_KEY=sk-proj-... (sua chave OpenAI aqui)
WHATSAPP_SESSION_PATH=/app/sessions
DATABASE_PATH=/app/data/database.sqlite
LOG_LEVEL=info
```

## ✅ Verificação Final

Após adicionar a variável, você deve ver nos logs:

```
✅ Executando migrações do banco de dados...
✅ Migração executada
🚀 Servidor rodando na porta 3000
📱 Aguardando autenticação do WhatsApp...
```

E o site `https://agente.raiarruda.com.br/` deve responder com:
```json
{
  "name": "Agente Hotmart WhatsApp",
  "version": "1.0.0",
  "status": "running",
  ...
}
```

## 🚨 Importante

- ✅ **Não adicione aspas** ao redor do valor da chave
- ✅ **Não adicione espaços** antes ou depois da chave
- ✅ Copie a chave **exatamente** como está acima
- ✅ Após salvar, o container será reiniciado automaticamente

## 🔄 Se ainda não funcionar

1. Verifique se salvou corretamente (sem aspas ou espaços extras)
2. Faça um redeploy manual no Coolify
3. Aguarde 2-3 minutos para o servidor iniciar completamente
4. Verifique os logs novamente


