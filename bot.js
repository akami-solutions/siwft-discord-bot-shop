require('dotenv').config();
// Register the Libs
const {Client,  GatewayIntentBits, Events} = require('discord.js');
const {} = require(__dirname+'/products.json');
const config = process.env;


const bot = new  Client({intents: [GatewayIntentBits.Guilds]})

bot.once(Events.ClientReady, readyClient => {
    console.log(`The bot is running as ${readyClient.user.username}`)
})


bot.login(config.DISCORD_BOT_TOKEN).then(r => {

});