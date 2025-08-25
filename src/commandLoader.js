const fs = require('fs');
const path = require('path');

function loadSlashCommands(dir) {
  const commands = [];
  const map = new Map();
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const cmd = require(filePath);
    if (!cmd.data) continue;
    commands.push(cmd.data.toJSON());
    map.set(cmd.data.name, cmd);
  }
  return { json: commands, map };
}

function loadContextCommands(dir) {
  const commands = [];
  const map = new Map();
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const cmd = require(filePath);
    if (!cmd.data) continue;
    commands.push(cmd.data.toJSON());
    map.set(cmd.data.name, cmd);
  }
  return { json: commands, map };
}

module.exports = { loadSlashCommands, loadContextCommands };
