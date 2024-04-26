require('dotenv').config();
// Register the Libs
const {Client,  GatewayIntentBits} = require('discord.js');
const {} = require('products.json');
const config = process.env;


const bot = new  Client({intents: [GatewayIntentBits.Guilds]})



bot.login(config.DISCORD_BOT_TOKEN).then(r => {

});