
require('dotenv').config();
// Register the Libs
const {Client,  GatewayIntentBits, Events, Collection, REST, Routes} = require('discord.js');
const {join} = require("path");
const {readdirSync, readFileSync} = require("fs");
// Include the products.json file to initialize the products.
const {} = require(__dirname+'/products.json');
const config = process.env;

/**
 * @description Event Handler, Command Handler by discordjs.guide but a bit changed
 * @type {Client<boolean>}
 */


// Create a new Discord Client with the name "bot"
const bot = new  Client({intents: [GatewayIntentBits.Guilds]})

// Command Handler Setup
bot.commands = new Collection();
const commands = [];
const foldersPath = join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            bot.commands.set(command.data.name, command);
            commands.push(command.data.toJSON())
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
// Send the commands to Discord
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_BOT_ID, process.env.DISCORD_BOT_DEV_SERVER),
            { body: commands },
        );
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
// Event Handler
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args));
    } else {
        bot.on(event.name, (...args) => event.execute(...args));
    }
}


// Let the Bot login into his Account.
bot.login(config.DISCORD_BOT_TOKEN).then(r => {
    console.log(`The bot is starting up...`);
}).catch(e => {
    console.error("There was an error starting the Bot with the registered Token.\n"+e.message)
})