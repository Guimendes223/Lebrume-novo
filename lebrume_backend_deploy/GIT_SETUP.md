# 🚀 Setup Git e Deploy - Lebrume Backend

## 📋 PASSO 1: Configurar Git Local

Execute estes comandos na pasta do projeto:

```bash
# Inicializar repositório Git
git init

# Configurar seu nome e email (se ainda não configurou)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit - Lebrume Backend revisado e pronto para deploy"
```

## 📋 PASSO 2: Criar Repositório no GitHub

1. Vá para [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `lebrume-backend`
4. Descrição: `Backend API para plataforma Lebrume`
5. **Deixe PRIVADO** (por segurança)
6. **NÃO** marque "Add README" (já temos)
7. Clique "Create repository"

## 📋 PASSO 3: Conectar com GitHub

Copie os comandos que o GitHub mostrar, algo como:

```bash
# Adicionar origem remota
git remote add origin https://github.com/SEU_USUARIO/lebrume-backend.git

# Fazer push inicial
git branch -M main
git push -u origin main
```

## 📋 PASSO 4: Verificar Upload

- Acesse seu repositório no GitHub
- Verifique se todos os arquivos estão lá
- **IMPORTANTE**: Verifique se o arquivo `.env` está lá (necessário para o Render)

## ⚠️ IMPORTANTE - Segurança

O arquivo `.env` contém as configurações de produção. Como o repositório é privado, está seguro, mas:

1. **NUNCA** torne o repositório público com o `.env`
2. No Render, vamos configurar as variáveis de ambiente separadamente
3. O `.env` serve como template/backup

## 🎯 Próximo Passo

Depois que o código estiver no GitHub, vamos configurar o Render!

---

**Precisa de ajuda?** Me avise se tiver algum problema em qualquer etapa!

