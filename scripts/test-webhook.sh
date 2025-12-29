#!/bin/bash

# Script para testar webhook da Hotmart

URL="${1:-http://localhost:3000/webhook/hotmart}"

echo "Enviando webhook de teste para: $URL"
echo ""

curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "PURCHASE_ABANDONED_CART",
    "data": {
      "product": {
        "id": "12345678",
        "name": "Curso de Marketing Digital"
      },
      "buyer": {
        "name": "João Silva",
        "email": "joao@email.com",
        "phone": {
          "local_number": "999999999",
          "country_code": "55",
          "area_code": "11"
        }
      },
      "order": {
        "order_id": "ORD123456"
      }
    }
  }'

echo ""
echo ""
echo "Webhook enviado!"


