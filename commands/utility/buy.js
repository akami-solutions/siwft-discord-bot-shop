const { SlashCommandBuilder } = require('@discordjs/builders');
const { readFileSync } = require('fs');

let products = readFileSync(__dirname + '/../../products.json', { encoding: 'utf-8', flag: 'r' });
products = JSON.parse(products);

function getProductObjects(productData) {
    // Loop through each product category
    const productObjects = [];
    for (const category in productData) {
        // Access each product within the category
        for (const product in productData[category]) {
            productObjects.push({
                name: productData[category][product].name,
                value: productData[category][product].product_id,
            });
        }
    }
    return productObjects;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buy products via our Discord Bot')
        .addStringOption(option =>
            option.setName("product")
                .setDescription("Please choose a product")
                .setRequired(true)
                .addChoices(...getProductObjects(products))),
    async execute(interaction) {
        await interaction.reply(interaction.options.get('product').value);
    }
};