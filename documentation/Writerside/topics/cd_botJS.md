# The bot.js file

Die `bot.js` Datei ist eines der wichtigsten Dateien in diesem Projekt, das es gibt. In dieser Datei befindet sich Folgendes:
* Initialisierung der SlashCommands
* Initialisierung der Bot Events
* Starten des Bots

allein an der Aufzählung sollte einem klar sein, warum die so wichtig ist.

## Nutzung von Drittanbieter Projekten

Ja auch ich verwende in diesem Projekt Drittanbieter Packete. Folgendes wird verwendet:

| Package            | Usage                                                                                                                                                                                                          |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| discord.js         | Wir verwenden discord.js, da es mit dem Package einfacher ist zu Arbeiten und die Userbase groß genug ist, falls man doch mal Hilfe braucht bei einer änderung.                                                |
| dotenv             | Dotenv verwenden wir um eine Sichere implementation von der .env Datei bzw Environment Variablen zu haben. Wir brauchen Environment Variablen um Daten wie Bot Token, Bot ID usw. zwischen Speichern zu können |
| pino / pino-pretty | Pino und pino-pretty ist an sich nicht wirklich essenziell für dieses Projekt allerdings sind Konsolen Nachrichten damit dann besser lesbar und formatiert.                                                    |

diese packete werden zwischen Zeile 1 bis 6 importiert:

```Javascript
require('dotenv').config();
// Register the Libs
const {Client,  GatewayIntentBits, Events, Collection, REST, Routes} = require('discord.js');
const {join} = require("path");
const {readdirSync, readFileSync} = require("fs");
const config = process.env;
```

wir versuchen alle externen imports und variablen so hoch wie möglich zu haben um eine Schnelle übersicht und änderbarkeit der Variablen garantieren zu können.

## Der EventHandler

Bevor wir mit dem `CommandHandler` beginnen müssen wir uns den EventHandler anschauen. Der EventHandler ist dafür da
um alle Events die es bei Discord gibt effizient implementieren zu können. Hierfür habe ich mir auch hier den Code aus
der discordjs.guide Seite genommen und auch den hier ein bisschen abgeändert. Der EventHandler ist generell etwas kompakter.
Das liegt daran das wir bei dem EventHandler nicht so viel registrieren und implementieren müssen um es funktional zu
bekommen. 

Hier ist der Event Handler Code in einzelansicht:

```Javascript
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
```

## Der CommandHandler

Um ein gutes Management über seine Befehle haben zu können verwende auch ich hier einen CommandHandler. 
Dieser CommandHandler befindet sich im Code zwischen den Zeilen 17-51. Ich habe den gnz schlichten CommandHandler von 
der Discordjs.guide Webseite genommen und den ein bisschen abgeändert so das man sich ein paar Schritte erspart und man 
den Bot nicht stetig Neustarten muss oder einzelne Commands einzeln Registrieren zu müssen. Da wir SlashCommands verwenden
senden wir auch bei jedem Bot Start direkt alle SlashCommands an Discord. Hierfür verwende ich eine implementation von dem Discord.js Packet.

Hier ist der Command Handler Code nochmal in einzelansicht:

```Javascript
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
```

## Verbinden zum Discord Bot

Wie schon erwähnt ist die `bot.js` Datei das sogenannte herzstück dieses Projektes, und hier wird es auch noch einmal
sichtbar. Den hier wird nämlich der Bot erst gestartet. Ja! Ganz am Ende unten. Wir müssen nämlich alles initialisieren
und die befehle hochladen bevor wir den Bot starten weil erst dann ist wirklich eine volle funktionsfähigkeit garantiert.


```Javascript
bot.login(config.DISCORD_BOT_TOKEN).then(r => {
    console.log(`The bot is starting up...`);
}).catch(e => {
    console.error("There was an error starting the Bot with the registered Token.\n"+e.message)
})
```