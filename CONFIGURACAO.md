# 🚀 Configuração Rápida - Bot Letaliverse

## 📋 Passo a Passo

### 1. 🔧 Preparar o Ambiente
```bash
# Instalar dependências
npm install

# Copiar arquivo de configuração
cp .env.example .env
```

### 2. 🤖 Criar Bot no Discord
1. Acesse: https://discord.com/developers/applications
2. Clique em "New Application"
3. Dê um nome (ex: "Letaliverse Bot")
4. Vá em "Bot" → "Add Bot"
5. **Copie o Token** (importante!)
6. Em "OAuth2" → "URL Generator":
   - ✅ Scopes: `bot` e `applications.commands`
   - ✅ Permissions: `Administrator`
7. **Copie o link** e adicione o bot ao servidor

### 3. ⚙️ Configurar IDs
1. **Ativar Modo Desenvolvedor**: Discord → Configurações → Avançado → Modo Desenvolvedor
2. **Coletar IDs** (clique direito → "Copiar ID"):

#### IDs Obrigatórios:
```env
DISCORD_TOKEN=Cole_o_token_do_bot_aqui
CLIENT_ID=ID_do_bot_(em_OAuth2_General)
GUILD_ID=ID_do_servidor
```

#### IDs Opcionais (recomendados):
```env
# Para tickets funcionarem
TICKET_CATEGORY_ID=ID_da_categoria_tickets
SUPPORT_ROLE_ID=ID_do_cargo_suporte

# Para boas-vindas automáticas
WELCOME_CHANNEL_ID=ID_do_canal_boas_vindas
```

### 4. 🏗️ Estrutura do Servidor (Sugerida)
```
📁 LETALIVERSE
├── 📝 Informações
│   ├── #📜・regras
│   ├── #🎁・sorteios  
│   ├── #👥・seja-staff
│   ├── #🚀・seja-booster
│   └── #🧱・cargos-xp
├── 💬 Chat
│   ├── #👋・boas-vindas
│   ├── #💬・chat-geral
│   └── #🤖・comandos
├── 🎫 Suporte
│   ├── #🎫・criar-ticket
│   └── 📁 Tickets (categoria)
└── 👑 Staff
    └── #📊・logs
```

### 5. ▶️ Iniciar o Bot
```bash
# Testar (reinicia automaticamente)
npm run dev

# Produção
npm start
```

### 6. 📤 Configurar Embeds
Use estes comandos no servidor:

```bash
# Ver todos os comandos
/setup-embeds

# Enviar cada embed no canal correspondente
/send-welcome     # no #👋・boas-vindas
/send-rules       # no #📜・regras
/send-giveaway    # no #🎁・sorteios
/send-staff       # no #👥・seja-staff
/send-booster     # no #🚀・seja-booster
/send-xp          # no #🧱・cargos-xp
/send-support     # no #🎫・criar-ticket
```

## ✅ Checklist Final

- [ ] Bot online e respondendo
- [ ] Comandos slash funcionando
- [ ] Embeds enviadas nos canais corretos
- [ ] Sistema de tickets testado
- [ ] Boas-vindas automáticas funcionando
- [ ] Comandos de moderação testados

## 🆘 Problemas Comuns

### Bot não aparece online
- ✅ Verifique o token no .env
- ✅ Certifique-se que o bot foi adicionado ao servidor

### Comandos não funcionam
- ✅ Verifique se CLIENT_ID e GUILD_ID estão corretos
- ✅ Reinicie o bot após alterar o .env

### Tickets não criam
- ✅ Configure TICKET_CATEGORY_ID
- ✅ Certifique-se que o bot tem permissões de administrador

### Boas-vindas não funcionam
- ✅ Configure WELCOME_CHANNEL_ID
- ✅ Verifique se o canal existe

## 🎯 Dicas

1. **Backup**: Mantenha backup do arquivo .env
2. **Logs**: Monitore o console para erros
3. **Testes**: Teste cada funcionalidade antes de usar
4. **Canais**: Use nomes descritivos para os canais
5. **Permissões**: O bot precisa ser administrador para funcionar completamente

---

**🌌 Bot pronto para o Letaliverse!**