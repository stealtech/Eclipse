const { REST, Routes } = require('discord.js');

function clean(commands) {
  return commands.map(c => {
    const clone = { ...c };
    Object.keys(clone).forEach(k => clone[k] === undefined && delete clone[k]);
    return clone;
  });
}

async function registerAll(client, token, slashJson, contextJson) {
  const rest = new REST({ version: '10' }).setToken(token);
  const all = clean([...slashJson, ...contextJson]).map(cmd => ({
    ...cmd,
    dm_permission: cmd.dm_permission !== false,
    default_permission: true
  }));
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: [] });
    await rest.put(Routes.applicationCommands(client.user.id), { body: all });
    console.log(`Registered ${all.length} global commands.`);
  } catch (e) {
    console.error('Command registration error:', e);
  }
}

module.exports = { registerAll };
