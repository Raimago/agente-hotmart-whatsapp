# 📍 Onde Aparece o QR Code do WhatsApp

## 🎯 Resposta Rápida

O QR code aparece em **3 lugares** quando o WhatsApp inicializar corretamente:

1. **Logs do Container Docker** (formato ASCII - direto no terminal)
2. **Logs do Coolify** (formato ASCII - na interface web)
3. **Endpoint da API** (código string - precisa converter para QR code visual)

---

## 1️⃣ Logs do Container Docker (Mais Direto)

### Via SSH:

```bash
# Conectar ao servidor
ssh -i /tmp/coolify_key root@72.61.40.79

# Ver logs em tempo real
docker logs fgk4kkwwgc4cos8kck44wwgs-191903960795 -f
```

**O QR code aparecerá assim:**
```
[INFO] QR Code gerado. Escaneie com seu WhatsApp:
████████████████████████████████
████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄█▄▀█ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▄▄█▀▀ █   █ ████
████ █▄▄▄█ █▀ █▀▀█ █▀▄▄█▄▄▄█ ████
████▄▄▄▄▄▄▄█▄▀ █▄█ █▄▄▄▄▄▄▄████
████████████████████████████████
████████████████████████████████
```

Você pode escanear **diretamente do terminal** apontando a câmera do celular para a tela!

---

## 2️⃣ Logs do Coolify (Interface Web)

### Passo a Passo:

1. **Acesse o painel do Coolify**
   - URL: https://app.coolify.io (ou sua URL do Coolify)

2. **Navegue até seu aplicativo**
   - Vá em: Seu App "agente-hotmart-whatsapp"

3. **Acesse a aba "Logs"**
   - Clique em "Logs" ou "Show Debug Logs"

4. **Procure pelo QR code**
   - Procure por: "QR Code gerado" ou "QR Code"
   - O QR code aparecerá no formato ASCII

5. **Escaneie do navegador**
   - Aponte a câmera do celular para o QR code na tela do computador

---

## 3️⃣ Endpoint da API (Precisa Converter)

### URL do Endpoint:

```
https://agente.raiarruda.com.br/api/test/whatsapp/qr
```

### Como Usar:

**Via navegador:**
1. Acesse: https://agente.raiarruda.com.br/api/test/whatsapp/qr
2. Você verá um JSON como:
```json
{
  "qrCode": "código-aqui",
  "connected": false
}
```

**Via curl:**
```bash
curl https://agente.raiarruda.com.br/api/test/whatsapp/qr
```

### Como Converter para QR Code Visual:

1. **Copie o valor do campo `qrCode`** do JSON retornado

2. **Use um gerador online:**
   - Acesse: https://www.qr-code-generator.com/
   - Ou: https://www.qrcode-monkey.com/
   - Cole o código do campo `qrCode`
   - Gere o QR code

3. **Escaneie o QR code gerado**

---

## ⚠️ Quando o QR Code Aparece?

O QR code **só aparece** quando:
- ✅ O WhatsApp inicializar corretamente (sem erros)
- ✅ Não houver sessão salva anteriormente
- ✅ O container estiver rodando e funcionando

### Se não aparecer:

1. **Verifique se há erro nos logs:**
   ```bash
   docker logs fgk4kkwwgc4cos8kck44wwgs-191903960795 --tail 50
   ```

2. **Procure por:**
   - ❌ `ProtocolError` - Problema com Puppeteer
   - ✅ `QR Code gerado` - QR code foi gerado
   - ✅ `Inicializando WhatsApp...` - Está tentando inicializar

3. **Se houver erro, tente:**
   - Reiniciar o container
   - Limpar a sessão: `rm -rf /app/sessions/*`
   - Verificar se o Puppeteer está funcionando

---

## 📱 Formato do QR Code

O QR code aparece em **dois formatos**:

### 1. ASCII (nos logs):
```
████████████████
████ ▄▄▄▄▄ ████
████ █   █ ████
...
```
**Vantagem:** Pode escanear direto da tela!

### 2. String (no endpoint):
```json
{
  "qrCode": "código-de-texto-aqui"
}
```
**Vantagem:** Precisa converter para visual, mas funciona via API.

---

## ✅ Recomendação

**Melhor opção:** Use os **logs do Coolify** ou **logs via SSH** porque:
- ✅ QR code aparece diretamente no formato visual (ASCII)
- ✅ Pode escanear direto da tela
- ✅ Não precisa converter nada
- ✅ Mais rápido e direto

**Alternativa:** Use o endpoint se preferir integração via API.

---

## 🔄 Após Escanear

Após escanear o QR code com sucesso, você verá nos logs:

```
✅ WhatsApp autenticado
✅ WhatsApp conectado e pronto!
```

E o status mudará para `connected: true`.

---

## 📋 Checklist

- [ ] Container está rodando
- [ ] Logs mostram "Inicializando WhatsApp..."
- [ ] Não há erros de Puppeteer
- [ ] QR code aparece nos logs (formato ASCII)
- [ ] QR code escaneado com sucesso
- [ ] Logs mostram "✅ WhatsApp conectado e pronto!"

---

**Dica:** Se o QR code não aparecer, verifique os logs primeiro para ver se há algum erro impedindo a inicialização do WhatsApp.


