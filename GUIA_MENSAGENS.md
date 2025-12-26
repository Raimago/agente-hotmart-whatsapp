# 📝 Guia: Como Configurar Mensagens e Link de Compra

## 🎯 Visão Geral

Agora você pode configurar mensagens personalizadas para cada curso e incluir o link de compra diretamente nas mensagens enviadas via WhatsApp.

## 🔗 Variáveis Disponíveis no Prompt

Ao criar ou editar um curso, você pode usar estas variáveis no campo `openai_prompt`:

- `{nome}` - Nome do cliente
- `{curso}` - Nome do curso
- `{email}` - Email do cliente
- `{telefone}` - Telefone do cliente
- `{link}` - Link de compra do curso

## 📋 Como Cadastrar um Curso com Link de Compra

### Via API

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "hotmart_product_id": "12345678",
    "name": "Curso de Marketing Digital",
    "openai_prompt": "Olá {nome}! 👋\n\nNotamos que você estava interessado no {curso}, mas não finalizou a compra.\n\nEste curso vai transformar sua carreira com:\n✅ Estratégias comprovadas\n✅ Certificado reconhecido\n✅ Suporte exclusivo\n\nNão perca esta oportunidade! Clique no link para finalizar sua compra:\n{link}\n\nEstamos aqui para ajudar! 😊",
    "purchase_link": "https://pay.hotmart.com/SEU_LINK_AQUI",
    "active": true
  }'
```

### Exemplo de Prompt com Link

**Opção 1: Link no meio da mensagem**
```
Olá {nome}! 👋

Notamos que você estava interessado no {curso}, mas não finalizou a compra.

Este curso vai transformar sua carreira! Clique aqui para finalizar: {link}

Estamos aqui para ajudar! 😊
```

**Opção 2: Link no final (automático)**
```
Olá {nome}! 👋

Notamos que você estava interessado no {curso}, mas não finalizou a compra.

Este curso vai transformar sua carreira com:
✅ Estratégias comprovadas
✅ Certificado reconhecido
✅ Suporte exclusivo

Não perca esta oportunidade!
```

*Se você não usar `{link}` no prompt mas tiver um `purchase_link` configurado, o link será adicionado automaticamente no final da mensagem.*

## 🔍 Como Obter o Link de Compra da Hotmart

1. Acesse o painel da Hotmart
2. Vá em: **Produtos** > Selecione seu produto
3. Copie o **Link de Compra** ou **Link de Checkout**
4. Cole no campo `purchase_link` ao cadastrar o curso

**Formato do link:**
- `https://pay.hotmart.com/SEU_LINK`
- `https://hotmart.com/pt-br/marketplace/produtos/SEU_PRODUTO/checkout`

## 📝 Exemplos de Prompts Personalizados

### Exemplo 1: Tom Amigável e Persuasivo

```json
{
  "openai_prompt": "Oi {nome}! 😊\n\nVi que você estava quase finalizando a compra do {curso}!\n\nEste curso é perfeito para você porque:\n✨ Você vai aprender estratégias práticas\n✨ Terá acesso vitalício\n✨ Suporte direto comigo\n\nComplete sua compra agora e garante um desconto especial:\n{link}\n\nQualquer dúvida, estou aqui! 💬",
  "purchase_link": "https://pay.hotmart.com/SEU_LINK"
}
```

### Exemplo 2: Tom Profissional

```json
{
  "openai_prompt": "Olá {nome},\n\nNotamos que você iniciou o processo de compra do {curso}, mas não finalizou.\n\nEste curso oferece:\n• Conteúdo exclusivo e atualizado\n• Certificado de conclusão\n• Suporte especializado\n\nPara finalizar sua compra, acesse: {link}\n\nEstamos à disposição para esclarecer qualquer dúvida.\n\nAtenciosamente,\nEquipe de Vendas",
  "purchase_link": "https://pay.hotmart.com/SEU_LINK"
}
```

### Exemplo 3: Tom Urgente (Oferta Limitada)

```json
{
  "openai_prompt": "🚨 {nome}, última chance! 🚨\n\nVocê estava prestes a adquirir o {curso}!\n\n⏰ Esta oferta é por tempo limitado!\n\nO que você vai ganhar:\n✅ Acesso imediato\n✅ Bônus exclusivos\n✅ Garantia de 7 dias\n\nFinalize agora: {link}\n\nNão deixe passar esta oportunidade! 💎",
  "purchase_link": "https://pay.hotmart.com/SEU_LINK"
}
```

## 🛠️ Atualizar Link de um Curso Existente

```bash
curl -X PUT http://localhost:3000/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "purchase_link": "https://pay.hotmart.com/NOVO_LINK"
  }'
```

## 🧪 Testar Mensagem Antes de Enviar

Use o endpoint de teste para ver como a mensagem ficará:

```bash
curl -X POST http://localhost:3000/api/test/openai \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Olá {nome}! Clique aqui: {link}",
    "courseName": "Curso de Teste",
    "clientName": "João Silva",
    "purchaseLink": "https://pay.hotmart.com/TESTE"
  }'
```

## 💡 Dicas para Melhores Resultados

1. **Seja Pessoal**: Use `{nome}` para personalizar
2. **Destaque Benefícios**: Liste 2-3 benefícios principais
3. **Use Emojis Moderadamente**: Não exagere (2-3 por mensagem)
4. **Inclua o Link**: Use `{link}` no prompt ou configure `purchase_link`
5. **Seja Conciso**: Máximo 200 palavras (WhatsApp)
6. **Crie Urgência**: Mas sem ser agressivo
7. **Ofereça Ajuda**: Mostre que está disponível

## 📊 Estrutura Completa de um Curso

```json
{
  "hotmart_product_id": "12345678",
  "name": "Curso Completo de Python",
  "openai_prompt": "Olá {nome}! 👋\n\nNotamos que você estava interessado no {curso}.\n\nEste curso vai te ensinar:\n✅ Python do zero ao avançado\n✅ Projetos práticos\n✅ Certificado reconhecido\n\nFinalize sua compra: {link}\n\nQualquer dúvida, estou aqui! 😊",
  "purchase_link": "https://pay.hotmart.com/SEU_LINK_AQUI",
  "whatsapp_message_template": "Olá {nome}! Vi que você estava interessado no {curso}...",
  "active": true
}
```

## ⚠️ Importante

- O link será **automaticamente adicionado** no final se você não usar `{link}` no prompt
- Se usar `{link}` no prompt, ele será substituído pelo `purchase_link` configurado
- Sempre teste a mensagem antes de ativar o curso
- O link deve ser válido e acessível

## 🎯 Próximos Passos

1. Cadastre seus cursos com os prompts personalizados
2. Configure os links de compra
3. Teste as mensagens
4. Ative os cursos
5. Configure o webhook na Hotmart

Pronto! Seu agente está configurado para enviar mensagens personalizadas com links de compra! 🚀

