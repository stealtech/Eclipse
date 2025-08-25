const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');

module.exports.data = new SlashCommandBuilder()
  .setName('purge')
  .setDescription('Delete your messages (server only)')
  .setDMPermission(false)
  .addIntegerOption(o => o.setName('count').setDescription('Number of messages to delete (1-100)').setRequired(true).setMinValue(1).setMaxValue(100));

module.exports.ownerOnly = true;

module.exports.run = async (interaction, selfbot) => {
  const count = interaction.options.getInteger('count');
  await interaction.deferReply({ ephemeral: true });
  try {
    const channel = await selfbot.channels.fetch(interaction.channelId);
    if (!channel) return interaction.editReply('Could not access this channel with your user account.');
    const messages = await channel.messages.fetch({ limit: 100 });
    const selfMessages = messages.filter(m => m.author.id === selfbot.user.id).first(count);
    if (!selfMessages.length) return interaction.editReply('No messages found to delete.');
    for (const msg of selfMessages) {
      await msg.delete().catch(()=>{});
      await new Promise(r => setTimeout(r, 1000));
    }
    await interaction.editReply(`Deleted ${selfMessages.length} message${selfMessages.length !== 1 ? 's' : ''}.`);
  } catch (e) {
    console.error('Error purging:', e);
    interaction.editReply('An error occurred while trying to delete messages.');
  }
};
