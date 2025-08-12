# Lebrume Backend API

Backend API para a plataforma Lebrume - Sistema de acompanhantes profissionais na Austrália.

## 🚀 Tecnologias

- **Node.js** com **Express.js** (v5.1.0)
- **PostgreSQL** com **Sequelize ORM** (v6.37.7)
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **CORS** habilitado

## 📁 Estrutura do Projeto

```
src/
├── controllers/     # Lógica de negócio
├── models/         # Modelos de dados (Sequelize)
├── routes/         # Definição das rotas
├── middleware/     # Middlewares de autenticação e autorização
└── migrations/     # Migrações do banco de dados
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```env
# Banco de Dados
DB_HOST=seu_host_postgresql
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco
DB_DIALECT=postgres

# Aplicação
NODE_ENV=production
PORT=8080

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRES_IN=1d

# CORS
CORS_ORIGIN=https://lebrume.com.au
```

### Instalação

```bash
# Instalar dependências
npm install

# Executar migrações (se necessário)
npx sequelize-cli db:migrate

# Iniciar servidor
npm start
```

## 📚 API Endpoints

### Autenticação (`/api/auth`)

- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil do usuário atual (protegida)

### Companions (`/api/companions`)

- `GET /api/companions/search` - Buscar companions (pública)
- `GET /api/companions/:id` - Perfil específico (pública)
- `GET /api/companions/me` - Meu perfil (protegida - Companion)
- `PUT /api/companions/me` - Atualizar meu perfil (protegida - Companion)

### Administração (`/api/admin`)

- `GET /api/admin/stats` - Estatísticas do dashboard (Admin)
- `GET /api/admin/companions` - Listar todos os perfis (Admin)
- `GET /api/admin/companions/:id` - Detalhes do perfil (Admin)
- `PUT /api/admin/companions/:id/approval` - Aprovar/rejeitar perfil (Admin)
- `PUT /api/admin/companions/:id` - Editar perfil (Admin)
- `DELETE /api/admin/companions/:id` - Deletar perfil (Admin)
- `GET /api/admin/users` - Listar usuários (Admin)

### Outras Rotas

- `GET /api/stories` - Histórias
- `GET /api/verification` - Verificação
- `GET /api/messages` - Mensagens
- `GET /api/ratings` - Avaliações

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer seu_jwt_token
```

### Tipos de Usuário

- **Client** - Cliente da plataforma
- **Companion** - Acompanhante
- **Admin** - Administrador

## 🗄️ Modelos de Dados

### User
- Informações básicas do usuário
- Tipos: Client, Companion, Admin
- Senhas com hash bcrypt

### CompanionProfile
- Perfil detalhado do acompanhante
- Sistema de aprovação (isApproved)
- Cálculo automático de completude
- Controle de visibilidade

### Outros Modelos
- Service, Message, Rating, Story, VerificationRequest, Media, Plan, Subscription

## 🚀 Deploy na Render

### Configurações Necessárias

1. **Banco de Dados**: PostgreSQL configurado com SSL
2. **Variáveis de Ambiente**: Configurar todas as variáveis listadas acima
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

### Checklist de Deploy

- [x] Configurações de produção no `config/config.js`
- [x] SSL configurado para PostgreSQL
- [x] CORS configurado para domínio correto
- [x] Variáveis de ambiente sem valores hardcoded
- [x] Dependências atualizadas e sem vulnerabilidades
- [x] Estrutura de rotas otimizada

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
npm start      # Iniciar servidor de produção
npm run dev    # Iniciar servidor de desenvolvimento (nodemon)
```

### Estrutura de Middleware

- **authMiddleware**: Verificação de JWT
- **roleMiddleware**: Controle de acesso por tipo de usuário
- **combinedMiddleware**: Interface unificada

## 📋 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- Registro e login de usuários
- JWT com expiração configurável
- Hash seguro de senhas

### ✅ Sistema de Perfis
- CRUD completo de perfis de companions
- Sistema de aprovação por administradores
- Cálculo automático de completude do perfil
- Controle de visibilidade baseado em aprovação

### ✅ Painel Administrativo
- Dashboard com estatísticas
- Gerenciamento completo de perfis
- Aprovação/rejeição de perfis
- Gerenciamento de usuários

### ✅ Sistema de Busca
- Busca por localização
- Busca por palavras-chave
- Filtros diversos
- Paginação

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**: Verificar variáveis de ambiente
2. **Token inválido**: Verificar JWT_SECRET
3. **CORS error**: Verificar CORS_ORIGIN

### Logs

O sistema registra erros no console. Em produção, considere usar um serviço de logging.

## 📞 Suporte

Para suporte técnico, consulte a documentação ou entre em contato com a equipe de desenvolvimento.

---

**Versão**: 1.0.0  
**Última atualização**: 12/08/2025

