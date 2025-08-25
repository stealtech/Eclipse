const { SlashCommandBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription("Check the bot's latency")
  .setDMPermission(true);

module.exports.run = async (interaction) => {
  const start = Date.now();
  await interaction.deferReply({ ephemeral: true });
  const latency = Date.now() - start;
  await interaction.editReply(`🏓 Pong! \`${latency}ms\``);
};
