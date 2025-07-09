# 🤖 Bot Discord - Sistema de Tickets com IA

Um bot Discord profissional completo com sistema de tickets avançado e integração com Inteligência Artificial para suporte automatizado.

## ✨ Funcionalidades

### 🎫 Sistema de Tickets
- ✅ Criação automática de canais privados
- ✅ Controle de permissões por ticket
- ✅ Botões interativos para fácil uso
- ✅ Sistema de logs completo
- ✅ Prevenção de múltiplos tickets por usuário
- ✅ Fechamento automático com feedback

### 🤖 Integração com IA
- ✅ Comandos `/ai` para consultas diretas
- ✅ Resposta automática quando staff offline
- ✅ IA contextual para tickets de suporte
- ✅ Respostas personalizadas e profissionais

### 🛠️ Comandos Disponíveis
- `/ticket` - Criar novo ticket de suporte
- `/close` - Fechar ticket atual
- `/ai [pergunta]` - Consultar a IA
- `/setup` - Configurar sistema (admin)

### 🔧 Recursos Técnicos
- ✅ Slash Commands modernos
- ✅ Persistência de dados em JSON
- ✅ Sistema de logs detalhado
- ✅ Tratamento completo de erros
- ✅ Interface visual profissional
- ✅ Compatível com Discord.js v14

## 🚀 Instalação e Configuração

### 1. Pré-requisitos
- Node.js 16.9.0 ou superior
- Conta Discord Developer
- Chave API do OpenAI (opcional)

### 2. Configuração do Bot Discord

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Vá em "Bot" e crie um bot
4. Copie o token do bot
5. Em "OAuth2 > URL Generator":
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Administrator` (recomendado)

### 3. Instalação

```bash
# Clone ou baixe o projeto
git clone <seu-repositorio>
cd discord-ticket-ai-bot

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

### 4. Configuração do .env

Edite o arquivo `.env` com suas informações:

```env
# Discord Bot Configuration
DISCORD_TOKEN=SEU_TOKEN_AQUI
CLIENT_ID=ID_DO_SEU_BOT
GUILD_ID=ID_DO_SEU_SERVIDOR

# OpenAI Configuration (opcional)
OPENAI_API_KEY=SUA_CHAVE_OPENAI

# Bot Configuration
TICKET_CATEGORY_ID=ID_CATEGORIA_TICKETS
SUPPORT_ROLE_ID=ID_CARGO_SUPORTE
LOG_CHANNEL_ID=ID_CANAL_LOGS
```

### 5. Configuração do Servidor

1. **Criar Categoria para Tickets:**
   - Crie uma categoria chamada "🎫 Tickets"
   - Copie o ID da categoria

2. **Criar Cargo de Suporte:**
   - Crie um cargo @Suporte
   - Copie o ID do cargo

3. **Criar Canal de Logs:**
   - Crie um canal #logs-tickets
   - Copie o ID do canal

### 6. Iniciar o Bot

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📋 Como Usar

### Para Administradores

1. **Configurar Sistema:**
   ```
   /setup
   ```
   
2. **Verificar Logs:**
   - Monitore o canal de logs configurado
   - Acompanhe criação/fechamento de tickets

### Para Usuários

1. **Criar Ticket:**
   - Use o comando `/ticket`
   - Ou clique no botão após `/setup`

2. **Usar IA:**
   ```
   /ai Como configurar meu bot?
   ```

3. **Fechar Ticket:**
   - Use `/close` ou clique no botão vermelho

## 🎯 Casos de Uso Comerciais

### 💼 Para Desenvolvedores
- Venda de bots personalizados
- Suporte técnico automatizado
- Consultoria em Discord

### 🏢 Para Empresas
- Atendimento ao cliente 24/7
- Suporte técnico escalável
- Redução de custos operacionais

### 🎮 Para Comunidades
- Suporte a membros
- Sistema de dúvidas
- Moderação assistida

## 📊 Funcionalidades Avançadas

### Sistema de Persistência
- Dados salvos em `tickets.json`
- Histórico completo de mensagens
- Backup automático de configurações

### IA Contextual
- Respostas personalizadas por contexto
- Aprendizado baseado em tickets
- Escalação inteligente para humanos

### Logs Detalhados
- Criação de tickets com timestamp
- Ações de usuários registradas
- Métricas de performance

## 🔒 Segurança

- ✅ Permissões granulares por ticket
- ✅ Validação de comandos
- ✅ Tratamento seguro de erros
- ✅ Dados sensíveis em .env
- ✅ Logs de auditoria

## 🆘 Suporte e Personalização

### Customização Disponível
- 🎨 Cores e design dos embeds
- 🤖 Personalidade da IA
- 📝 Mensagens e textos
- ⚙️ Funcionalidades adicionais

### Serviços Oferecidos
- ✅ Instalação completa
- ✅ Configuração personalizada
- ✅ Treinamento da equipe
- ✅ Suporte técnico
- ✅ Atualizações e melhorias

## 📞 Contato

Para contratar nossos serviços ou tirar dúvidas:

- 💬 Discord: `@seu_discord`
- 📧 Email: `seu@email.com`
- 🌐 Website: `seusite.com`

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**⚡ Bot profissional, suporte de qualidade, IA integrada!**

*Transforme seu servidor Discord em um centro de suporte profissional.*