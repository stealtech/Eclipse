# Discord Eclipse Self-Bot

> [!WARNING]
> **I don't take any responsibility for blocked Discord accounts that used this module.**

> [!CAUTION]
> **Using this on a user account is prohibited by the [Discord TOS](https://discord.com/terms) and can lead to the account being banned.**

## 📝 About

A powerful self-bot built with `discord.js-selfbot-v13` that provides various utility commands and features. This self-bot allows you to interact with Discord using both slash commands and prefix commands.

## 🚀 Features

### Slash Commands
- `/help` - Shows all available commands
- `/ping` - Check bot's latency and API response time
- `/botinfo` - Display information about the bot
- `/message [content]` - Send a message through the bot
- `/purge [amount]` - Delete a specified number of messages (owner only)

### Context Menu Commands
- `User Info` - Right-click a user to view their information

### Prefix Commands (Use with configured prefix, default: `-`)
- `help` or `commands` - Show help menu
- `ping` - Check latency
- `botinfo` - Show bot information
- `userinfo [@user]` - Show user information
- `purge [amount]` - Delete messages
- `message [text]` - Send a message
- `test` - Test command

### Additional Features
- Clean terminal interface with status indicators
- Automatic command response cleanup (configurable)
- Support for both guild and DM commands
- Owner-only command protection

## ⚙️ Installation

### Prerequisites
- Node.js 20.18.0 or newer
- npm (comes with Node.js)
- A Discord account token
- Basic knowledge of Discord API and self-bot risks

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/stealtech/Eclipse
   cd Eclipse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the bot:
   - Copy `.env.example` to `.env`
   - Fill in your Discord token and other configuration

4. Start the self-bot:
   ```bash
   npm start
   ```

## ⚠️ Important Notes

1. **Account Safety**:
   - Using self-bots violates Discord's Terms of Service
   - Your account could be permanently banned
   - Use at your own risk

2. **Best Practices**:
   - Don't spam commands
   - Keep the self-bot usage minimal
   - Don't use it on important accounts

3. **Rate Limits**:
   - Be aware of Discord's rate limits
   - The bot includes basic rate limit handling

## 🔧 Configuration

Edit the `config.js` file to configure:
- `DISCORD_TOKEN`: Your Discord account token
- `PREFIX`: Command prefix (default: `-`)
- `OWNER_ID`: Your Discord user ID
- `TEST_GUILD_ID`: (Optional) Guild ID for testing commands

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is for educational purposes only. Use at your own risk.

## 📜 Command Reference

### Slash Commands

#### `/help`
Shows all available commands and usage information.

#### `/ping`
Check the bot's latency and API response time.

#### `/botinfo`
Displays information about the bot including uptime and statistics.

#### `/message [content]`
Sends a message through the bot.

#### `/purge [amount]`
Deletes a specified number of messages (owner only).

### Prefix Commands (Default: `-`)

#### `-help` or `-commands`
Shows the help menu with all available commands.

#### `-ping`
Checks the bot's response time.

#### `-botinfo`
Displays information about the bot.

#### `-userinfo [@user]`
Shows information about a user. If no user is mentioned, shows your own info.

#### `-purge [amount]`
Deletes a specified number of your own messages in the current channel.

#### `-message [text]`
Sends a message through the bot.

## 🛡️ Safety

- The bot includes basic error handling and rate limit protection
- Sensitive commands are restricted to the owner
- Commands that could be disruptive have safety checks

## 📈 Performance

The bot is designed to be lightweight and efficient, with:
- Minimal memory usage
- Optimized event handling
- Clean code structure

## 📚 Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/docs/intro)
- [Node.js Documentation](https://nodejs.org/en/docs/)

## 🌟 Support

For support, please [open an issue](https://github.com/yourusername/your-repo/issues) on GitHub.

