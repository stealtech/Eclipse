const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const { formatUptime } = require('../utils/format');

async function handlePrefix(message, bot, selfbot) {
  if (message.author.bot || !message.content.startsWith(config.prefix)) return;
  try { await message.delete().catch(()=>{}); } catch {}
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  // Flag handling (-s => sticky / do not auto-delete response)
  let sticky = false;
  for (let i = args.length - 1; i >= 0; i--) {
    if (args[i] === '-s') { sticky = true; args.splice(i,1); }
  }
  const schedule = (msg, ms) => { if (!sticky) setTimeout(()=>msg.delete().catch(()=>{}), ms); };

  try {
    if (['help','commands'].includes(commandName)) {
      const lines = [
        '=== HELP ===',
        'General:',
        '  help | ping | botinfo',
        'Utility:',
        '  purge [count] | message [text] | test | userinfo [user]',
        '',
        'Flags:',
        '  -s  (sticky) keeps the response (no auto delete). Example: -userinfo -s @user',
        `Prefix: ${config.prefix}`
      ];
      const sent = await message.channel.send('```\n' + lines.join('\n') + '\n```');
      schedule(sent, 5000);
      return;
    }

    if (commandName === 'ping') {
      const msg = await message.channel.send('```\nPinging...\n```');
      const latency = msg.createdTimestamp - message.createdTimestamp;
      const edited = await msg.edit('```\nPong! Latency: ' + latency + 'ms | API: ' + Math.round(selfbot.ws.ping) + 'ms\n```');
      schedule(edited, 5000);
      return;
    }

    if (commandName === 'botinfo') {
      const app = await bot.application.fetch();
      const owner = app.owner || { tag: 'Unknown' };
      const info = [
        '=== BOT INFORMATION ===',
        `Name: ${bot.user.tag}`,
        `ID: ${bot.user.id}`,
        `Owner: ${typeof owner === 'object' ? owner.tag : owner}`,
        `Created: ${new Date(bot.user.createdTimestamp).toUTCString()}`,
        `Guilds: ${bot.guilds.cache.size}`,
        `Ping: ${bot.ws.ping}ms`,
        `Node: ${process.version}`,
        `discord.js: ${require('discord.js').version}`,
        `Uptime: ${formatUptime(process.uptime())}`
      ].join('\n');
      const sent = await message.channel.send('```\n' + info + '\n```');
      schedule(sent, 5000);
      return;
    }

    if (message.author.id !== selfbot.user.id) return;

    if (commandName === 'purge') {
      const count = parseInt(args[0]);
      if (isNaN(count) || count < 1 || count > 100) {
        const warn = await message.channel.send('```\nNumber between 1 and 100.\n```');
        schedule(warn, 4000);
        return;
      }
      const messages = await message.channel.messages.fetch({ limit: count + 1 });
      const userMessages = messages.filter(m => m.author.id === selfbot.user.id);
      await message.channel.bulkDelete(userMessages, true).catch(()=>{});
      const reply = await message.channel.send('```\nDeleted ' + (userMessages.size - 1) + ' messages.\n```');
      schedule(reply, 5000);
      return;
    }

    if (commandName === 'message') {
      const text = args.join(' ');
      if (!text) {
        const warn = await message.channel.send('```\nProvide a message.\n```');
        schedule(warn, 4000);
        return;
      }
      try {
        const owner = await bot.users.fetch(config.ownerId);
        await owner.send(`📨 New message from ${message.author.tag} (${message.author.id}):\n${text}`);
        const reply = await message.channel.send('```\nMessage sent to owner!\n```');
        schedule(reply, 5000);
        return;
      } catch {
        return message.react('❌');
      }
    }

    if (commandName === 'test') {
      const reply = await message.channel.send('```\nSelfbot prefix commands are working!\n```');
      schedule(reply, 5000);
      return;
    }

    if (['userinfo','ui'].includes(commandName)) {
      let targetUser;
      if (message.mentions.users.size) targetUser = message.mentions.users.first();
      else if (args[0]) {
        try { targetUser = await selfbot.users.fetch(args[0].replace(/[<@!>]/g,'')); } catch { targetUser = message.author; }
      } else targetUser = message.author;
      let member;
      if (message.guild) member = await message.guild.members.fetch(targetUser.id).catch(()=>null);

      const fetched = await selfbot.users.fetch(targetUser.id, { force: true }).catch(()=>null);
      const avatar = targetUser.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false });
      const banner = fetched?.bannerURL?.({ size: 1024, extension: 'png', forceStatic: false });

      const info = [
        '=== USER INFORMATION ===',
        `Username: ${targetUser.tag}`,
        `ID: ${targetUser.id}`,
        `Bot: ${targetUser.bot ? 'Yes' : 'No'}`,
        `Account Created: ${targetUser.createdAt.toUTCString()}`,
        `Avatar: ${avatar}`,
        `Banner: ${banner || 'None'}`,
        '\n=== SERVER INFORMATION ===',
        `Nickname: ${member?.nickname || 'None'}`,
        `Joined Server: ${member?.joinedAt ? member.joinedAt.toUTCString() : 'N/A'}`,
        `Roles: ${member?.roles.cache.size ? member.roles.cache.map(r=>r.name).join(', ') : 'None'}`
      ].join('\n');
      const reply = await message.channel.send('```\n' + info + '\n```');
      schedule(reply, 10000);
      return;
    }

    if (commandName === 'say') {
      const text = args.join(' ');
      if (!text) {
        const warn = await message.channel.send('```\nProvide a message.\n```');
        schedule(warn, 4000);
        return;
      }
      try { 
        const sent = await message.channel.send(text); 
        await message.react('✅'); 
        if (!sticky) schedule(sent, 5000);
      } catch { 
        const err = await message.channel.send('```\nFailed to send message.\n```');
        schedule(err, 4000);
      }
      return;
    }

    const reply = await message.channel.send('```\nUnknown command. Use ' + config.prefix + 'help for a list of commands.\n```');
    schedule(reply, 5000);
  } catch (e) {
    console.error('Selfbot command error:', e);
    message.react('❌').catch(()=>{});
  }
}

module.exports = { handlePrefix };
