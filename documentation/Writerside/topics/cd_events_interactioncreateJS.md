# The interactionCreate.js File

Die `interactionCreate.js` Datei ist sehr einfach aufgebaut. Sobald ein `InteractionCreate` Event erkannt wird,
wird dann geschaut ob es sich um ein SlashCommands befehl handelt. Wenn nicht dann wird einfach nur die anfrage zurückgesendet.
Allerdings wenn es sich um ein SlashCommand Handelt, werden dann alle Befehle geholt und wenn der BEfehl nicht gefunden 
wurde, wird dann genatwortet das es den Befehl nicht gibt. Wenn der Befehl existiert, dann wird der Befehl ausgeführt.

Die interactionCreate.js Datei:

```Javascript
const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};
```
## Im falle eines Fehler

Sollte beim ausführen des Befehls ein Fehler auftreten, wird der Benutezr der den Befehl ausführt dann Informiert das es
ein Fehler gab beim Ausführen seines Befehls.