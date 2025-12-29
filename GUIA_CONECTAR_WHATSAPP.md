# 📱 Guia: Como Conectar o WhatsApp

## ⚠️ Problema Atual

O WhatsApp está com erro ao inicializar:
```
ProtocolError: Protocol error (Target.setAutoAttach): Target closed.
```

Este é um problema comum com Puppeteer/Chromium em ambientes Docker. Vamos resolver isso primeiro.

## 🔧 Solução 1: Verificar Status Atual

### 1. Verificar Status do WhatsApp

Acesse:
```
https://agente.raiarruda.com.br/api/test/whatsapp/status
```

Ou via curl:
```bash
curl https://agente.raiarruda.com.br/api/test/whatsapp/status
```

### 2. Obter QR Code (se disponível)

Acesse:
```
https://agente.raiarruda.com.br/api/test/whatsapp/qr
```

## 🔄 Solução 2: Reiniciar WhatsApp (Recomendado)

O WhatsApp precisa ser reiniciado para gerar um novo QR code. Faça isso via SSH:

```bash
# Conectar ao servidor
ssh -i /tmp/coolify_key root@72.61.40.79

# Reiniciar o container
cd /data/coolify/applications/fgk4kkwwgc4cos8kck44wwgs
docker compose restart

# Ver logs do WhatsApp
docker logs fgk4kkwwgc4cos8kck44wwgs-191903960795 -f | grep -i "qr\|whatsapp"
```

## 🔍 Solução 3: Verificar Logs do WhatsApp

Os logs do WhatsApp mostram quando o QR code é gerado. Veja os logs:

### Via SSH:
```bash
ssh -i /tmp/coolify_key root@72.61.40.79
docker logs fgk4kkwwgc4cos8kck44wwgs-191903960795 --tail 100
```

### Via Coolify:
1. Acesse o Coolify
2. Vá em: Seu App > Logs
3. Procure por: "QR Code gerado" ou "QR Code"

## 📱 Como Escanear o QR Code

Quando o QR code for gerado (via logs ou endpoint):

### Método 1: Via Endpoint (Recomendado)

1. **Acesse o endpoint:**
   ```
   https://agente.raiarruda.com.br/api/test/whatsapp/qr
   ```

2. **Você receberá uma resposta JSON com o QR code:**
   ```json
   {
     "qrCode": "código-do-qr-aqui",
     "connected": false
   }
   ```

3. **Use um gerador de QR code online:**
   - Acesse: https://www.qr-code-generator.com/
   - Cole o código do campo `qrCode`
   - Gere o QR code
   - Escaneie com seu WhatsApp

### Método 2: Via Logs (SSH)

1. **Veja os logs do container:**
   ```bash
   docker logs fgk4kkwwgc4cos8kck44wwgs-191903960795 -f
   ```

2. **O QR code aparecerá no formato ASCII no terminal**

3. **Escaneie diretamente do terminal** (se possível)

### Método 3: Via Coolify Logs

1. Acesse Coolify > Seu App > Logs
2. Procure pelo QR code no formato ASCII
3. Escaneie com seu WhatsApp

## 📲 Passo a Passo: Escanear QR Code no WhatsApp

1. **Abra o WhatsApp no seu celular**

2. **Vá em:**
   - **Android:** Menu (três pontos) > Aparelhos conectados > Conectar um aparelho
   - **iOS:** Configurações > Aparelhos conectados > Conectar um aparelho

3. **Escaneie o QR code:**
   - Aponte a câmera do celular para o QR code
   - Aguarde a conexão ser estabelecida

4. **Aguarde a confirmação:**
   - Você verá "WhatsApp conectado e pronto!" nos logs
   - O status mudará para `connected: true`

## 🔧 Resolver Problema do Puppeteer

Se o erro do Puppeteer persistir, pode ser necessário ajustar o Dockerfile. Mas primeiro, vamos tentar:

### 1. Verificar Volumes Persistentes

Certifique-se que o volume está montado:
```bash
docker inspect fgk4kkwwgc4cos8kck44wwgs-191903960795 | grep Mounts
```

Deve mostrar: `/app/sessions` mapeado para um volume persistente.

### 2. Limpar Sessão Antiga (se necessário)

Se houver problemas, limpe a sessão antiga:

```bash
ssh -i /tmp/coolify_key root@72.61.40.79
docker exec fgk4kkwwgc4cos8kck44wwgs-191903960795 rm -rf /app/sessions/*
docker compose restart
```

### 3. Verificar Permissões

```bash
docker exec fgk4kkwwgc4cos8kck44wwgs-191903960795 ls -la /app/sessions
```

## ✅ Verificar se Está Conectado

### Via API:
```bash
curl https://agente.raiarruda.com.br/api/test/whatsapp/status
```

**Resposta esperada (conectado):**
```json
{
  "connected": true,
  "message": "WhatsApp está conectado"
}
```

**Resposta esperada (não conectado):**
```json
{
  "connected": false,
  "message": "WhatsApp não está conectado"
}
```

### Via Logs:
Procure por: `✅ WhatsApp conectado e pronto!`

## 🚨 Problemas Comuns

### 1. "QR Code não disponível"
- **Causa:** WhatsApp já está conectado ou não inicializou
- **Solução:** Verifique o status e reinicie se necessário

### 2. "ProtocolError: Target closed"
- **Causa:** Problema com Puppeteer/Chromium no Docker
- **Solução:** Pode ser necessário ajustar configurações do Dockerfile

### 3. QR Code expira
- **Causa:** QR code expira após alguns minutos
- **Solução:** Reinicie o container para gerar um novo QR code

### 4. "WhatsApp não está conectado"
- **Causa:** QR code não foi escaneado ou sessão expirou
- **Solução:** Gere um novo QR code e escaneie novamente

## 📋 Checklist de Conexão

- [ ] Container está rodando
- [ ] Logs mostram "Inicializando WhatsApp..."
- [ ] QR code foi gerado (verificar logs ou endpoint)
- [ ] QR code foi escaneado com sucesso
- [ ] Logs mostram "✅ WhatsApp conectado e pronto!"
- [ ] Status API retorna `connected: true`

## 💡 Próximos Passos Após Conectar

1. ✅ Testar envio de mensagem via API
2. ✅ Cadastrar um curso
3. ✅ Configurar webhook da Hotmart
4. ✅ Testar fluxo completo

---

**Nota:** Se o erro do Puppeteer persistir, pode ser necessário ajustar as configurações do Chromium no Dockerfile ou usar uma alternativa como WhatsApp Business API.


