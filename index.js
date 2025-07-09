import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from 'discord.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Configuração do OpenAI (opcional)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI configurado e ativo');
} else {
  console.log('⚠️  OpenAI não configurado - IA desabilitada');
}

// Configuração do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Configurações
const config = {
  ticketCategoryId: process.env.TICKET_CATEGORY_ID,
  supportRoleId: process.env.SUPPORT_ROLE_ID,
  logChannelId: process.env.LOG_CHANNEL_ID,
  guildId: process.env.GUILD_ID,
};

// Comandos slash
const commands = [
  {
    name: 'ticket',
    description: 'Criar um novo ticket de suporte',
  },
  {
    name: 'close',
    description: 'Fechar o ticket atual',
  },
  {
    name: 'ai',
    description: 'Fazer uma pergunta para a IA',
    options: [
      {
        name: 'pergunta',
        description: 'Sua pergunta para a IA',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'setup',
    description: 'Configurar o sistema de tickets (Admin only)',
  },
];

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

// Sistema de armazenamento de tickets
let tickets = {};

// Carregar tickets salvos
function loadTickets() {
  try {
    if (fs.existsSync('tickets.json')) {
      const data = fs.readFileSync('tickets.json', 'utf8');
      tickets = JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar tickets:', error);
    tickets = {};
  }
}

// Salvar tickets
function saveTickets() {
  try {
    fs.writeFileSync('tickets.json', JSON.stringify(tickets, null, 2));
  } catch (error) {
    console.error('Erro ao salvar tickets:', error);
  }
}

// Função para criar embed
function createEmbed(title, description, color = 0x00AE86) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: 'Bot Ticket IA • Sistema Profissional' });
}

// Função IA
async function askAI(question, context = '') {
  // Verificar se OpenAI está disponível
  if (!openai) {
    return 'ℹ️ **IA não disponível** - A integração com OpenAI não foi configurada.\n\n🎫 **Crie um ticket para falar com nossa equipe:**\nUse o comando `/ticket` para receber suporte humano personalizado!';
  }

  try {
    const systemPrompt = `Você é um assistente de suporte profissional e prestativo. 
    Responda de forma clara, educada e útil. Se necessário, sugira criar um ticket para suporte humano.
    Contexto adicional: ${context}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Erro na IA:', error);
    return 'Desculpe, não consegui processar sua pergunta no momento. Tente novamente ou crie um ticket para suporte humano.';
  }
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
    saveTickets();

    // Embed de boas-vindas
    const welcomeEmbed = createEmbed(
      '🎫 Ticket Criado',
      `Olá ${user}! Bem-vindo ao seu ticket de suporte.\n\n**Como funciona:**\n• Descreva seu problema ou dúvida\n• Nossa equipe ou IA irá te ajudar\n• Use \`/ai pergunta\` para consultar a IA\n• Quando resolvido, clique em "Fechar Ticket"\n\n**Ticket ID:** \`${ticketChannel.id}\``
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

    // Log do sistema
    if (config.logChannelId) {
      const logChannel = guild.channels.cache.get(config.logChannelId);
      if (logChannel) {
        const logEmbed = createEmbed(
          '📝 Novo Ticket',
          `**Usuário:** ${user} (${user.tag})\n**Canal:** ${ticketChannel}\n**ID:** \`${ticketChannel.id}\``,
          0x00FF00
        );
        await logChannel.send({ embeds: [logEmbed] });
      }
    }

    await interaction.reply({
      embeds: [createEmbed('✅ Ticket Criado!', `Seu ticket foi criado em ${ticketChannel}`)],
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
    // Atualizar status
    tickets[channelId].status = 'closed';
    tickets[channelId].closedAt = new Date().toISOString();
    tickets[channelId].closedBy = interaction.user.id;
    saveTickets();

    // Embed de fechamento
    const closeEmbed = createEmbed(
      '🔒 Ticket Fechado',
      `Ticket fechado por ${interaction.user}\n\nEste canal será deletado em 10 segundos.\n\n**Avaliação:** Deixe seu feedback sobre o atendimento!`,
      0xFF9900
    );

    await interaction.reply({ embeds: [closeEmbed] });

    // Log do sistema
    if (config.logChannelId) {
      const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
      if (logChannel) {
        const logEmbed = createEmbed(
          '🔒 Ticket Fechado',
          `**Canal:** #${interaction.channel.name}\n**Fechado por:** ${interaction.user} (${interaction.user.tag})\n**ID:** \`${channelId}\``,
          0xFF9900
        );
        await logChannel.send({ embeds: [logEmbed] });
      }
    }

    // Deletar canal após delay
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

// Setup do sistema
async function setupSystem(interaction) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      embeds: [createEmbed('❌ Sem Permissão', 'Apenas administradores podem usar este comando.', 0xFF0000)],
      ephemeral: true
    });
  }

  const setupEmbed = createEmbed(
    '🛠️ Sistema de Tickets',
    '**Clique no botão abaixo para criar um ticket de suporte!**\n\n📋 **Nossos serviços:**\n• Desenvolvimento de Bots Discord\n• Sistemas de Tickets Personalizados\n• Integração com IA\n• Suporte Técnico 24/7\n\n💬 **O que você pode fazer:**\n• Solicitar orçamentos\n• Tirar dúvidas técnicas\n• Reportar problemas\n• Sugestões e feedback',
    0x7289DA
  );

  const ticketButton = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('🎫 Criar Ticket')
        .setStyle(ButtonStyle.Primary)
    );

  await interaction.reply({
    embeds: [setupEmbed],
    components: [ticketButton]
  });
}

// Event: Bot pronto
client.once('ready', async () => {
  console.log(`🤖 Bot ${client.user.tag} está online!`);
  console.log(`🌐 Conectado em ${client.guilds.cache.size} servidor(s)`);
  
  loadTickets();
  await registerCommands();
  
  // Status do bot
  client.user.setActivity('🎫 Sistema de Tickets com IA', { type: 'WATCHING' });
});

// Event: Comandos slash
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand() && !interaction.isButton()) return;

  try {
    if (interaction.isCommand()) {
      const { commandName } = interaction;

      switch (commandName) {
        case 'ticket':
          await createTicket(interaction);
          break;
        case 'close':
          await closeTicket(interaction);
          break;
        case 'ai':
          const question = interaction.options.getString('pergunta');
          await interaction.deferReply();
          const response = await askAI(question);
          const aiColor = openai ? 0x9B59B6 : 0xFF9900;
          const aiEmbed = createEmbed('🤖 Assistente IA', response, aiColor);
          await interaction.editReply({ embeds: [aiEmbed] });
          break;
        case 'setup':
          await setupSystem(interaction);
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

// Event: Mensagens (para IA automática em tickets)
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const ticket = tickets[message.channel.id];
  if (ticket && ticket.status === 'open') {
    // Salvar mensagem no histórico
    ticket.messages.push({
      author: message.author.tag,
      content: message.content,
      timestamp: new Date().toISOString(),
    });
    saveTickets();

    // IA automática se não houver staff online
    const channel = message.channel;
    const supportRole = message.guild.roles.cache.get(config.supportRoleId);
    
    if (supportRole) {
      const onlineStaff = supportRole.members.filter(member => 
        member.presence?.status !== 'offline'
      );
      
      // Se não há staff online, usuário fez pergunta e IA está disponível
      if (onlineStaff.size === 0 && message.content.includes('?') && openai) {
        setTimeout(async () => {
          const aiResponse = await askAI(message.content, 'Este usuário está em um ticket de suporte');
          const aiEmbed = createEmbed(
            '🤖 Resposta Automática da IA',
            `${aiResponse}\n\n*Resposta gerada automaticamente. Nossa equipe será notificada.*`,
            0x9B59B6
          );
          await channel.send({ embeds: [aiEmbed] });
        }, 3000);
      }
    }
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