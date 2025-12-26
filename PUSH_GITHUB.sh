#!/bin/bash

# Script para fazer push do código para o GitHub
# Execute após criar o repositório no GitHub

echo "🚀 Fazendo push para o GitHub..."

# Verificar se o repositório remoto está configurado
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Configurando remote..."
    git remote add origin https://github.com/Raimago/agente-hotmart-whatsapp.git
fi

# Fazer push
echo "📤 Enviando código..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Código enviado com sucesso!"
    echo "🔗 Acesse: https://github.com/Raimago/agente-hotmart-whatsapp"
else
    echo "❌ Erro ao fazer push"
    echo "💡 Certifique-se de que o repositório foi criado no GitHub"
    echo "💡 URL: https://github.com/new"
fi

