import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Configuração do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
  ],
});

// Configurações
const config = {
  guildId: process.env.GUILD_ID,
  ticketCategoryId: process.env.TICKET_CATEGORY_ID,
  supportRoleId: process.env.SUPPORT_ROLE_ID,
  logChannelId: process.env.LOG_CHANNEL_ID,
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
  rulesChannelId: process.env.RULES_CHANNEL_ID,
  giveawayChannelId: process.env.GIVEAWAY_CHANNEL_ID,
  staffChannelId: process.env.STAFF_CHANNEL_ID,
  boosterChannelId: process.env.BOOSTER_CHANNEL_ID,
  xpChannelId: process.env.XP_CHANNEL_ID,
  supportChannelId: process.env.SUPPORT_CHANNEL_ID,
};

// Comandos slash
const commands = [
  {
    name: 'setup-embeds',
    description: 'Configurar todas as embeds do servidor (Admin only)',
  },
  {
    name: 'send-welcome',
    description: 'Enviar embed de boas-vindas',
  },
  {
    name: 'send-rules',
    description: 'Enviar embed de regras',
  },
  {
    name: 'send-giveaway',
    description: 'Enviar embed de sorteios',
  },
  {
    name: 'send-staff',
    description: 'Enviar embed seja staff',
  },
  {
    name: 'send-booster',
    description: 'Enviar embed seja booster',
  },
  {
    name: 'send-xp',
    description: 'Enviar embed cargos XP',
  },
  {
    name: 'send-support',
    description: 'Enviar embed de atendimento/suporte',
  },
  {
    name: 'ticket',
    description: 'Criar um novo ticket de suporte',
  },
  {
    name: 'close',
    description: 'Fechar o ticket atual',
  },
  {
    name: 'ban',
    description: 'Banir um usuário',
    options: [
      {
        name: 'usuario',
        description: 'Usuário a ser banido',
        type: 6,
        required: true,
      },
      {
        name: 'motivo',
        description: 'Motivo do banimento',
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: 'kick',
    description: 'Expulsar um usuário',
    options: [
      {
        name: 'usuario',
        description: 'Usuário a ser expulso',
        type: 6,
        required: true,
      },
      {
        name: 'motivo',
        description: 'Motivo da expulsão',
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: 'timeout',
    description: 'Aplicar timeout em um usuário',
    options: [
      {
        name: 'usuario',
        description: 'Usuário para aplicar timeout',
        type: 6,
        required: true,
      },
      {
        name: 'duracao',
        description: 'Duração em minutos',
        type: 4,
        required: true,
      },
      {
        name: 'motivo',
        description: 'Motivo do timeout',
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: 'clear',
    description: 'Limpar mensagens do canal',
    options: [
      {
        name: 'quantidade',
        description: 'Quantidade de mensagens (1-100)',
        type: 4,
        required: true,
      },
    ],
  },
];

// Sistema de armazenamento
let tickets = {};
let userLevels = {};

// Carregar dados
function loadData() {
  try {
    if (fs.existsSync('tickets.json')) {
      const data = fs.readFileSync('tickets.json', 'utf8');
      tickets = JSON.parse(data);
    }
    if (fs.existsSync('levels.json')) {
      const data = fs.readFileSync('levels.json', 'utf8');
      userLevels = JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    tickets = {};
    userLevels = {};
  }
}

// Salvar dados
function saveData() {
  try {
    fs.writeFileSync('tickets.json', JSON.stringify(tickets, null, 2));
    fs.writeFileSync('levels.json', JSON.stringify(userLevels, null, 2));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

// Registrar comandos
async function registerCommands() {
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    console.log('🔄 Registrando comandos slash...');
    
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, config.guildId),
      { body: commands }
    );
    
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
}

// Função para criar embed básica
function createEmbed(title, description, color = 0x7289DA, imageUrl = null) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: 'Letaliverse • Bot de Moderação' });
  
  if (imageUrl) {
    embed.setImage(imageUrl);
  }
  
  return embed;
}

// Embed de Boas-vindas
function createWelcomeEmbed() {
  return new EmbedBuilder()
    .setTitle('Boas vindas ao Letaliverse!')
    .setDescription(`🌌・**Sinta-se em casa!**
Seja bem-vindo(a) ao Letaliverse, uma comunidade com foco em animes, games e assuntos relacionados, guiada por uma temática cósmica, mesclada com o próprio mundo geek. Aqui, você encontrará espaço para se conectar com quem compartilha as mesmas paixões, eventos, bots interativos, cargos evolutivos e muitas surpresas por ai...

🛰️ **Por onde começar?**
• Leia as ⁠📜・regras para conhecer as normas da comunidade.
• Confira o ⁠🏅・cargos-xp para entender como funcionam os cargos por nível.
• Explore o ⁠💎・seja-vip se quiser conquistar um cargo cósmico exclusivo.
• Participe do ⁠💬・chat-geral e comece a interagir com a galera.
• Use ⁠🤖・comandos para acessar bots e recursos automáticos.

🌠 **Dúvidas?**
Nosso canal ⁠💡・sugestões está aberto para sugestões ou dúvidas. A equipe também pode ser mencionada se necessário.

**Agora, prepare-se para mergulhar no universo. Sua jornada começa agora.**`)
    .setColor(0x7B68EE)
    .setImage('https://images-ext-1.discordapp.net/external/wQRg7mz4GtjTig_MdnSFD1Zchg2pbmJq-AxoIonzwJQ/https/i.postimg.cc/ZqVBhhNm/bem-vindos.png?format=webp&quality=lossless&width=922&height=518')
    .setTimestamp()
    .setFooter({ text: 'Letaliverse • Sistema de Boas-vindas' });
}

// Embed de Regras
function createRulesEmbed() {
  return new EmbedBuilder()
    .setTitle('📜・Regras do Letaliverse')
    .setDescription(`**Antes de explorar as galáxias, leia com atenção nossas diretrizes:**

🚫 **Regras de convivência**
• Respeito é a base – ofensas, preconceito ou comportamento tóxico não serão tolerados.
• Sem spam ou flood – evite mensagens repetidas, links aleatórios ou divulgação sem permissão.
• Conteúdo adulto é proibido – este é um espaço público e acessível a menores de idade.
• Discussões delicadas – evite temas políticos, religiosos ou que incentivem conflito.
• Nomes e fotos ofensivas – serão removidos e o usuário advertido.

📡 **Uso do Servidor**
• Use os canais corretamente – cada área tem uma função específica.
• Não marque a staff sem motivo – dúvidas devem ir para os canais apropriados.
• Divulgação apenas com permissão – peça autorização prévia da administração.
• Comandos de bot – use apenas nos canais destinados a isso.
• Banimentos – reincidência em infrações resultará em punições graduais.

💬 **Dúvidas?**
Caso tenha qualquer dúvida, procure um membro da equipe staff ou envie sua pergunta no canal de suporte.`)
    .setColor(0xFF4500)
    .setImage('https://images-ext-1.discordapp.net/external/GWlP1NlvslM58Gr-3xPf8JopNLEi6nN-EWUOn7mSmZg/https/i.postimg.cc/43Ltm8z0/M-1.png?format=webp&quality=lossless&width=922&height=518')
    .setTimestamp()
    .setFooter({ text: 'Letaliverse • Regras da Comunidade' });
}

// Embed de Sorteios
function createGiveawayEmbed() {
  return new EmbedBuilder()
    .setTitle('🎁 Sorteios')
    .setDescription(`**Este é o espaço onde a equipe da staff realiza sorteios incríveis para a comunidade!** Fique atento às postagens para não perder a chance de ganhar prêmios especiais.

📌 **Como participar:**
• Acompanhe as instruções de cada sorteio postado pela staff.
• Siga as regras especificadas para garantir sua participação.
• Aguarde o anúncio dos vencedores no próprio canal.

🎉 **Boa sorte a todos os participantes!**
**Que vença o mais sortudo.**`)
    .setColor(0xFFD700)
    .setImage('https://images-ext-1.discordapp.net/external/Qx7PkMCrlvclw30jLKG4fKnoKgGcKG7V7Ybgq1CpobI/https/i.postimg.cc/Qt2cV6dP/SORTEIO.png?format=webp&quality=lossless&width=922&height=518')
    .setTimestamp()
    .setFooter({ text: 'Letaliverse • Sistema de Sorteios' });
}

// Embed Seja Staff
function createStaffEmbed() {
  return new EmbedBuilder()
    .setTitle('👥 Torne-se Staff do Letaliverse!')
    .setDescription(`O Letaliverse está crescendo e buscamos pessoas comprometidas para fazer parte da nossa equipe. Aqui você pode colaborar diretamente com o desenvolvimento do servidor, ajudando na gestão, organização de eventos e no fortalecimento da comunidade. Confira as áreas disponíveis:

🛡️ **Suporte**
Responsáveis por auxiliar os membros, esclarecer dúvidas e manter o ambiente seguro e acolhedor.

🎉 **Eventos**
Organizam atividades, sorteios e interações para movimentar o servidor e garantir a diversão da comunidade.

🎨 **Design**
Criam artes, banners e materiais visuais para manter a identidade do Letaliverse sempre criativa e atualizada.

📢 **Comunicação**
Promovem o servidor, interagem com novos membros, participam de calls e buscam novas parcerias, mantendo o Letaliverse sempre em expansão.

🔗 **Interessado em fazer parte?**
Clique nos links abaixo e preencha o formulário da área que mais combina com você. Esperamos você na nossa equipe!

**Suporte:** https://forms.gle/Z8DDDAk3mEqRGU7VA
**Eventos:** https://forms.gle/9bYZqdHDKSY1b3dE9
**Design:** https://forms.gle/zM5zNbFLzzepesM26
**Comunicação:** https://forms.gle/WsZEtzhyiJnxxxAq7`)
    .setColor(0x32CD32)
    .setImage('https://images-ext-1.discordapp.net/external/8g-Kuz9E36Pz-21aMWnEO3LCZ5edR6wjC-qQ9TGFJaU/https/i.postimg.cc/zX4YSJGP/seja-staff.png?format=webp&quality=lossless&width=922&height=518')
    .setTimestamp()
    .setFooter({ text: 'Letaliverse • Recrutamento Staff' });
}

// Embed Seja Booster
function createBoosterEmbed() {
  return new EmbedBuilder()
    .setTitle('🚀 Seja Booster!')
    .setDescription(`**Quer dar aquele upgrade na sua experiência aqui com a gente?**

🔥 **Quem boostar o servidor ganha:**
🎥 Acesso ao envio de mídias
🎁 2x mais chances nos sorteios
⚡1.5x mais XP em todas as interações

**Além de ajudar a comunidade a crescer ainda mais!**

**Clique em Boostar e venha para o time Letaliverse ;)**`)
    .setColor(0xFF69B4)
    .setImage('https://images-ext-1.discordapp.net/external/z0ogjGJeiKiLicJeg0Z2eGyOvuu6aiJ7QMjBZCR0Brc/https/i.postimg.cc/pVgBSDxZ/seja-booster.png?format=webp&quality=lossless&width=922&height=518')
    .setTimestamp()
    .setFooter({ text: 'Letaliverse • Server Boost' });
}

// Embed Cargos XP
function createXPEmbed() {
  return new EmbedBuilder()
    .setTitle('🧱 Cargos por Nível')
    .setDescription(`No nosso servidor, você evolui de cargo conforme ganha XP ao interagir nos chats. Cada mensagem enviada contribui para o seu progresso!

📈 **Como funciona?**
• Ao conversar no chat, você acumula XP.
• Ao atingir determinados níveis, você sobe de cargo.
• Os cargos são em cascata: ao conquistar um novo, o anterior é substituído.
• Cada novo cargo mantém as permissões do anterior e adiciona novas.

🎖️ **Cargos e Permissões:**
**Nível 10:** @Ghoul - Alterar apelido
**Nível 20:** @Hunter - Reagir com emojis/figurinhas externas
**Nível 30:** @Feiticeiro - Enviar mídias
**Nível 40:** @Alquimista - 2x chances em sorteios (via bot)
**Nível 50:** @Titã - Usar vídeo (transmissão e webcam)
**Nível 60:** @Anbu - Enviar áudios
**Nível 70:** @Hashira - Efeitos e sons externos + 5% desconto em VIP
**Nível 80:** @Monarca - 15 dias de VIP Draco grátis
**Nível 90:** @Yonkou - Invadir calls (exceto as de VIP)
**Nível 100:** @Rei Mago - 1 mês de VIP Pegasus grátis

**Boa jornada!**
Fique de olho no seu progresso e aproveite as vantagens de cada nível!`)
    .setColor(0x9370DB)
    .setImage('https://images-ext-1.discordapp.net/external/9llbNlJa1IH-ZSJr08-nJU4nZ4j_n7QPb1F0UKI9U-0/https/i.postimg.cc/BZyF6sVQ/cargos-de-xp.png?format=webp&quality=lossless&width=922&height=518')
    .setTimestamp()
    .setFooter({ text: 'Letaliverse • Sistema de Níveis' });
}

// Embed de Atendimento/Suporte
function createSupportEmbed() {
  return new EmbedBuilder()
    .setTitle('🎫 Atendimento e Suporte')
    .setDescription(`**Precisa de ajuda? Estamos aqui para você!**

Nossa equipe de suporte está pronta para te ajudar com qualquer dúvida ou problema que você possa ter.

🛠️ **Como solicitar suporte:**
• Clique no botão "Criar Ticket" abaixo
• Descreva detalhadamente seu problema ou dúvida
• Aguarde um membro da nossa equipe te atender
• Mantenha a conversa educada e respeitosa

⏰ **Horário de atendimento:**
• Segunda a Sexta: 9h às 18h
• Finais de semana: 10h às 16h
• Fora do horário: Respostas em até 24h

📋 **Tipos de suporte oferecido:**
• Dúvidas sobre o servidor
• Problemas técnicos
• Denúncias e reportes
• Sugestões e feedback
• Parcerias e colaborações

**Nossa equipe está sempre disposta a ajudar!**`)
    .setColor(0x00CED1)
    .setTimestamp()
    .setFooter({ text: 'Letaliverse • Central de Suporte' });
}

// Criar ticket
async function createTicket(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  
  // Verificar se usuário já tem ticket aberto
  const existingTicket = Object.values(tickets).find(ticket => 
    ticket.userId === user.id && ticket.status === 'open'
  );
  
  if (existingTicket) {
    return interaction.reply({
      embeds: [createEmbed('❌ Ticket Já Existe', 'Você já possui um ticket aberto! Feche o atual antes de criar outro.', 0xFF0000)],
      ephemeral: true
    });
  }

  try {
    // Criar canal do ticket
    const ticketChannel = await guild.channels.create({
      name: `ticket-${user.username}-${Date.now()}`,
      type: ChannelType.GuildText,
      parent: config.ticketCategoryId,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        {
          id: config.supportRoleId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
      ],
    });

    // Salvar informações do ticket
    tickets[ticketChannel.id] = {
      userId: user.id,
      channelId: ticketChannel.id,
      createdAt: new Date().toISOString(),
      status: 'open',
      messages: [],
    };
    saveData();

    // Embed de boas-vindas do ticket
    const welcomeEmbed = createEmbed(
      '🎫 Ticket Criado',
      `Olá ${user}! Bem-vindo ao seu ticket de suporte.\n\n**Como funciona:**\n• Descreva seu problema ou dúvida\n• Nossa equipe irá te ajudar o mais rápido possível\n• Quando resolvido, clique em "Fechar Ticket"\n\n**Ticket ID:** \`${ticketChannel.id}\``,
      0x00CED1
    );

    const closeButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('🔒 Fechar Ticket')
          .setStyle(ButtonStyle.Danger)
      );

    await ticketChannel.send({
      embeds: [welcomeEmbed],
      components: [closeButton]
    });

    await interaction.reply({
      embeds: [createEmbed('✅ Ticket Criado!', `Seu ticket foi criado em ${ticketChannel}`, 0x00FF00)],
      ephemeral: true
    });

  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    await interaction.reply({
      embeds: [createEmbed('❌ Erro', 'Não foi possível criar o ticket. Contate um administrador.', 0xFF0000)],
      ephemeral: true
    });
  }
}

// Fechar ticket
async function closeTicket(interaction) {
  const channelId = interaction.channel.id;
  const ticket = tickets[channelId];

  if (!ticket || ticket.status === 'closed') {
    return interaction.reply({
      embeds: [createEmbed('❌ Erro', 'Este não é um canal de ticket válido ou já está fechado.', 0xFF0000)],
      ephemeral: true
    });
  }

  try {
    tickets[channelId].status = 'closed';
    tickets[channelId].closedAt = new Date().toISOString();
    tickets[channelId].closedBy = interaction.user.id;
    saveData();

    const closeEmbed = createEmbed(
      '🔒 Ticket Fechado',
      `Ticket fechado por ${interaction.user}\n\nEste canal será deletado em 10 segundos.\n\n**Obrigado por usar nosso suporte!**`,
      0xFF9900
    );

    await interaction.reply({ embeds: [closeEmbed] });

    setTimeout(async () => {
      try {
        await interaction.channel.delete();
      } catch (error) {
        console.error('Erro ao deletar canal:', error);
      }
    }, 10000);

  } catch (error) {
    console.error('Erro ao fechar ticket:', error);
    await interaction.reply({
      embeds: [createEmbed('❌ Erro', 'Não foi possível fechar o ticket.', 0xFF0000)],
      ephemeral: true
    });
  }
}

// Event: Bot pronto
client.once('ready', async () => {
  console.log(`🤖 Bot ${client.user.tag} está online!`);
  console.log(`🌐 Conectado em ${client.guilds.cache.size} servidor(s)`);
  
  loadData();
  await registerCommands();
  
  client.user.setActivity('🌌 Letaliverse • Moderação', { type: 'WATCHING' });
});

// Event: Comandos slash
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand() && !interaction.isButton()) return;

  try {
    if (interaction.isCommand()) {
      const { commandName } = interaction;

      // Verificar permissões de admin para comandos de moderação
      const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);
      const isModerator = interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers);

      switch (commandName) {
        case 'setup-embeds':
          if (!isAdmin) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Apenas administradores podem usar este comando.', 0xFF0000)],
              ephemeral: true
            });
          }
          await interaction.reply({
            embeds: [createEmbed('✅ Setup Disponível', 'Use os comandos `/send-welcome`, `/send-rules`, `/send-giveaway`, `/send-staff`, `/send-booster`, `/send-xp`, `/send-support` para enviar as embeds.', 0x00FF00)],
            ephemeral: true
          });
          break;

        case 'send-welcome':
          if (!isAdmin) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Apenas administradores podem usar este comando.', 0xFF0000)],
              ephemeral: true
            });
          }
          await interaction.reply({ embeds: [createWelcomeEmbed()] });
          break;

        case 'send-rules':
          if (!isAdmin) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Apenas administradores podem usar este comando.', 0xFF0000)],
              ephemeral: true
            });
          }
          await interaction.reply({ embeds: [createRulesEmbed()] });
          break;

        case 'send-giveaway':
          if (!isAdmin) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Apenas administradores podem usar este comando.', 0xFF0000)],
              ephemeral: true
            });
          }
          await interaction.reply({ embeds: [createGiveawayEmbed()] });
          break;

        case 'send-staff':
          if (!isAdmin) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Apenas administradores podem usar este comando.', 0xFF0000)],
              ephemeral: true
            });
          }
          await interaction.reply({ embeds: [createStaffEmbed()] });
          break;

        case 'send-booster':
          if (!isAdmin) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Apenas administradores podem usar este comando.', 0xFF0000)],
              ephemeral: true
            });
          }
          await interaction.reply({ embeds: [createBoosterEmbed()] });
          break;

        case 'send-xp':
          if (!isAdmin) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Apenas administradores podem usar este comando.', 0xFF0000)],
              ephemeral: true
            });
          }
          await interaction.reply({ embeds: [createXPEmbed()] });
          break;

        case 'send-support':
          if (!isAdmin) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Apenas administradores podem usar este comando.', 0xFF0000)],
              ephemeral: true
            });
          }
          
          const supportEmbed = createSupportEmbed();
          const ticketButton = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('🎫 Criar Ticket')
                .setStyle(ButtonStyle.Primary)
            );

          await interaction.reply({
            embeds: [supportEmbed],
            components: [ticketButton]
          });
          break;

        case 'ticket':
          await createTicket(interaction);
          break;

        case 'close':
          await closeTicket(interaction);
          break;

        case 'ban':
          if (!isModerator) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Você não tem permissão para banir usuários.', 0xFF0000)],
              ephemeral: true
            });
          }
          
          const userToBan = interaction.options.getUser('usuario');
          const banReason = interaction.options.getString('motivo') || 'Nenhum motivo fornecido';
          
          try {
            await interaction.guild.members.ban(userToBan, { reason: banReason });
            await interaction.reply({
              embeds: [createEmbed('✅ Usuário Banido', `${userToBan.tag} foi banido.\n**Motivo:** ${banReason}`, 0xFF0000)]
            });
          } catch (error) {
            await interaction.reply({
              embeds: [createEmbed('❌ Erro', 'Não foi possível banir o usuário.', 0xFF0000)],
              ephemeral: true
            });
          }
          break;

        case 'kick':
          if (!isModerator) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Você não tem permissão para expulsar usuários.', 0xFF0000)],
              ephemeral: true
            });
          }
          
          const userToKick = interaction.options.getUser('usuario');
          const kickReason = interaction.options.getString('motivo') || 'Nenhum motivo fornecido';
          
          try {
            const member = await interaction.guild.members.fetch(userToKick.id);
            await member.kick(kickReason);
            await interaction.reply({
              embeds: [createEmbed('✅ Usuário Expulso', `${userToKick.tag} foi expulso.\n**Motivo:** ${kickReason}`, 0xFF9900)]
            });
          } catch (error) {
            await interaction.reply({
              embeds: [createEmbed('❌ Erro', 'Não foi possível expulsar o usuário.', 0xFF0000)],
              ephemeral: true
            });
          }
          break;

        case 'timeout':
          if (!isModerator) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Você não tem permissão para aplicar timeout.', 0xFF0000)],
              ephemeral: true
            });
          }
          
          const userToTimeout = interaction.options.getUser('usuario');
          const duration = interaction.options.getInteger('duracao');
          const timeoutReason = interaction.options.getString('motivo') || 'Nenhum motivo fornecido';
          
          try {
            const member = await interaction.guild.members.fetch(userToTimeout.id);
            await member.timeout(duration * 60 * 1000, timeoutReason);
            await interaction.reply({
              embeds: [createEmbed('✅ Timeout Aplicado', `${userToTimeout.tag} foi silenciado por ${duration} minutos.\n**Motivo:** ${timeoutReason}`, 0xFFD700)]
            });
          } catch (error) {
            await interaction.reply({
              embeds: [createEmbed('❌ Erro', 'Não foi possível aplicar timeout.', 0xFF0000)],
              ephemeral: true
            });
          }
          break;

        case 'clear':
          if (!isModerator) {
            return interaction.reply({
              embeds: [createEmbed('❌ Sem Permissão', 'Você não tem permissão para limpar mensagens.', 0xFF0000)],
              ephemeral: true
            });
          }
          
          const amount = interaction.options.getInteger('quantidade');
          
          if (amount < 1 || amount > 100) {
            return interaction.reply({
              embeds: [createEmbed('❌ Erro', 'A quantidade deve ser entre 1 e 100.', 0xFF0000)],
              ephemeral: true
            });
          }
          
          try {
            const messages = await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({
              embeds: [createEmbed('✅ Mensagens Limpas', `${messages.size} mensagens foram deletadas.`, 0x00FF00)],
              ephemeral: true
            });
          } catch (error) {
            await interaction.reply({
              embeds: [createEmbed('❌ Erro', 'Não foi possível limpar as mensagens.', 0xFF0000)],
              ephemeral: true
            });
          }
          break;
      }
    }

    if (interaction.isButton()) {
      const { customId } = interaction;

      switch (customId) {
        case 'create_ticket':
          await createTicket(interaction);
          break;
        case 'close_ticket':
          await closeTicket(interaction);
          break;
      }
    }
  } catch (error) {
    console.error('Erro na interação:', error);
    const errorEmbed = createEmbed('❌ Erro', 'Ocorreu um erro interno. Tente novamente.', 0xFF0000);
    
    if (interaction.deferred) {
      await interaction.editReply({ embeds: [errorEmbed] });
    } else {
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
});

// Event: Boas-vindas automáticas
client.on('guildMemberAdd', async (member) => {
  if (config.welcomeChannelId) {
    const welcomeChannel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (welcomeChannel) {
      const personalWelcome = createEmbed(
        `🌌 Bem-vindo(a), ${member.user.username}!`,
        `Olá ${member}! Seja muito bem-vindo(a) ao **Letaliverse**!\n\nNão se esqueça de ler as regras e se divertir conosco! 🚀`,
        0x7B68EE
      );
      await welcomeChannel.send({ embeds: [personalWelcome] });
    }
  }
});

// Sistema de XP simples
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const userId = message.author.id;
  
  if (!userLevels[userId]) {
    userLevels[userId] = { xp: 0, level: 0, messages: 0 };
  }
  
  userLevels[userId].xp += Math.floor(Math.random() * 10) + 5;
  userLevels[userId].messages += 1;
  
  const newLevel = Math.floor(userLevels[userId].xp / 100);
  
  if (newLevel > userLevels[userId].level) {
    userLevels[userId].level = newLevel;
    
    // Enviar mensagem de level up
    const levelUpEmbed = createEmbed(
      '🎉 Level Up!',
      `Parabéns ${message.author}! Você subiu para o **Nível ${newLevel}**!\n\nContinue interagindo para desbloquear novos cargos!`,
      0xFFD700
    );
    
    await message.channel.send({ embeds: [levelUpEmbed] });
    
    // Salvar dados de XP
    saveData();
  }
});

// Tratamento de erros
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Login do bot
client.login(process.env.DISCORD_TOKEN);