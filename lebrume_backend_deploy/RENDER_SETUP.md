# 🚀 Deploy Completo no Render - Passo a Passo

## 📋 PASSO 1: Criar Banco PostgreSQL

1. Acesse [render.com](https://render.com) e faça login
2. Clique em **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `lebrume-database`
   - **Database**: `lebrume_db`
   - **User**: `lebrume_db_user`
   - **Region**: `Frankfurt (EU Central)` ou mais próxima de você
   - **PostgreSQL Version**: `15` (mais recente)
   - **Plan**: `Free` (para começar)

4. Clique **"Create Database"**
5. **IMPORTANTE**: Anote as credenciais que aparecerão:
   - **Host**: `dpg-xxxxxxxxx-a.frankfurt-postgres.render.com`
   - **Database**: `lebrume_db`
   - **Username**: `lebrume_db_user`
   - **Password**: `xxxxxxxxxxxxxxxxx`
   - **Port**: `5432`

## 📋 PASSO 2: Criar Web Service

1. No dashboard do Render, clique **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub:
   - Clique **"Connect account"** se necessário
   - Selecione seu repositório `lebrume-backend`
3. Configure o serviço:
   - **Name**: `lebrume-backend`
   - **Region**: **MESMA região do banco** (importante!)
   - **Branch**: `main`
   - **Root Directory**: (deixe vazio)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

## 📋 PASSO 3: Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione EXATAMENTE estas variáveis:

### 🗄️ Banco de Dados (use as credenciais do PASSO 1):
```
DB_HOST = [cole o host do seu banco]
DB_PORT = 5432
DB_USERNAME = [cole o username do seu banco]
DB_PASSWORD = [cole a password do seu banco]
DB_DATABASE = [cole o database name do seu banco]
DB_DIALECT = postgres
```

### 🔧 Aplicação:
```
NODE_ENV = production
PORT = 8080
JWT_SECRET = [gere um secret - veja abaixo]
JWT_EXPIRES_IN = 1d
CORS_ORIGIN = https://lebrume.com.au
```

### 🔐 Como gerar JWT_SECRET:

**Opção 1** - Use este site: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
- Selecione "512-bit"
- Clique "Generate"
- Copie o resultado

**Opção 2** - Se tiver Node.js local:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📋 PASSO 4: Configurações Finais

1. **Plan**: Selecione `Free` (para começar)
2. **Auto-Deploy**: Deixe marcado `Yes`
3. Clique **"Create Web Service"**

## 📋 PASSO 5: Acompanhar Deploy

1. O Render começará o build automaticamente
2. Você verá os logs em tempo real
3. Aguarde aparecer: `✅ Build successful`
4. Depois: `✅ Deploy live`

## 📋 PASSO 6: Testar o Deploy

Quando o deploy terminar, você receberá uma URL como:
`https://lebrume-backend.onrender.com`

### Testes básicos:

1. **Teste raiz**:
   ```
   https://lebrume-backend.onrender.com/
   ```
   Deve retornar: `{"message": "Welcome to Lebrume.com.au API."}`

2. **Teste busca de companions**:
   ```
   https://lebrume-backend.onrender.com/api/companions/search
   ```
   Deve retornar lista vazia (normal no início)

## 🚨 Troubleshooting

### Se der erro de banco:
- Verifique se as credenciais estão corretas
- Certifique-se que o banco está na mesma região

### Se der erro de JWT:
- Verifique se o JWT_SECRET foi configurado
- Deve ter pelo menos 32 caracteres

### Se der timeout:
- Render Free pode demorar para "acordar"
- Aguarde 1-2 minutos e tente novamente

## 🎉 Sucesso!

Se tudo funcionou, seu backend está no ar! 

**URL da API**: `https://lebrume-backend.onrender.com/api`

### Próximos passos:
1. Configurar o frontend para usar esta URL
2. Criar primeiro usuário admin
3. Testar todas as funcionalidades

---

**Precisa de ajuda?** Me chame se algo der errado!

