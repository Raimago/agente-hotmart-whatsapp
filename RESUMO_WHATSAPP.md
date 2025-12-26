# 📱 Resumo: Como Conectar o WhatsApp

## ⚠️ Situação Atual

**Status:** WhatsApp **NÃO está conectado**  
**Problema:** Erro do Puppeteer/Chromium impedindo inicialização  
**Erro:** `ProtocolError: Protocol error (Target.setAutoAttach): Target closed`

## 🔍 Como Verificar Status

### Via API (após deploy do código atualizado):

```bash
curl https://agente.raiarruda.com.br/api/test/whatsapp/status
```

### Via Health Check:

```bash
curl https://agente.raiarruda.com.br/health
```

Procure por `"whatsapp": "disconnected"` ou `"whatsapp": "connected"`

## 🚨 Problema: Erro do Puppeteer

O erro ocorre porque o Chromium (usado pelo Puppeteer) não está funcionando corretamente no ambiente Docker. Isso é comum em containers e pode ser resolvido de algumas formas.

### Solução 1: Verificar Logs e Tentar Reiniciar

```bash
# Conectar ao servidor
ssh -i /tmp/coolify_key root@72.61.40.79

# Ver logs recentes
docker logs fgk4kkwwgc4cos8kck44wwgs-191903960795 --tail 50

# Reiniciar container
docker restart fgk4kkwwgc4cos8kck44wwgs-191903960795

# Acompanhar logs em tempo real
docker logs fgk4kkwwgc4cos8kck44wwgs-191903960795 -f
```

### Solução 2: Limpar Sessão e Tentar Novamente

Se houver uma sessão corrompida:

```bash
ssh -i /tmp/coolify_key root@72.61.40.79

# Limpar sessão
docker exec fgk4kkwwgc4cos8kck44wwgs-191903960795 rm -rf /app/sessions/*

# Reiniciar
docker restart fgk4kkwwgc4cos8kck44wwgs-191903960795
```

### Solução 3: Ajustar Dockerfile (Se necessário)

Se o problema persistir, pode ser necessário ajustar as configurações do Puppeteer no Dockerfile. Mas vamos tentar as soluções acima primeiro.

## 📱 Como Obter o QR Code (Quando Funcionar)

Quando o WhatsApp inicializar corretamente, você poderá obter o QR code de duas formas:

### Opção 1: Via Endpoint API

```bash
curl https://agente.raiarruda.com.br/api/test/whatsapp/qr
```

A resposta será:
```json
{
  "qrCode": "código-do-qr-aqui",
  "connected": false
}
```

Use um gerador online como https://www.qr-code-generator.com/ para converter o código em um QR code visual.

### Opção 2: Via Logs do Container

```bash
ssh -i /tmp/coolify_key root@72.61.40.79
docker logs fgk4kkwwgc4cos8kck44wwgs-191903960795 -f
```

O QR code aparecerá no formato ASCII no terminal.

## 📲 Como Escanear o QR Code

1. **Abra o WhatsApp no celular**
2. **Vá em:**
   - **Android:** Menu (⋮) > Aparelhos conectados > Conectar um aparelho
   - **iOS:** Configurações > Aparelhos conectados > Conectar um aparelho
3. **Escaneie o QR code**
4. **Aguarde confirmação** - você verá "✅ WhatsApp conectado e pronto!" nos logs

## ✅ Verificar Conexão

Após escanear o QR code, verifique:

```bash
curl https://agente.raiarruda.com.br/api/test/whatsapp/status
```

Deve retornar:
```json
{
  "connected": true,
  "message": "WhatsApp está conectado"
}
```

## 🔧 Próximos Passos Recomendados

1. **Primeiro, resolva o erro do Puppeteer:**
   - Reinicie o container
   - Verifique os logs
   - Se necessário, limpe a sessão

2. **Quando o WhatsApp inicializar:**
   - Obtenha o QR code (via API ou logs)
   - Escaneie com seu celular
   - Verifique o status

3. **Após conectar:**
   - Teste enviando uma mensagem via API
   - Cadastre um curso
   - Configure o webhook da Hotmart

## 📋 Checklist

- [ ] Container está rodando
- [ ] Logs não mostram erro do Puppeteer
- [ ] Logs mostram "Inicializando WhatsApp..."
- [ ] QR code foi gerado
- [ ] QR code foi escaneado
- [ ] Status mostra `connected: true`
- [ ] Teste de envio de mensagem funcionando

## 💡 Nota Importante

O erro do Puppeteer é um problema comum em ambientes Docker. Se as soluções acima não funcionarem, pode ser necessário:

1. Ajustar configurações do Chromium no Dockerfile
2. Usar flags adicionais do Puppeteer
3. Considerar usar uma alternativa como WhatsApp Business API

Mas vamos tentar primeiro resolver com as soluções mais simples!

---

**Veja o arquivo `GUIA_CONECTAR_WHATSAPP.md` para instruções mais detalhadas.**

