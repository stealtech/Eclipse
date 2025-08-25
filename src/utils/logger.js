const chalk = require('chalk');
const readline = require('readline');
const { promisify } = require('util');
const sleep = promisify(setTimeout);
const os = require('os');

const clearTerminal = () => {
  const clearCommand = os.platform() === 'win32' ? 'cls' : 'clear';
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1BH');
  process.stdout.write(require('child_process').execSync(clearCommand).toString());
};
clearTerminal();

class Logger {
  static #spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  static #spinnerIndex = 0;
  static #spinnerInterval = null;
  static #lastLineLength = 0;

  static #logWithColor(prefix, message, color) {
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] ${prefix} ${message}`;
    console.log(color(formattedMessage));
    return formattedMessage.length;
  }

  static #clearLine() {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
  }

  static async #animateSpinner(prefix, text) {
    if (this.#spinnerInterval) return;
    
    this.#spinnerInterval = setInterval(() => {
      this.#clearLine();
      const spinnerFrame = this.#spinnerFrames[this.#spinnerIndex];
      process.stdout.write(chalk.blue(`[${spinnerFrame}] ${prefix} ${text}`));
      this.#spinnerIndex = (this.#spinnerIndex + 1) % this.#spinnerFrames.length;
    }, 100);
    await sleep(3000);
    this.stopSpinner();
  }

  static stopSpinner() {
    if (this.#spinnerInterval) {
      clearInterval(this.#spinnerInterval);
      this.#spinnerInterval = null;
      this.#clearLine();
    }
  }

  static async info(message) {
    this.stopSpinner();
    this.#logWithColor('[INFO]', message, chalk.blue);
  }

  static async success(message) {
    this.stopSpinner();
    this.#logWithColor('[SUCCESS]', message, chalk.green);
  }

  static async warning(message) {
    if (message.includes('selfbot functionality is against Discord ToS')) {
      return;
    }
    this.stopSpinner();
    this.#logWithColor('[WARNING]', message, chalk.yellow);
  }

  static async error(message) {
    this.stopSpinner();
    this.#logWithColor('[ERROR]', message, chalk.red);
  }

  static async botStatus(message) {
    this.stopSpinner();
    console.log(chalk.blue.bold(`[BOT] ${message}`));
  }

  static async selfbotStatus(message) {
    this.stopSpinner();
    console.log(chalk.magenta.bold(`[SELFBOT] ${message}`));
  }

  static async systemStatus(message) {
    this.stopSpinner();
    console.log(chalk.cyan.bold(`[SYSTEM] ${message}`));
  }

  static async loading(prefix, text) {
    this.stopSpinner();
    await this.#animateSpinner(prefix, text);
  }
}

module.exports = Logger;
