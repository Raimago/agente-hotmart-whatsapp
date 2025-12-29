# ⚠️ Problema: Variáveis de Ambiente Perdidas Após Deploy

## 🔍 Situação

Após o deploy no Coolify, o novo container está crashando com o erro:
```
Error: OPENAI_API_KEY não configurada
```

## 🔍 Causa

Quando o Coolify faz deploy e cria um novo container, ele **sobrescreve** as variáveis de ambiente do arquivo `.env` com as configurações do próprio Coolify.

As variáveis que adicionamos manualmente no arquivo `.env` foram **perdidas** porque o Coolify gerencia as variáveis de ambiente pela sua interface web.

## ✅ Solução: Configurar Variáveis no Coolify

Você precisa adicionar as variáveis de ambiente **via interface do Coolify**, não diretamente no arquivo `.env`.

### Passo a Passo:

1. **Acesse o Coolify**
   - Entre no painel do Coolify

2. **Vá até seu aplicativo**
   - Navegue para "agente-hotmart-whatsapp"

3. **Acesse "Environment Variables"**
   - Menu: Environment ou Variables
   - Ou: Configuration > Environment Variables

4. **Adicione TODAS as variáveis necessárias:**

   ```
   OPENAI_API_KEY=sk-proj-... (sua chave OpenAI completa aqui)
   NODE_ENV=production
   WHATSAPP_SESSION_PATH=/app/sessions
   DATABASE_PATH=/app/data/database.sqlite
   LOG_LEVEL=info
   ```
   
   **⚠️ IMPORTANTE:** Substitua `sk-proj-...` pela sua chave OpenAI completa.

5. **Salve as alterações**
   - Clique em "Save"
   - O Coolify pode perguntar se deseja fazer redeploy - **ACEITE**

6. **Aguarde o redeploy**
   - O container será reconstruído com as novas variáveis
   - Aguarde 1-2 minutos

## 🔧 Verificação

Após adicionar as variáveis, verifique:

```bash
ssh -i /tmp/coolify_key root@72.61.40.79
docker exec <container_id> env | grep OPENAI
```

Deve mostrar:
```
OPENAI_API_KEY=sk-proj-...
```

## 📋 Variáveis Necessárias

Certifique-se de adicionar **TODAS** estas variáveis:

| Variável | Valor |
|----------|-------|
| `OPENAI_API_KEY` | `sk-proj-...` (sua chave OpenAI completa) |
| `NODE_ENV` | `production` |
| `WHATSAPP_SESSION_PATH` | `/app/sessions` |
| `DATABASE_PATH` | `/app/data/database.sqlite` |
| `LOG_LEVEL` | `info` |

**Nota:** As variáveis `PORT`, `HOST`, `COOLIFY_*` são gerenciadas automaticamente pelo Coolify.

## 🚨 Importante

- ❌ **NÃO edite** o arquivo `.env` diretamente - será sobrescrito no próximo deploy
- ✅ **Use a interface do Coolify** para gerenciar variáveis de ambiente
- ✅ As variáveis configuradas no Coolify são **persistentes** entre deploys

## ✅ Após Configurar

1. Aguarde o redeploy completar
2. Verifique os logs do container
3. Deve aparecer: `✅ Servidor rodando na porta 3000`
4. Acesse: `https://agente.raiarruda.com.br/whatsapp`

---

**Ação Necessária:** Adicione as variáveis de ambiente via interface do Coolify agora!


