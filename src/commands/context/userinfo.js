const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports.data = new ContextMenuCommandBuilder()
  .setName('User Info')
  .setType(ApplicationCommandType.User)
  .setDMPermission(true);

module.exports.run = async (interaction) => {
  const targetUser = interaction.targetUser;
  const fetched = await interaction.client.users.fetch(targetUser.id, { force: true }).catch(() => null);
  const member = interaction.guild?.members.cache.get(targetUser.id) || (interaction.guild ? await interaction.guild.members.fetch(targetUser.id).catch(()=>null) : null);
  const avatarURL = targetUser.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false });
  const avatarFormats = ["png","jpg","webp"].concat(targetUser.avatar?.startsWith('a_') ? ['gif'] : [] )
    .map(ext => `[${ext}](${targetUser.displayAvatarURL({ size: 1024, extension: ext, forceStatic: ext !== 'gif' })})`).join(' | ');
  const bannerURL = fetched?.bannerURL?.({ size: 1024, extension: 'png', forceStatic: false });

  let badgeList = 'None';
  try {
    const flags = fetched?.flags?.toArray?.() || [];
    if (flags.length) badgeList = flags.join(', ');
  } catch {}
  let presenceStatus = 'Unknown';
  let activityLines = [];
  if (member?.presence) {
    presenceStatus = member.presence.status;
    for (const act of member.presence.activities) {
      if (act.type === 4) {
        activityLines.push(`Custom: ${act.state || '—'}`);
      } else {
        activityLines.push(`${act.type}: ${act.name}${act.details ? ` - ${act.details}` : ''}`.slice(0, 256));
      }
    }
  }
  if (!activityLines.length) activityLines = ['None'];

  // Roles
  let roleMentionList = 'None';
  let roleCount = 0;
  let highestRole = 'None';
  if (member) {
    const roles = member.roles.cache.filter(r => r.id !== interaction.guild.id).sort((a,b)=>b.position - a.position);
    roleCount = roles.size;
    highestRole = roles.first()?.toString() || 'None';
    if (roles.size) {
      const roleMentions = roles.map(r => r.toString());
      let acc = '';
      const parts = [];
      for (const mention of roleMentions) {
        if ((acc + mention + ' ').length > 1000) { parts.push(acc.trim()); acc = ''; }
        acc += mention + ' ';
      }
      if (acc) parts.push(acc.trim());
      roleMentionList = parts[0];
      if (parts.length > 1) roleMentionList += ` +${parts.slice(1).reduce((n, p)=> n + p.split(/ +/).length,0)} more`;
    }
  }
  let permSummary = 'N/A';
  if (member) {
    const perms = member.permissions.toArray();
    permSummary = perms.slice(0, 8).join(', ') + (perms.length > 8 ? ` (+${perms.length - 8} more)` : '') || 'None';
  }
  const boostingSince = member?.premiumSince ? `<t:${Math.floor(member.premiumSince.getTime()/1000)}:R>` : 'No';
  const timedOut = member?.communicationDisabledUntilTimestamp ? `<t:${Math.floor(member.communicationDisabledUntilTimestamp/1000)}:R>` : 'No';
  const embed = new EmbedBuilder()
    .setTitle('👤 User Information')
    .setThumbnail(avatarURL)
    .addFields(
      { name: 'Tag', value: targetUser.tag, inline: true },
      { name: 'ID', value: targetUser.id, inline: true },
      { name: 'Mention', value: `<@${targetUser.id}>`, inline: true },
      { name: 'Bot', value: targetUser.bot ? '✅ Yes' : '❌ No', inline: true },
      { name: 'Created', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: true },
      { name: 'Account Age', value: `${Math.floor((Date.now() - targetUser.createdTimestamp)/86400000)}d`, inline: true },
      { name: 'Avatar', value: `[Link](${avatarURL})`, inline: true },
      { name: 'Avatar Formats', value: avatarFormats || 'N/A', inline: true },
      { name: 'Badges', value: badgeList.slice(0, 1024) },
      { name: 'Presence', value: presenceStatus, inline: true },
      { name: 'Activities', value: activityLines.join('\n').slice(0, 1024) },
    );

  if (bannerURL) {
    embed.addFields({ name: 'Banner', value: `[Link](${bannerURL})`, inline: true });
    embed.setImage(bannerURL);
  }

  if (fetched?.hexAccentColor) embed.setColor(fetched.hexAccentColor); else embed.setColor('#0099ff');

  if (member) {
    embed.addFields(
      { name: 'Nickname', value: member.nickname || 'None', inline: true },
      { name: 'Joined Server', value: member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A', inline: true },
      { name: 'Boosting', value: boostingSince, inline: true },
      { name: 'Timed Out Until', value: timedOut, inline: true },
      { name: 'Highest Role', value: highestRole, inline: true },
      { name: 'Role Count', value: roleCount.toString(), inline: true },
      { name: 'Permissions', value: permSummary },
      { name: 'Roles', value: roleMentionList }
    );
  }

  await interaction.reply({ embeds: [embed], ephemeral: true });
};
