const {SlashCommandBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy products via our Discord Bot'),
    execute(interaction) {
        const {readFileSync} = require('node:fs');
        let products = readFileSync(__dirname+'/../../products.json', {encoding: 'utf-8', flag: 'r'});
        products = JSON.parse(products);
        console.log(products["category"])
        interaction.reply("OK");
    }
}