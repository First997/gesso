# 🌌 Bot Discord Letaliverse

Bot de moderação e administração completo para o servidor Discord Letaliverse, com sistema de embeds personalizadas, tickets de suporte, sistema de XP e comandos de moderação.

## ✨ Funcionalidades

### 📋 Embeds Personalizadas
- **Boas-vindas**: Embed de boas-vindas personalizada com temática cósmica
- **Regras**: Regras completas do servidor com design atrativo
- **Sorteios**: Embed para canal de sorteios da staff
- **Seja Staff**: Formulários de recrutamento para diferentes áreas
- **Seja Booster**: Incentivo para boost do servidor
- **Cargos XP**: Sistema de progressão com recompensas por nível
- **Suporte**: Central de atendimento com sistema de tickets

### 🛡️ Sistema de Moderação
- `/ban` - Banir usuários
- `/kick` - Expulsar usuários  
- `/timeout` - Aplicar timeout (silenciar)
- `/clear` - Limpar mensagens do canal

### 🎫 Sistema de Tickets
- Criação automática de tickets de suporte
- Canais privados com permissões configuradas
- Sistema de fechamento com botões interativos

### 📈 Sistema de XP
- Ganho automático de XP por mensagens
- Sistema de níveis com notificações
- Progressão baseada nos cargos do Letaliverse

### 👋 Boas-vindas Automáticas
- Mensagem de boas-vindas personalizada para novos membros
- Integração com embed de boas-vindas do servidor

## 🚀 Comandos Disponíveis

### Comandos de Administração (Apenas Admins)
- `/setup-embeds` - Listar todos os comandos de embeds disponíveis
- `/send-welcome` - Enviar embed de boas-vindas
- `/send-rules` - Enviar embed de regras
- `/send-giveaway` - Enviar embed de sorteios
- `/send-staff` - Enviar embed de recrutamento staff
- `/send-booster` - Enviar embed seja booster
- `/send-xp` - Enviar embed de cargos XP
- `/send-support` - Enviar embed de suporte com botão de ticket

### Comandos de Moderação (Moderadores/Admins)
- `/ban @usuário [motivo]` - Banir um usuário
- `/kick @usuário [motivo]` - Expulsar um usuário
- `/timeout @usuário <minutos> [motivo]` - Silenciar um usuário
- `/clear <quantidade>` - Limpar mensagens (1-100)

### Comandos Gerais
- `/ticket` - Criar um ticket de suporte
- `/close` - Fechar ticket atual (apenas em tickets)

## ⚙️ Configuração

### 1. Pré-requisitos
```bash
# Node.js 16.9.0 ou superior
node --version

# Instalar dependências
npm install
```

### 2. Configurar Bot no Discord
1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação
3. Vá em "Bot" e crie um bot
4. Copie o token do bot
5. Em "OAuth2 > URL Generator":
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Administrator` (recomendado para todas as funções)

### 3. Configurar Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com seus dados
DISCORD_TOKEN=seu_token_do_bot_aqui
CLIENT_ID=seu_client_id_aqui
GUILD_ID=id_do_servidor_aqui

# Configure os IDs dos canais (opcional)
TICKET_CATEGORY_ID=id_categoria_tickets
SUPPORT_ROLE_ID=id_cargo_suporte
WELCOME_CHANNEL_ID=id_canal_boas_vindas
# ... outros canais conforme necessário
```

### 4. Obter IDs do Discord
1. Ative o **Modo Desenvolvedor** no Discord (Configurações > Avançado > Modo Desenvolvedor)
2. Clique com botão direito no servidor/canal/cargo
3. Selecione **"Copiar ID"**

## 🎮 Como Usar

### 1. Iniciar o Bot
```bash
# Modo desenvolvimento (reinicia automaticamente)
npm run dev

# Modo produção
npm start
```

### 2. Configurar Embeds no Servidor
1. Use `/setup-embeds` para ver todos os comandos disponíveis
2. Use os comandos `/send-*` nos canais apropriados
3. Configure os canais de acordo com sua estrutura

### 3. Sistema de Tickets
1. Use `/send-support` no canal de suporte
2. Membros podem clicar no botão para criar tickets
3. Tickets são criados automaticamente com permissões adequadas

## 🎨 Embeds Incluídas

### 🌌 Boas-vindas
- Temática cósmica do Letaliverse
- Guia de primeiros passos
- Links para canais importantes
- Imagem personalizada

### 📜 Regras
- Regras de convivência detalhadas
- Uso correto do servidor
- Design profissional
- Imagem temática

### 🎁 Sorteios
- Instruções para participação
- Design atrativo
- Imagem personalizada

### 👥 Seja Staff
- Formulários por área (Suporte, Eventos, Design, Comunicação)
- Links diretos do Google Forms
- Descrição detalhada de cada função

### 🚀 Seja Booster
- Benefícios do server boost
- Design chamativo
- Incentivo à comunidade

### 🧱 Cargos XP
- Sistema completo de progressão
- 10 níveis com benefícios únicos
- Do Ghoul ao Rei Mago
- Explicação detalhada do sistema

## 📊 Sistema de Níveis

| Nível | Cargo | Benefícios |
|-------|-------|------------|
| 10 | @Ghoul | Alterar apelido |
| 20 | @Hunter | Emojis/figurinhas externas |
| 30 | @Feiticeiro | Enviar mídias |
| 40 | @Alquimista | 2x chances em sorteios |
| 50 | @Titã | Usar vídeo |
| 60 | @Anbu | Enviar áudios |
| 70 | @Hashira | Efeitos externos + 5% desconto VIP |
| 80 | @Monarca | 15 dias VIP Draco grátis |
| 90 | @Yonkou | Invadir calls |
| 100 | @Rei Mago | 1 mês VIP Pegasus grátis |

## 🛠️ Desenvolvimento

### Estrutura do Projeto
```
├── index.js          # Arquivo principal do bot
├── package.json      # Dependências e scripts
├── .env.example     # Exemplo de configuração
├── .env             # Configuração local (não versionado)
├── tickets.json     # Dados dos tickets (gerado automaticamente)
├── levels.json      # Dados de XP dos usuários (gerado automaticamente)
└── README.md        # Este arquivo
```

### Dependências
- `discord.js` - Biblioteca principal do Discord
- `dotenv` - Gerenciamento de variáveis de ambiente
- `fs` - Sistema de arquivos (nativo do Node.js)

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🌟 Créditos

- **Tema**: Letaliverse - Comunidade cósmica de animes e games
- **Imagens**: Designs personalizados para cada embed
- **Desenvolvido com**: JavaScript, Discord.js v14

---

**🌌 Feito com ❤️ para a comunidade Letaliverse**