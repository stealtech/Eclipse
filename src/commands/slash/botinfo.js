const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { formatUptime } = require('../../utils/format');

module.exports.data = new SlashCommandBuilder()
  .setName('botinfo')
  .setDescription('Show bot application information')
  .setDMPermission(true);

module.exports.run = async (interaction) => {
  try {
    const client = interaction.client;
    const app = await client.application.fetch();
    const owner = app.owner || { tag: 'Unknown' };
    const embed = new EmbedBuilder()
      .setTitle('🤖 Bot Information')
      .setColor('#2f3136')
      .addFields(
        { name: 'Bot Name', value: client.user.tag, inline: true },
        { name: 'Bot ID', value: client.user.id, inline: true },
        { name: 'Owner', value: typeof owner === 'object' ? owner.tag : owner, inline: true },
        { name: 'Created At', value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Guilds', value: client.guilds.cache.size.toString(), inline: true },
        { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: 'DM Support', value: '✅ Enabled', inline: true },
        { name: 'Node.js', value: process.version, inline: true },
        { name: 'Discord.js', value: require('discord.js').version, inline: true },
        { name: 'Uptime', value: formatUptime(process.uptime()), inline: true }
      )
      .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
      .setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (e) {
    console.error('Error in botinfo:', e);
    interaction.reply({ content: '❌ An error occurred while fetching bot information.', ephemeral: true });
  }
};
