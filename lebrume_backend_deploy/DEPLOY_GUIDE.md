# Guia de Deploy - Render

Este guia contém todas as instruções necessárias para fazer o deploy do backend Lebrume na plataforma Render.

## 📋 Pré-requisitos

1. Conta no [Render](https://render.com)
2. Banco de dados PostgreSQL configurado (pode ser no próprio Render)
3. Repositório Git com o código do backend

## 🗄️ Configuração do Banco de Dados

### Opção 1: PostgreSQL no Render

1. No dashboard do Render, clique em "New +"
2. Selecione "PostgreSQL"
3. Configure:
   - **Name**: `lebrume-database`
   - **Database**: `lebrume_db`
   - **User**: `lebrume_db_user`
   - **Region**: Escolha a região mais próxima
4. Anote as credenciais geradas

### Opção 2: PostgreSQL Externo

Se usar um banco externo, certifique-se de que:
- SSL está habilitado
- Conexões externas são permitidas
- Credenciais estão disponíveis

## 🚀 Deploy do Backend

### 1. Criar Web Service

1. No dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório Git

### 2. Configurações Básicas

- **Name**: `lebrume-backend`
- **Region**: Mesma região do banco de dados
- **Branch**: `main` (ou branch desejada)
- **Root Directory**: (deixe vazio se o backend está na raiz)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

#### Obrigatórias (Banco de Dados)
```
DB_HOST=<host_do_seu_banco>
DB_PORT=5432
DB_USERNAME=<usuario_do_banco>
DB_PASSWORD=<senha_do_banco>
DB_DATABASE=<nome_do_banco>
DB_DIALECT=postgres
```

#### Obrigatórias (Aplicação)
```
NODE_ENV=production
PORT=8080
JWT_SECRET=<gere_um_secret_super_seguro>
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://lebrume.com.au
```

### 4. Configurações Avançadas

- **Plan**: Free (ou pago conforme necessidade)
- **Auto-Deploy**: Yes (para deploy automático)

## 🔐 Gerando JWT Secret

Para gerar um JWT secret seguro, use:

```bash
# Opção 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opção 2: OpenSSL
openssl rand -hex 64

# Opção 3: Online (use sites confiáveis)
# https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

## 📝 Checklist de Deploy

### Antes do Deploy
- [ ] Código commitado e pushed para o repositório
- [ ] Banco de dados PostgreSQL configurado
- [ ] Todas as variáveis de ambiente definidas
- [ ] JWT secret gerado e configurado
- [ ] CORS_ORIGIN configurado corretamente

### Durante o Deploy
- [ ] Build executado com sucesso
- [ ] Servidor iniciado sem erros
- [ ] Logs não mostram erros críticos

### Após o Deploy
- [ ] Endpoint raiz (`/`) responde corretamente
- [ ] Rotas de autenticação funcionando
- [ ] Conexão com banco de dados estabelecida
- [ ] CORS funcionando para o frontend

## 🧪 Testando o Deploy

### 1. Teste Básico
```bash
curl https://seu-app.onrender.com/
```

Deve retornar:
```json
{"message": "Welcome to Lebrume.com.au API."}
```

### 2. Teste de Autenticação
```bash
curl -X POST https://seu-app.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456","userType":"Client"}'
```

### 3. Verificar Logs
No dashboard do Render, vá em "Logs" para verificar se há erros.

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com Banco
```
Error: connect ECONNREFUSED
```
**Solução**: Verificar credenciais do banco e conectividade

#### 2. JWT Secret Não Configurado
```
Error: secretOrPrivateKey has a value of "undefined"
```
**Solução**: Configurar variável JWT_SECRET

#### 3. CORS Error
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**Solução**: Verificar CORS_ORIGIN

#### 4. Port Already in Use
```
Error: listen EADDRINUSE :::8080
```
**Solução**: Render gerencia as portas automaticamente, usar `process.env.PORT`

### Verificação de Variáveis

Use o script de verificação:
```bash
npm run check-env
```

## 📊 Monitoramento

### Logs
- Acesse os logs em tempo real no dashboard do Render
- Configure alertas para erros críticos

### Métricas
- Monitor de CPU e memória disponível no dashboard
- Configure alertas para uso excessivo de recursos

### Health Check
O Render faz health checks automáticos na rota raiz (`/`)

## 🔄 Atualizações

### Deploy Automático
Com auto-deploy habilitado, cada push para a branch configurada fará um novo deploy.

### Deploy Manual
1. No dashboard, vá para o seu serviço
2. Clique em "Manual Deploy"
3. Selecione "Deploy latest commit"

## 🚨 Rollback

Se algo der errado:
1. No dashboard, vá para "Deploys"
2. Encontre um deploy anterior que funcionava
3. Clique em "Redeploy"

## 📞 Suporte

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Status Page**: https://status.render.com

---

## 🎯 URLs Finais

Após o deploy bem-sucedido:

- **API Base**: `https://seu-app.onrender.com`
- **Health Check**: `https://seu-app.onrender.com/`
- **Auth Endpoints**: `https://seu-app.onrender.com/api/auth/*`
- **Admin Panel**: `https://seu-app.onrender.com/api/admin/*`

**Importante**: Substitua `seu-app` pelo nome real do seu serviço no Render.

---

*Última atualização: 12/08/2025*

