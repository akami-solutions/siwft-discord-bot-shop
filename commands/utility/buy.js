const { SlashCommandBuilder } = require('@discordjs/builders');
const { readFileSync } = require('fs');
const {createPayment} = require(__dirname+"/../../functions/siwft_api");

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
            option.setName("product") // This is the Product ID
                .setDescription("Please choose a product")
                .setRequired(true)
                .addChoices(...getProductObjects(products)) // The ... is VERY important here! It's called the spread operator, and it's used to spread the array into individual elements
        )
        .addStringOption(option =>
            option.setName("username") // This is the Username of the User
                .setDescription("Please enter your Username")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("iwan") // This is the IWAN of the User
                .setDescription("Please enter your IWAN")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("token") // This is the API Key of the User. IDK why I thought it was a good idea to use the API key for this but that will change with the SIWFT API '^^
                .setDescription("Please enter your token")
                .setRequired(true)
        ),
    async execute(interaction) {
        // Get the selected product and get then the price from the products.json and then create the payment

        // Create the payment Sender IWAN, Receiver IWAN, Amount, Description, Key, Username
        const payment = await createPayment(interaction.options.get('iwan').value, "AT10000008414712856461", 2, interaction.options.get('product').value, interaction.options.get('token').value, interaction.options.get('username').value);
        // If the payment was successful, reply with the product ID
        if (payment.success)
            // Make the Message just visible to the user who executed the command
            interaction.reply({content: "Payment successful! Your product ID is: " + interaction.options.get('product').value+"\nPayment ID: "+payment.id, ephemeral: true}); // Prob. I'll add a better Message Formatting :3
        else
            interaction.reply({content: "\"Payment failed! Please try again later.", ephemeral: true});
    }
};