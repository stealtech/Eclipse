const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');

module.exports.data = new SlashCommandBuilder()
  .setName('message')
  .setDescription('Send a message to the bot owner')
  .setDMPermission(true)
  .addStringOption(o => o.setName('text').setDescription('Your message').setRequired(true));

module.exports.run = async (interaction) => {
  const text = interaction.options.getString('text');
  try {
    const owner = await interaction.client.users.fetch(config.ownerId);
    await owner.send(`📩 New message from ${interaction.user.tag} (${interaction.user.id}):\n> ${text}`);
    await interaction.reply({ content: '✅ Your message has been sent to the bot owner!', ephemeral: true });
  } catch (e) {
    console.error('Error sending owner message:', e);
    await interaction.reply({ content: '❌ Failed to send your message.', ephemeral: true });
  }
};
