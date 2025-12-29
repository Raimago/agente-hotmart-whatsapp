# 🔐 Acesso SSH ao Servidor - Verificação de Containers

## ⚠️ ATENÇÃO - SEGURANÇA

A chave SSH privada foi fornecida. Para usar de forma segura:

1. **Nunca compartilhe a chave SSH publicamente**
2. **Use apenas para diagnóstico e configuração**
3. **Remova o arquivo da chave após o uso**

## 🔧 Preparação Local

### 1. Salvar a Chave SSH

Salve a chave SSH em um arquivo temporário com permissões corretas:

```bash
# Criar arquivo com a chave SSH
# NOTA: Substitua <SUA_CHAVE_SSH> pela chave SSH privada fornecida pelo Coolify
cat > /tmp/coolify_key << 'EOF'
-----BEGIN OPENSSH PRIVATE KEY-----
<SUA_CHAVE_SSH_AQUI>
-----END OPENSSH PRIVATE KEY-----
EOF

# Definir permissões corretas (IMPORTANTE!)
chmod 600 /tmp/coolify_key
```

### 2. Conectar ao Servidor

O usuário SSH padrão no Coolify geralmente é `root` ou `coolify`:

```bash
# Tentar com usuário root
ssh -i /tmp/coolify_key root@72.61.40.79

# Ou se não funcionar, tente:
ssh -i /tmp/coolify_key coolify@72.61.40.79
```

## 🔍 Comandos para Verificar a Aplicação

Uma vez conectado, execute estes comandos:

### 1. Ver Containers Docker Rodando

```bash
docker ps -a
```

**Procure por:**
- Container com nome relacionado a `agente` ou `hotmart`
- Status: `Up` (rodando) ou `Exited` (parado)
- Nome do container (anote para usar depois)

### 2. Ver Logs do Container

```bash
# Substitua <container_name> pelo nome do container encontrado
docker logs <container_name> --tail 100

# Ou para ver logs em tempo real
docker logs <container_name> -f
```

**O que procurar nos logs:**
- ✅ `Servidor rodando na porta 3000` - **OK**
- ❌ `OPENAI_API_KEY não configurada` - **Problema identificado**
- ❌ `Erro ao executar migração` - Problema de migração
- ❌ `Cannot find module` - Problema de dependências

### 3. Verificar Variáveis de Ambiente do Container

```bash
docker exec <container_name> env | grep -E "OPENAI|PORT|NODE|DATABASE"
```

**Deve mostrar:**
```
PORT=3000
NODE_ENV=production
OPENAI_API_KEY=sk-proj-...
DATABASE_PATH=/app/data/database.sqlite
WHATSAPP_SESSION_PATH=/app/sessions
LOG_LEVEL=info
```

### 4. Verificar se o Servidor Está Ouvindo na Porta 3000

```bash
# Dentro do container
docker exec <container_name> netstat -tlnp | grep 3000

# Ou
docker exec <container_name> ss -tlnp | grep 3000
```

### 5. Verificar Processos Dentro do Container

```bash
docker exec <container_name> ps aux
```

**Deve mostrar:**
- Processo Node.js rodando
- Comando: `node dist/server.js`

### 6. Verificar Arquivos no Container

```bash
# Verificar se o código foi compilado
docker exec <container_name> ls -la /app/dist/

# Verificar se o banco de dados existe
docker exec <container_name> ls -la /app/data/

# Verificar volumes montados
docker inspect <container_name> | grep -A 10 Mounts
```

## 🔧 Soluções Rápidas via SSH

### Se a OPENAI_API_KEY não estiver configurada:

**OPÇÃO 1: Via Coolify (Recomendado)**
- Use a interface web do Coolify para adicionar a variável
- Isso é mais seguro e persistente

**OPÇÃO 2: Via Docker (Temporário - NÃO RECOMENDADO)**
```bash
# Apenas para teste - não persiste após restart
# Substitua <SUA_OPENAI_KEY> pela chave real
docker exec -e OPENAI_API_KEY=<SUA_OPENAI_KEY> <container_name> node dist/server.js
```

### Reiniciar o Container

```bash
# Reiniciar container
docker restart <container_name>

# Ver logs após restart
docker logs <container_name> -f
```

### Entrar no Container para Debug

```bash
# Entrar no container
docker exec -it <container_name> sh

# Dentro do container, você pode:
# - Verificar arquivos
ls -la /app/
ls -la /app/dist/

# - Testar manualmente
node dist/server.js

# - Verificar variáveis de ambiente
env | grep OPENAI

# - Sair
exit
```

## 📋 Checklist de Diagnóstico

Execute e anote os resultados:

- [ ] Container existe? `docker ps -a`
- [ ] Container está rodando? (Status: Up)
- [ ] Logs mostram erro? `docker logs <container>`
- [ ] OPENAI_API_KEY está definida? `docker exec <container> env | grep OPENAI`
- [ ] Servidor está ouvindo na porta 3000? `docker exec <container> netstat -tlnp | grep 3000`
- [ ] Processo Node.js está rodando? `docker exec <container> ps aux`
- [ ] Arquivos compilados existem? `docker exec <container> ls -la /app/dist/`
- [ ] Volumes estão montados? `docker inspect <container> | grep Mounts`

## 🚨 Limpeza (Após Uso)

**IMPORTANTE:** Remova a chave SSH após o uso:

```bash
# Remover arquivo da chave
rm /tmp/coolify_key

# Ou se preferir, sobrescrever antes de deletar (mais seguro)
shred -u /tmp/coolify_key 2>/dev/null || rm -f /tmp/coolify_key
```

## 💡 Próximos Passos

1. Conecte via SSH usando a chave
2. Execute os comandos de diagnóstico acima
3. Compartilhe os resultados dos logs
4. Se encontrar `OPENAI_API_KEY não configurada`, adicione via Coolify (método recomendado)
5. Reinicie o container após adicionar a variável
6. Verifique os logs novamente

## 🔒 Nota de Segurança

- A chave SSH permite acesso root ao servidor
- Use apenas para diagnóstico e configuração
- Nunca compartilhe a chave publicamente
- Remova a chave após o uso
- Para mudanças permanentes, use a interface do Coolify (mais seguro)


