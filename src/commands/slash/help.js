const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports.data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show available commands')
  .setDMPermission(true);

module.exports.run = async (interaction) => {
  const embed = new EmbedBuilder()
    .setTitle('🤖 Bot Commands')
    .setColor(0x5865F2)
    .addFields(
      { name: '/help', value: 'Show this help message' },
      { name: '/ping', value: 'Check if the bot is responding' },
      { name: '/message [text]', value: 'Send a message to the bot owner' }
    );
  if (interaction.user.id === config.ownerId) {
    embed.addFields(
      { name: '\n🔒 Owner Commands', value: 'Only available to the bot owner' },
      { name: '/purge [count]', value: 'Delete your messages (server only)' }
    );
  }
  await interaction.reply({ embeds: [embed], ephemeral: true });
};
