FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema (necessário para whatsapp-web.js)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Variáveis de ambiente para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROMIUM_FLAGS="--no-sandbox --disable-setuid-sandbox"

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Copiar arquivos SQL de migração para o diretório dist
RUN mkdir -p dist/database/migrations && \
    cp src/database/migrations/*.sql dist/database/migrations/ 2>/dev/null || true

# Copiar arquivos públicos (interface web) incluindo subdiretórios
RUN mkdir -p dist/public/admin && \
    cp -r src/public/. dist/public/ 2>/dev/null || true

# Remover dependências de desenvolvimento (opcional, economiza espaço)
RUN npm prune --production

# Criar diretórios necessários
RUN mkdir -p /app/sessions /app/data

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/server.js"]

