process.removeAllListeners('warning');
process.env.NO_COLOR = '1';
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const { Client: SelfbotClient } = require('discord.js-selfbot-v13');
const path = require('path');
const config = require('./src/config');
const { formatUptime } = require('./src/utils/format');
const { loadSlashCommands, loadContextCommands } = require('./src/commandLoader');
const { registerAll } = require('./src/registerCommands');
const { handlePrefix } = require('./src/selfbot/prefixCommands');
const Logger = require('./src/utils/logger');

const slash = loadSlashCommands(path.join(__dirname, 'src/commands/slash'));
const context = loadContextCommands(path.join(__dirname, 'src/commands/context'));
const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageReactions,
    IntentsBitField.Flags.DirectMessageTyping,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildPresences
  ],
  partials: ['MESSAGE','CHANNEL','REACTION','USER','GUILD_MEMBER'],
  allowedMentions: { parse: ['users','roles'], repliedUser: true },
  presence: { status: 'online', activities: [{ name: 'DM me with /help', type: 'WATCHING' }] },
  apiRequestMethod: 'sequential',
  restTimeOffset: 0
});
const selfbot = new SelfbotClient({ checkUpdate: false, syncStatus: false, patchVoice: false });
let botReady = false;
let selfbotReady = false;

function checkAllReady() {
  if (botReady && selfbotReady) {
    Logger.systemStatus('Both clients are ready!');
  }
}

bot.on('clientReady', async () => {
  botReady = true;
  await Logger.botStatus(`Logged in as ${bot.user.tag}`);
  await Logger.warning('Using selfbot functionality is against Discord ToS. Use at your own risk!');
  
  try {
    await Logger.loading('BOT', 'Registering commands...');
    await registerAll(bot, config.botToken, slash.json, context.json);
    await Logger.botStatus('Commands registered!');
    checkAllReady();
  } catch (e) {
    await Logger.error(`Failed to register commands: ${e.message}`);
  }
});

selfbot.on('ready', async () => {
  selfbotReady = true;
  await Logger.selfbotStatus(`Logged in as ${selfbot.user.username}`);
  checkAllReady();
});

bot.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isUserContextMenuCommand()) {
      const cmd = context.map.get(interaction.commandName);
      if (cmd) return cmd.run(interaction);
    }
    if (!interaction.isChatInputCommand()) return;
    const cmd = slash.map.get(interaction.commandName);
    if (!cmd) return;
    if (cmd.ownerOnly && interaction.user.id !== config.ownerId) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }
    await cmd.run(interaction, selfbot);
  } catch (e) {
    Logger.error(`Interaction error: ${e.message}`);
    if (!interaction.replied && !interaction.deferred) {
      interaction.reply({ content: 'There was an error executing that command!', ephemeral: true }).catch(()=>{});
    } else {
      interaction.editReply({ content: 'There was an error executing that command!' }).catch(()=>{});
    }
  }
});
selfbot.on('messageCreate', (m) => handlePrefix(m, bot, selfbot));
for (const emitter of [selfbot, bot, process]) {
  emitter.on?.('error', (e) => Logger.error(e.message));
}

process.on('unhandledRejection', e => Logger.error(`Unhandled rejection: ${e.message}`));
process.on('uncaughtException', e => {
  Logger.error(`Uncaught exception: ${e.message}`);
  process.exit(1);
});

async function start() {
  try {
    await Logger.botStatus('Logging in...');
    await bot.login(config.botToken);
    
    await Logger.selfbotStatus('Logging in...');
    await selfbot.login(config.userToken);
  } catch (e) {
    await Logger.error(`Failed to log in: ${e.message}`);
    process.exit(1);
  }
}
start();
process.on('SIGINT', () => {
  console.log(chalk.yellow('\nShutting down...'));
  selfbot.destroy();
  bot.destroy();
  process.exit(0);
});
