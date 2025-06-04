import express from 'express';
import twilio from 'twilio';

const app = express();
app.use(express.urlencoded({ extended: false }));

app.post('/webhook', (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const message = req.body.Body?.trim().toLowerCase();

  console.log('📩 Mensagem recebida:', message);

  if (message.includes('oi') || message.includes('olá')) {
    twiml.message('👷‍♂️ Olá! Seja bem-vindo(a) ao *Bot Gesso*! Está buscando uma amizade ou saber mais sobre nossos serviços de gesso? 😊');
  } else if (message.includes('amigo') || message.includes('amizade')) {
    twiml.message('❤️ Claro! A amizade é como gesso bem feito: fortalece, molda e dá forma à vida. Vamos conversar!');
  } else if (message.includes('gesso')) {
    twiml.message('🔨 Trabalhamos com forros, sancas, molduras e muito mais! Fale com a gente para orçamentos ou ideias!');
  } else if (message.includes('horário')) {
    twiml.message('🕐 Atendemos de segunda a sábado, das 8h às 18h.');
  } else {
    twiml.message(`🤔 Não entendi bem... mas estou aqui pra te ouvir! Mande "oi", "amizade", "gesso" ou "horário"!`);
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Bot Gesso rodando na porta ${PORT}`);
});
